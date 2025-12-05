"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  ShoppingBag,
  ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-node";
import { ProductPicker } from "./product-picker";
import ImageGallery from "./image-gallery";
import type { Product } from "@/types/product";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  onEditorReady?: (editor: Editor) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange, onEditorReady, placeholder = "Start writing..." }: TiptapEditorProps) {
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-indigo-600 underline cursor-pointer hover:text-madder",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
      ProductCard,
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none h-full max-w-none",
        style: "color: var(--text-primary);",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  if (!editor) {
    return (
      <div
        className="border rounded-lg overflow-hidden h-full flex flex-col"
        style={{
          borderColor: "var(--card-border)",
          backgroundColor: "var(--card-bg)",
        }}
      >
        <div className="p-4 flex-1 flex items-center justify-center">
          <p style={{ color: "var(--text-muted)" }}>Loading editor...</p>
        </div>
      </div>
    );
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    icon: Icon,
    label
  }: {
    onClick: () => void;
    isActive?: boolean;
    icon: React.ElementType;
    label: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      tabIndex={-1}
      className={`p-2 rounded hover:bg-opacity-10 transition-colors ${
        isActive ? "bg-opacity-15" : ""
      }`}
      style={{
        backgroundColor: isActive ? "var(--indigo)" : "transparent",
        color: isActive ? "var(--indigo)" : "var(--text-secondary)",
      }}
      title={label}
    >
      <Icon size={18} />
    </button>
  );

  const toggleLink = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    } else {
      // For now, just wrap selection in a link with a placeholder URL
      // User can edit the href in the HTML later or we can add a proper modal
      const selection = editor.state.selection;
      if (!selection.empty) {
        editor.chain().focus().setLink({ href: "#" }).run();
      }
    }
  };

  const handleProductSelect = (product: Product) => {
    const shopifyUrl = `https://herbariumdyeworks.myshopify.com/products/${product.id}`;
    editor.chain().focus().insertProductCard({
      productId: product.id,
      name: product.name,
      price: product.price || 0,
      imageUrl: product.imageUrls[0] || "",
      shopifyUrl,
    }).run();
  };

  const handleImageSelect = (imageUrl: string, altText?: string) => {
    editor.chain().focus().setImage({ src: imageUrl, alt: altText || "" }).run();
  };

  return (
    <div
      className="border rounded-lg overflow-hidden h-full flex flex-col"
      style={{
        borderColor: "var(--card-border)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 p-2 border-b flex-shrink-0"
        style={{
          borderBottomColor: "var(--card-border)",
          backgroundColor: "var(--background)",
        }}
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={Bold}
          label="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={Italic}
          label="Italic"
        />

        <div className="w-px h-6 mx-1" style={{ backgroundColor: "var(--card-border)" }} />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          icon={Heading1}
          label="Heading 1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          icon={Heading2}
          label="Heading 2"
        />

        <div className="w-px h-6 mx-1" style={{ backgroundColor: "var(--card-border)" }} />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={List}
          label="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={ListOrdered}
          label="Numbered List"
        />

        <div className="w-px h-6 mx-1" style={{ backgroundColor: "var(--card-border)" }} />

        <ToolbarButton
          onClick={toggleLink}
          isActive={editor.isActive("link")}
          icon={LinkIcon}
          label="Toggle Link"
        />

        <div className="w-px h-6 mx-1" style={{ backgroundColor: "var(--card-border)" }} />

        <ToolbarButton
          onClick={() => setShowImageGallery(true)}
          icon={ImageIcon}
          label="Insert Image from Products"
        />
        <ToolbarButton
          onClick={() => setShowProductPicker(true)}
          icon={ShoppingBag}
          label="Insert Product Card"
        />
      </div>

      {/* Editor */}
      <div className="p-4 flex-1 overflow-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>

      {/* Custom styles for the editor */}
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--text-muted);
          pointer-events: none;
          height: 0;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: 700;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
          color: var(--text-primary);
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin-top: 0.75em;
          margin-bottom: 0.5em;
          color: var(--text-primary);
        }

        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin-top: 0.75em;
          margin-bottom: 0.5em;
          color: var(--text-primary);
        }

        .ProseMirror p {
          margin-top: 0.75em;
          margin-bottom: 0.75em;
          color: var(--text-secondary);
          line-height: 1.75;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin-top: 0.75em;
          margin-bottom: 0.75em;
          color: var(--text-secondary);
        }

        .ProseMirror ul {
          list-style-type: disc;
        }

        .ProseMirror ol {
          list-style-type: decimal;
        }

        .ProseMirror li {
          margin-top: 0.25em;
          margin-bottom: 0.25em;
        }

        .ProseMirror a {
          color: var(--indigo);
          text-decoration: underline;
          cursor: pointer;
        }

        .ProseMirror a:hover {
          color: var(--madder);
        }

        .ProseMirror strong {
          font-weight: 600;
          color: var(--text-primary);
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
        }

        .ProseMirror .product-card-wrapper {
          margin: 1.5em 0;
        }
      `}</style>

      {/* Product Picker Modal */}
      <ProductPicker
        isOpen={showProductPicker}
        onClose={() => setShowProductPicker(false)}
        onSelect={handleProductSelect}
      />

      {/* Image Gallery Modal */}
      <ImageGallery
        isOpen={showImageGallery}
        onClose={() => setShowImageGallery(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
