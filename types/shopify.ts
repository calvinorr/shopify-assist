// Shopify-specific types for orders and sales analytics

export interface ShopifyOrder {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  currency: string;
  itemCount: number;
}

export interface SalesAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  salesByDay: DailySales[];
}

export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
}
