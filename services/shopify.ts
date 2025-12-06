import { shopifyGraphQL } from "@/lib/shopify";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq } from "drizzle-orm";
import type { ShopifyOrder } from "@/types/shopify";

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

  // Extract color from title pattern "Base Yarn - Color Name"
  // e.g., "Merino DK - Coraline" → "Coraline"
  // e.g., "Alpaca Silk - Peche Douce" → "Peche Douce"
  if (title.includes(" - ")) {
    const parts = title.split(" - ");
    if (parts.length >= 2) {
      return parts[parts.length - 1].trim();
    }
  }

  // Fallback: Check title for known traditional dye color names
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

// Orders GraphQL types
interface ShopifyOrderNode {
  id: string;
  name: string;
  createdAt: string;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  lineItems: {
    edges: Array<{
      node: {
        quantity: number;
      };
    }>;
  };
}

interface ShopifyOrdersResponse {
  orders: {
    edges: Array<{
      node: ShopifyOrderNode;
    }>;
  };
}

const ORDERS_QUERY = `
  query GetOrders($first: Int!, $query: String) {
    orders(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          name
          createdAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          lineItems(first: 10) {
            edges {
              node {
                quantity
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch recent orders from Shopify
 * @param days Number of days to look back (default: 30)
 */
export async function fetchRecentOrders(days: number = 30): Promise<ShopifyOrder[]> {
  // Calculate date threshold (e.g., "created_at:>=2025-11-06")
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - days);
  const dateString = dateThreshold.toISOString().split("T")[0]; // YYYY-MM-DD

  const query = `created_at:>=${dateString}`;

  try {
    const response: ShopifyOrdersResponse = await shopifyGraphQL(ORDERS_QUERY, {
      first: 250, // Shopify max per request
      query,
    });

    // Transform to simple format
    return response.orders.edges.map(({ node }) => {
      // Calculate total item count
      const itemCount = node.lineItems.edges.reduce(
        (sum, edge) => sum + edge.node.quantity,
        0
      );

      return {
        id: node.id.replace("gid://shopify/Order/", ""),
        orderNumber: node.name, // e.g., "#1001"
        date: node.createdAt,
        total: parseFloat(node.totalPriceSet.shopMoney.amount),
        currency: node.totalPriceSet.shopMoney.currencyCode,
        itemCount,
      };
    });
  } catch (err) {
    console.error("Failed to fetch Shopify orders:", err);
    throw err;
  }
}
