/**
 * Shopify URL builder utilities
 * Uses environment variable for store domain to avoid hardcoding
 */

/**
 * Get the public-facing Shopify store URL
 * Falls back to herbariumdyeworks.com if not configured
 */
export function getStoreUrl(): string {
  return process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL || 'herbariumdyeworks.com';
}

/**
 * Build a product URL using the SEO-friendly handle
 * @param handle - Product handle (slug) from Shopify
 * @returns Full URL to the product page
 */
export function getProductUrl(handle: string): string {
  const domain = getStoreUrl();
  return `https://${domain}/products/${handle}`;
}

/**
 * Build a collection URL
 * @param handle - Collection handle from Shopify
 */
export function getCollectionUrl(handle: string): string {
  const domain = getStoreUrl();
  return `https://${domain}/collections/${handle}`;
}

/**
 * Build a cart URL with a product
 * @param variantId - Shopify variant ID
 * @param quantity - Quantity to add
 */
export function getAddToCartUrl(variantId: string, quantity: number = 1): string {
  const domain = getStoreUrl();
  return `https://${domain}/cart/add?id=${variantId}&quantity=${quantity}`;
}
