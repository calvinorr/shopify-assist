import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ProductCardView } from './product-card-view'

export interface ProductCardOptions {
  HTMLAttributes: Record<string, any>
}

export type CardAlignment = 'left' | 'center' | 'full';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    productCard: {
      /**
       * Insert a product card
       */
      insertProductCard: (attrs: {
        productId: string
        name: string
        price: number
        imageUrl: string
        handle: string
        currency: string
        alignment?: CardAlignment
      }) => ReturnType
    }
  }
}

export const ProductCard = Node.create<ProductCardOptions>({
  name: 'productCard',

  group: 'block',

  atom: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      productId: {
        default: null,
        parseHTML: element => element.getAttribute('data-product-id'),
        renderHTML: attributes => {
          if (!attributes.productId) {
            return {}
          }
          return {
            'data-product-id': attributes.productId,
          }
        },
      },
      name: {
        default: null,
        parseHTML: element => element.getAttribute('data-name'),
        renderHTML: attributes => {
          if (!attributes.name) {
            return {}
          }
          return {
            'data-name': attributes.name,
          }
        },
      },
      price: {
        default: 0,
        parseHTML: element => {
          const price = element.getAttribute('data-price')
          return price ? parseFloat(price) : 0
        },
        renderHTML: attributes => {
          return {
            'data-price': attributes.price,
          }
        },
      },
      imageUrl: {
        default: null,
        parseHTML: element => element.getAttribute('data-image-url'),
        renderHTML: attributes => {
          if (!attributes.imageUrl) {
            return {}
          }
          return {
            'data-image-url': attributes.imageUrl,
          }
        },
      },
      handle: {
        default: null,
        parseHTML: element => element.getAttribute('data-handle'),
        renderHTML: attributes => {
          if (!attributes.handle) {
            return {}
          }
          return {
            'data-handle': attributes.handle,
          }
        },
      },
      currency: {
        default: 'GBP',
        parseHTML: element => element.getAttribute('data-currency') || 'GBP',
        renderHTML: attributes => {
          return {
            'data-currency': attributes.currency || 'GBP',
          }
        },
      },
      alignment: {
        default: 'left',
        parseHTML: element => element.getAttribute('data-alignment') || 'left',
        renderHTML: attributes => {
          return {
            'data-alignment': attributes.alignment || 'left',
          }
        },
      },
      // Backward compatibility: read old shopifyUrl attribute from saved content
      shopifyUrl: {
        default: null,
        parseHTML: element => element.getAttribute('data-shopify-url'),
        renderHTML: () => ({}), // Don't render - we use handle now
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="product-card"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'product-card' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ProductCardView)
  },

  addCommands() {
    return {
      insertProductCard:
        attrs =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          })
        },
    }
  },
})
