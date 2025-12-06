'use client'

import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { X } from 'lucide-react'
import { useState } from 'react'
import { formatPrice } from '@/lib/format'
import { getProductUrl } from '@/lib/shopify-urls'
import type { CardAlignment } from './product-node'

// Alignment styles for the card container
const alignmentStyles: Record<CardAlignment, string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  full: 'w-full',
};

// Max width for non-full alignments
const maxWidthStyles: Record<CardAlignment, string> = {
  left: 'max-w-md',
  center: 'max-w-md',
  full: '',
};

export function ProductCardView({ node, deleteNode }: NodeViewProps) {
  const attrs = node.attrs as {
    productId: string
    name: string
    price: number
    imageUrl: string
    handle?: string
    shopifyUrl?: string // Backward compatibility for old saved content
    currency?: string
    alignment?: CardAlignment
  }

  const { name, price, imageUrl, handle, currency = 'GBP', alignment = 'left' } = attrs

  // Use handle to build URL, or fall back to old shopifyUrl if present
  const shopifyUrl = handle
    ? getProductUrl(handle)
    : attrs.shopifyUrl || '#'

  const [isHovered, setIsHovered] = useState(false)

  return (
    <NodeViewWrapper className="product-card-wrapper my-6">
      <div
        className={`relative bg-white border border-[#e5e0d8] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${alignmentStyles[alignment]} ${maxWidthStyles[alignment]}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Delete button - shows on hover */}
        {isHovered && (
          <button
            onClick={deleteNode}
            className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white border border-[#e5e0d8] rounded-full p-1.5 shadow-sm transition-all duration-150 hover:scale-110"
            aria-label="Remove product card"
          >
            <X className="w-4 h-4 text-[#5c5650]" />
          </button>
        )}

        {/* Card content */}
        <div className="flex flex-col sm:flex-row">
          {/* Product Image */}
          <div className="relative w-full sm:w-48 h-48 flex-shrink-0 bg-[#faf8f5]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name || "Product"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#5c5650]">
                No image
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#2d2a26] mb-2 line-clamp-2">
                {name}
              </h3>
              <p className="text-2xl font-bold text-[#3d5a80] mb-3">
                {formatPrice(price, (currency as 'GBP' | 'USD' | 'EUR') || 'GBP')}
              </p>
            </div>

            {/* View Product Link */}
            <a
              href={shopifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#b85c38] hover:text-[#a04d2c] font-medium transition-colors duration-150 group"
              contentEditable={false}
            >
              View Product
              <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>

        {/* Subtle accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b85c38] via-[#c9a66b] to-[#3d5a80]" />
      </div>
    </NodeViewWrapper>
  )
}
