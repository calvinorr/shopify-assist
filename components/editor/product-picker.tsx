"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Search, Package, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
}

export function ProductPicker({ isOpen, onClose, onSelect }: ProductPickerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.color?.toLowerCase().includes(query) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [products, searchQuery]);

  const handleSelect = () => {
    if (selectedProduct) {
      onSelect(selectedProduct);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSelectedProduct(null);
    onClose();
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl animate-scale-in"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-6 border-b"
            style={{ borderColor: "var(--card-border)" }}
          >
            <div>
              <h2
                className="text-2xl font-semibold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                Select a Product
              </h2>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Choose a product to feature in your blog post
              </p>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-2 transition-all duration-200 hover:bg-opacity-80"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--text-secondary)",
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b" style={{ borderColor: "var(--card-border)" }}>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: "var(--text-muted)" }}
              />
              <Input
                placeholder="Search by product name, color, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
                style={{
                  backgroundColor: "var(--background)",
                  border: "2px solid var(--card-border)",
                }}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchProducts} />
            ) : filteredProducts.length === 0 ? (
              <EmptyState hasQuery={!!searchQuery.trim()} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isSelected={selectedProduct?.id === product.id}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between p-6 border-t"
            style={{ borderColor: "var(--card-border)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {selectedProduct ? (
                <>
                  Selected: <span style={{ color: "var(--text-primary)" }} className="font-medium">{selectedProduct.name}</span>
                </>
              ) : (
                "Select a product to continue"
              )}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSelect}
                disabled={!selectedProduct}
                className="min-w-[140px]"
              >
                Insert Product
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.25s ease-out;
        }
      `}</style>
    </>
  );
}

// Product Card Component
interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onClick: () => void;
}

function ProductCard({ product, isSelected, onClick }: ProductCardProps) {
  const imageUrl = product.imageUrls[0] || "/placeholder-product.png";
  const formattedPrice = product.price
    ? `$${(product.price / 100).toFixed(2)}`
    : "Price not set";

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full text-left rounded-xl overflow-hidden transition-all duration-300",
        "border-2 hover:shadow-lg",
        isSelected
          ? "ring-2 ring-offset-2 shadow-lg transform scale-[1.02]"
          : "hover:transform hover:scale-[1.02]"
      )}
      style={{
        backgroundColor: "var(--background)",
        borderColor: isSelected ? "var(--indigo)" : "var(--card-border)",
        boxShadow: isSelected ? "0 0 0 2px var(--indigo)" : undefined,
      }}
    >
      {/* Image */}
      <div
        className="relative w-full aspect-square overflow-hidden"
        style={{ backgroundColor: "var(--card-border)" }}
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Color Tag Overlay */}
        {product.color && (
          <div
            className="absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "var(--walnut)",
              border: "1px solid var(--card-border)",
            }}
          >
            {product.color}
          </div>
        )}

        {/* Selected Checkmark */}
        {isSelected && (
          <div
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--indigo)" }}
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-medium text-base line-clamp-2 mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {product.name}
        </h3>

        <p
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--madder)" }}
        >
          {formattedPrice}
        </p>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  backgroundColor: "var(--card-border)",
                  color: "var(--text-muted)",
                }}
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 2 && (
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{
                  backgroundColor: "var(--card-border)",
                  color: "var(--text-muted)",
                }}
              >
                +{product.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />
    </button>
  );
}

// Loading State
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div
        className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mb-4"
        style={{ borderColor: "var(--indigo)", borderTopColor: "transparent" }}
      />
      <p className="text-base" style={{ color: "var(--text-muted)" }}>
        Loading products...
      </p>
    </div>
  );
}

// Error State
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: "var(--background)" }}
      >
        <AlertCircle className="w-8 h-8" style={{ color: "var(--madder)" }} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        Failed to Load Products
      </h3>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        {message}
      </p>
      <Button onClick={onRetry} variant="primary">
        Try Again
      </Button>
    </div>
  );
}

// Empty State
interface EmptyStateProps {
  hasQuery: boolean;
}

function EmptyState({ hasQuery }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: "var(--background)" }}
      >
        <Package className="w-8 h-8" style={{ color: "var(--weld)" }} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        {hasQuery ? "No Products Found" : "No Products Available"}
      </h3>
      <p className="text-sm text-center max-w-sm" style={{ color: "var(--text-muted)" }}>
        {hasQuery
          ? "Try adjusting your search terms or browse all products"
          : "Sync your Shopify products to get started"}
      </p>
    </div>
  );
}
