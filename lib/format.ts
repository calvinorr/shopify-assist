/**
 * Price formatting utility for consistent currency display
 */

type Currency = 'GBP' | 'USD' | 'EUR';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
};

/**
 * Format a price with the appropriate currency symbol
 * @param price - Price in the base currency unit (e.g., 25.99 not 2599 cents)
 * @param currency - Currency code (defaults to GBP for Herbarium)
 * @returns Formatted price string (e.g., "£25.99")
 */
export function formatPrice(price: number | null, currency: Currency = 'GBP'): string {
  if (price === null || price === undefined) {
    return 'Price not set';
  }
  const symbol = CURRENCY_SYMBOLS[currency] || '£';
  return `${symbol}${price.toFixed(2)}`;
}

/**
 * Format a price range (for products with variants)
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @param currency - Currency code
 */
export function formatPriceRange(
  minPrice: number | null,
  maxPrice: number | null,
  currency: Currency = 'GBP'
): string {
  if (minPrice === null || maxPrice === null) {
    return 'Price not set';
  }
  const symbol = CURRENCY_SYMBOLS[currency] || '£';
  if (minPrice === maxPrice) {
    return `${symbol}${minPrice.toFixed(2)}`;
  }
  return `${symbol}${minPrice.toFixed(2)} - ${symbol}${maxPrice.toFixed(2)}`;
}
