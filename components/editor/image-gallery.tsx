"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Search, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  imageUrls: string[];
  color: string | null;
  price: number | null;
}

interface ImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string, altText?: string) => void;
}

interface ImageItem {
  url: string;
  productId: string;
  productName: string;
  color: string | null;
}

export default function ImageGallery({ isOpen, onClose, onSelect }: ImageGalleryProps) {
  const [activeTab, setActiveTab] = useState<"all" | "by-product">("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Flatten all images for "All Images" tab
  const allImages = useMemo(() => {
    const images: ImageItem[] = [];
    products.forEach((product) => {
      product.imageUrls.forEach((url) => {
        images.push({
          url,
          productId: product.id,
          productName: product.name,
          color: product.color,
        });
      });
    });
    return images;
  }, [products]);

  // Filter images by search query
  const filteredImages = useMemo(() => {
    if (!searchQuery) return allImages;
    const query = searchQuery.toLowerCase();
    return allImages.filter((img) =>
      img.productName.toLowerCase().includes(query) ||
      img.color?.toLowerCase().includes(query)
    );
  }, [allImages, searchQuery]);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const query = searchQuery.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.color?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // Get images for selected product
  const productImages = useMemo(() => {
    if (!selectedProduct) return [];
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return [];
    return product.imageUrls.map((url) => ({
      url,
      productId: product.id,
      productName: product.name,
      color: product.color,
    }));
  }, [selectedProduct, products]);

  const handleInsert = () => {
    if (selectedImage) {
      const image = allImages.find((img) => img.url === selectedImage);
      const altText = image ? `${image.productName}${image.color ? ` - ${image.color}` : ""}` : undefined;
      onSelect(selectedImage, altText);
      onClose();
      setSelectedImage(null);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedImage(null);
    setSearchQuery("");
    setSelectedProduct(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-[var(--card-bg)] rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col pointer-events-auto"
          style={{ border: "1px solid var(--card-border)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "var(--card-border)" }}>
            <div>
              <h2 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
                Product Images
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                Browse and select images from your Shopify products
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--background)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 pt-4 border-b" style={{ borderColor: "var(--card-border)" }}>
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-4 py-2 font-medium text-sm rounded-t-lg transition-all",
                activeTab === "all"
                  ? "border-b-2"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
              style={
                activeTab === "all"
                  ? { color: "var(--text-primary)", borderColor: "var(--weld)" }
                  : {}
              }
            >
              All Images
            </button>
            <button
              onClick={() => setActiveTab("by-product")}
              className={cn(
                "px-4 py-2 font-medium text-sm rounded-t-lg transition-all",
                activeTab === "by-product"
                  ? "border-b-2"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
              style={
                activeTab === "by-product"
                  ? { color: "var(--text-primary)", borderColor: "var(--weld)" }
                  : {}
              }
            >
              By Product
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b" style={{ borderColor: "var(--card-border)" }}>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                placeholder={activeTab === "all" ? "Search by product or color..." : "Search products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--card-border)",
                  color: "var(--text-primary)",
                  "--tw-ring-color": "var(--weld)",
                } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <LoadingSkeleton />
            ) : activeTab === "all" ? (
              <ImageGrid images={filteredImages} selectedImage={selectedImage} onSelectImage={setSelectedImage} />
            ) : (
              <ByProductView
                products={filteredProducts}
                selectedProduct={selectedProduct}
                onSelectProduct={setSelectedProduct}
                productImages={productImages}
                selectedImage={selectedImage}
                onSelectImage={setSelectedImage}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t" style={{ borderColor: "var(--card-border)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {selectedImage ? "1 image selected" : "No image selected"}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleInsert} disabled={!selectedImage}>
                Insert Image
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Image Grid Component
function ImageGrid({
  images,
  selectedImage,
  onSelectImage,
}: {
  images: ImageItem[];
  selectedImage: string | null;
  onSelectImage: (url: string) => void;
}) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ImageIcon size={48} style={{ color: "var(--text-muted)" }} className="mb-4" />
        <p className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
          No images found
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Try adjusting your search query
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {images.map((image, index) => (
        <ImageCard
          key={`${image.url}-${index}`}
          image={image}
          isSelected={selectedImage === image.url}
          onSelect={() => onSelectImage(image.url)}
        />
      ))}
    </div>
  );
}

// Image Card Component
function ImageCard({
  image,
  isSelected,
  onSelect,
}: {
  image: ImageItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="group relative aspect-square rounded-lg overflow-hidden transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        border: isSelected ? "2px solid var(--weld)" : "1px solid var(--card-border)",
        boxShadow: isSelected ? "0 0 0 2px var(--weld)" : undefined,
      }}
    >
      {/* Image */}
      <img
        src={image.url}
        alt={image.productName}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Product Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 text-left opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-xs font-medium truncate">{image.productName}</p>
        {image.color && (
          <p className="text-white/80 text-xs truncate">{image.color}</p>
        )}
      </div>

      {/* Selected Checkmark */}
      {isSelected && (
        <div
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
          style={{ backgroundColor: "var(--weld)" }}
        >
          <Check size={18} className="text-white" />
        </div>
      )}
    </button>
  );
}

// By Product View Component
function ByProductView({
  products,
  selectedProduct,
  onSelectProduct,
  productImages,
  selectedImage,
  onSelectImage,
}: {
  products: Product[];
  selectedProduct: string | null;
  onSelectProduct: (id: string) => void;
  productImages: ImageItem[];
  selectedImage: string | null;
  onSelectImage: (url: string) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ImageIcon size={48} style={{ color: "var(--text-muted)" }} className="mb-4" />
        <p className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
          No products found
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Try adjusting your search query
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Product List */}
      <div className="w-80 flex-shrink-0">
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
          Products ({products.length})
        </h3>
        <div className="space-y-2">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => onSelectProduct(product.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-all border",
                selectedProduct === product.id
                  ? "shadow-sm"
                  : "hover:bg-[var(--background)]"
              )}
              style={
                selectedProduct === product.id
                  ? {
                      backgroundColor: "var(--background)",
                      borderColor: "var(--weld)",
                    }
                  : {
                      borderColor: "var(--card-border)",
                    }
              }
            >
              <div className="flex items-start gap-3">
                {product.imageUrls[0] && (
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>
                    {product.name}
                  </p>
                  {product.color && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                      {product.color}
                    </p>
                  )}
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {product.imageUrls.length} {product.imageUrls.length === 1 ? "image" : "images"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Product Images */}
      <div className="flex-1">
        {selectedProduct ? (
          <>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
              Images ({productImages.length})
            </h3>
            <ImageGrid images={productImages} selectedImage={selectedImage} onSelectImage={onSelectImage} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ImageIcon size={48} style={{ color: "var(--text-muted)" }} className="mb-4" />
            <p className="text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
              Select a product
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Choose a product from the list to view its images
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded-lg animate-pulse"
          style={{
            backgroundColor: "var(--card-border)",
            background: "linear-gradient(90deg, var(--card-border) 0%, var(--background) 50%, var(--card-border) 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2s infinite",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
