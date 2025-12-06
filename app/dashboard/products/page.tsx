"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Package, X, Check } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";

interface Product {
  id: string;
  shopifyProductId: string;
  handle: string | null;
  name: string;
  description: string | null;
  color: string | null;
  tags: string[];
  imageUrls: string[];
  inventory: number | null;
  price: number | null;
  currency: string | null;
  createdAt: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchColors();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedColor, inStockOnly]);

  async function fetchColors() {
    try {
      const res = await fetch("/api/products/stats");
      if (!res.ok) throw new Error("Failed to fetch colors");
      const data = await res.json();
      const colors = data.colorDistribution
        .map((item: { color: string | null }) => item.color)
        .filter((color: string | null): color is string => color !== null)
        .sort();
      setAvailableColors(colors);
    } catch (err) {
      console.error("Failed to load colors:", err);
    }
  }

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("limit", "50");
      if (selectedColor) {
        params.set("color", selectedColor);
      }
      if (inStockOnly) {
        params.set("inStock", "true");
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");

      const data: ProductsResponse = await res.json();
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      (product.color?.toLowerCase() || "").includes(query) ||
      product.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  function clearFilters() {
    setSearchQuery("");
    setSelectedColor("");
    setInStockOnly(false);
  }

  const hasActiveFilters = searchQuery || selectedColor || inStockOnly;

  return (
    <>
      <Header
        title="Products"
        description={`${total.toLocaleString()} products synced from Shopify`}
      />

      <div className="p-6" style={{ backgroundColor: "var(--background)" }}>
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--text-muted)" }}
              />
              <Input
                type="text"
                placeholder="Search products by name or color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Color Filter */}
            <div className="min-w-[180px]">
              <Select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                <option value="">All Colors</option>
                {availableColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </Select>
            </div>

            {/* In Stock Toggle */}
            <Button
              variant={inStockOnly ? "primary" : "outline"}
              size="md"
              onClick={() => setInStockOnly(!inStockOnly)}
              style={inStockOnly ? { backgroundColor: "var(--success)", color: "white" } : undefined}
            >
              {inStockOnly && <Check className="h-4 w-4 mr-1" />}
              In Stock
            </Button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="outline" size="md" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: "var(--text-muted)" }}>Active filters:</span>
              {searchQuery && (
                <Badge variant="indigo">Search: {searchQuery}</Badge>
              )}
              {selectedColor && (
                <Badge variant="warning">Color: {selectedColor}</Badge>
              )}
              {inStockOnly && (
                <Badge variant="success">In Stock Only</Badge>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-8">
            <div className="text-center">
              <p className="text-lg font-medium" style={{ color: "var(--danger)" }}>
                {error}
              </p>
              <Button
                variant="outline"
                size="md"
                className="mt-4"
                onClick={fetchProducts}
              >
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* No Products */}
        {!loading && !error && products.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--background)" }}
              >
                <Package className="h-8 w-8" style={{ color: "var(--text-muted)" }} />
              </div>
              <h3
                className="mb-2 text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                No products found
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Sync your Shopify products to get started
              </p>
            </div>
          </Card>
        )}

        {/* No Results */}
        {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--background)" }}
              >
                <Search className="h-8 w-8" style={{ color: "var(--text-muted)" }} />
              </div>
              <h3
                className="mb-2 text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                No matches found
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                size="md"
                className="mt-4"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        )}

        {/* Products Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Showing {filteredProducts.length} of {total.toLocaleString()} products
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden transition-all hover:shadow-lg"
                >
                  {/* Product Image */}
                  <div
                    className="relative aspect-square overflow-hidden"
                    style={{ backgroundColor: "var(--background)" }}
                  >
                    {product.imageUrls[0] ? (
                      <Image
                        src={product.imageUrls[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package
                          className="h-12 w-12"
                          style={{ color: "var(--text-muted)" }}
                        />
                      </div>
                    )}

                    {/* Inventory Badge */}
                    {product.inventory !== null && (
                      <div className="absolute right-2 top-2">
                        <Badge
                          variant={
                            product.inventory > 10
                              ? "success"
                              : product.inventory > 0
                              ? "warning"
                              : "danger"
                          }
                        >
                          {product.inventory} in stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3
                      className="mb-1 line-clamp-2 text-sm font-semibold leading-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {product.name}
                    </h3>

                    {product.color && (
                      <p
                        className="mb-2 text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {product.color}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span
                        className="text-lg font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {formatPrice(product.price, (product.currency as "GBP" | "USD" | "EUR") || "GBP")}
                      </span>
                    </div>

                    {/* Tags */}
                    {product.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="muted" size="sm">
                            {tag}
                          </Badge>
                        ))}
                        {product.tags.length > 2 && (
                          <Badge variant="default" size="sm">
                            +{product.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
