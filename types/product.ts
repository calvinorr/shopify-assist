export interface Product {
  id: string;
  shopifyProductId: string | null;
  handle: string | null;
  name: string;
  description: string | null;
  color: string | null;
  tags: string[];
  imageUrls: string[];
  inventory: number | null;
  price: number | null;
  currency: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  vendor: string;
  productType: string;
  tags: string[];
  variants: ShopifyVariant[];
  images: ShopifyImage[];
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: string;
  inventoryQuantity: number;
}

export interface ShopifyImage {
  id: string;
  src: string;
  altText: string | null;
}

export interface ColorSales {
  color: string;
  totalSales: number;
  ukSales: number;
  usSales: number;
  canadaSales: number;
  otherSales: number;
}
