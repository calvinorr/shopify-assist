import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ProductCardView } from './product-card-view'

export interface ProductCardOptions {
  HTMLAttributes: Record<string, any>
}

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
        shopifyUrl: string
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
      shopifyUrl: {
        default: null,
        parseHTML: element => element.getAttribute('data-shopify-url'),
        renderHTML: attributes => {
          if (!attributes.shopifyUrl) {
            return {}
          }
          return {
            'data-shopify-url': attributes.shopifyUrl,
          }
        },
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
