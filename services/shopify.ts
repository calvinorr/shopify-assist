import { shopifyGraphQL } from "@/lib/shopify";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Known Herbarium color names for extraction
const KNOWN_COLORS = [
  "Madder Red",
  "Madder",
  "Indigo",
  "Indigo Deep",
  "Weld Yellow",
  "Weld",
  "Walnut",
  "Logwood",
  "Cochineal",
  "Osage",
  "Cutch",
  "Iron",
  "Marigold",
  "Quebracho",
  "Lac",
  "Natural",
  "Undyed",
];

// Shopify GraphQL types
interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  tags: string[];
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: string;
        inventoryQuantity: number | null;
      };
    }>;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
}

interface ShopifyProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProductNode;
      cursor: string;
    }>;
    pageInfo: {
      hasNextPage: boolean;
    };
  };
}

const PRODUCTS_QUERY = `
  query GetProducts($cursor: String) {
    products(first: 50, after: $cursor) {
      edges {
        node {
          id
          handle
          title
          description
          tags
          variants(first: 10) {
            edges {
              node {
                id
                title
                price
                inventoryQuantity
              }
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

/**
 * Extract color name from product title and tags
 * Herbarium naming: "Madder Red BFL", "Indigo Deep Merino"
 */
export function extractColor(title: string, tags: string[]): string | null {
  // Check tags first for explicit color tag (e.g., "color:weld-yellow")
  for (const tag of tags) {
    if (tag.toLowerCase().startsWith("color:")) {
      const colorPart = tag.slice(6).replace(/-/g, " ");
      // Capitalize words
      return colorPart
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
  }

  // Check title for known color names (longest match first)
  const sortedColors = [...KNOWN_COLORS].sort((a, b) => b.length - a.length);
  const titleLower = title.toLowerCase();

  for (const color of sortedColors) {
    if (titleLower.includes(color.toLowerCase())) {
      return color;
    }
  }

  return null;
}

/**
 * Fetch all products from Shopify (handles pagination)
 */
export async function fetchAllProducts(): Promise<ShopifyProductNode[]> {
  const allProducts: ShopifyProductNode[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const response: ShopifyProductsResponse = await shopifyGraphQL(PRODUCTS_QUERY, {
      cursor,
    });

    const edges = response.products.edges;
    for (const edge of edges) {
      allProducts.push(edge.node);
      cursor = edge.cursor;
    }

    hasNextPage = response.products.pageInfo.hasNextPage;
  }

  return allProducts;
}

/**
 * Transform Shopify product to database format
 */
function transformProduct(shopifyProduct: ShopifyProductNode) {
  const firstVariant = shopifyProduct.variants.edges[0]?.node;
  const imageUrls = shopifyProduct.images.edges.map((e) => e.node.url);

  // Sum inventory across all variants
  const totalInventory = shopifyProduct.variants.edges.reduce((sum, edge) => {
    return sum + (edge.node.inventoryQuantity ?? 0);
  }, 0);

  // Extract numeric ID from Shopify GID
  const shopifyProductId = shopifyProduct.id.replace("gid://shopify/Product/", "");

  return {
    id: shopifyProductId,
    shopifyProductId,
    handle: shopifyProduct.handle, // URL-friendly product slug
    name: shopifyProduct.title,
    description: shopifyProduct.description || null,
    color: extractColor(shopifyProduct.title, shopifyProduct.tags),
    tags: JSON.stringify(shopifyProduct.tags),
    imageUrls: JSON.stringify(imageUrls),
    inventory: totalInventory,
    price: firstVariant ? parseFloat(firstVariant.price) : null,
    currency: "GBP", // Herbarium uses GBP
    updatedAt: new Date(),
  };
}

export interface SyncResult {
  success: boolean;
  synced: number;
  errors: string[];
}

/**
 * Sync all products from Shopify to database
 */
export async function syncProductsToDb(): Promise<SyncResult> {
  const errors: string[] = [];
  let synced = 0;

  try {
    const shopifyProducts = await fetchAllProducts();

    for (const shopifyProduct of shopifyProducts) {
      try {
        const productData = transformProduct(shopifyProduct);

        // Upsert: insert or update on conflict
        const existing = await db
          .select()
          .from(products)
          .where(eq(products.shopifyProductId, productData.shopifyProductId))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(products)
            .set(productData)
            .where(eq(products.shopifyProductId, productData.shopifyProductId));
        } else {
          await db.insert(products).values({
            ...productData,
            createdAt: new Date(),
          });
        }

        synced++;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        errors.push(`Failed to sync product ${shopifyProduct.title}: ${message}`);
      }
    }

    return { success: errors.length === 0, synced, errors };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, synced, errors: [message] };
  }
}
