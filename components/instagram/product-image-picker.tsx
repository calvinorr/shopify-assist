"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  X,
  Check,
  Image as ImageIcon,
  Package,
} from "lucide-react";

interface ProductImage {
  id: string;
  name: string;
  color: string | null;
  imageUrls: string[];
  tags: string[];
}

interface ProductImagePickerProps {
  onSelect: (imageUrl: string, product: { id: string; name: string; color: string | null }) => void;
  onClose: () => void;
  selectedImageUrl?: string;
}

export function ProductImagePicker({
  onSelect,
  onClose,
  selectedImageUrl,
}: ProductImagePickerProps) {
  const [products, setProducts] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductImage | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(selectedImageUrl || null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (query?: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "50");
      params.set("inStock", "true");
      if (query) params.set("search", query);

      const res = await fetch(`/api/products/images?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchQuery);
  };

  const handleSelectImage = (product: ProductImage, imageUrl: string) => {
    setSelectedProduct(product);
    setSelectedImage(imageUrl);
  };

  const handleConfirm = () => {
    if (selectedImage && selectedProduct) {
      onSelect(selectedImage, {
        id: selectedProduct.id,
        name: selectedProduct.name,
        color: selectedProduct.color,
      });
    }
  };

  // Filter products locally for instant feedback
  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.color?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <Card
        className="w-full max-w-4xl max-h-[85vh] flex flex-col"
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: "var(--card-border)" }}
        >
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Select Product Image
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Choose an image from your Shopify products
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b" style={{ borderColor: "var(--card-border)" }}>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                placeholder="Search by name or color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--card-border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <Button variant="outline" size="md" type="submit">
              Search
            </Button>
          </form>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package
                className="h-12 w-12 mx-auto mb-4"
                style={{ color: "var(--text-muted)" }}
              />
              <p style={{ color: "var(--text-muted)" }}>
                No products found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProducts.map((product) =>
                product.imageUrls.map((imageUrl, imgIndex) => (
                  <button
                    key={`${product.id}-${imgIndex}`}
                    onClick={() => handleSelectImage(product, imageUrl)}
                    className="text-left group relative rounded-lg overflow-hidden transition-all"
                    style={{
                      border:
                        selectedImage === imageUrl
                          ? "2px solid var(--indigo)"
                          : "2px solid transparent",
                    }}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === imageUrl && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ backgroundColor: "rgba(79, 70, 229, 0.3)" }}
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "var(--indigo)" }}
                          >
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {product.name}
                      </p>
                      {product.color && (
                        <Badge variant="muted" size="sm" className="mt-1">
                          {product.color}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between p-4 border-t"
          style={{ borderColor: "var(--card-border)" }}
        >
          <div>
            {selectedProduct && selectedImage && (
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Selected: <span className="font-medium">{selectedProduct.name}</span>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirm}
              disabled={!selectedImage}
              style={{ backgroundColor: "var(--indigo)" }}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Use This Image
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
