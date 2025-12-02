"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function TiptapEditor({ content, onChange, placeholder = "Start writing..." }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] max-w-none",
        style: "color: var(--text-primary);",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
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

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div
      className="border rounded-lg overflow-hidden"
      style={{
        borderColor: "var(--card-border)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 p-2 border-b"
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
          onClick={addLink}
          isActive={editor.isActive("link")}
          icon={LinkIcon}
          label="Add Link"
        />
      </div>

      {/* Editor */}
      <div className="p-6">
        <EditorContent editor={editor} />
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
      `}</style>
    </div>
  );
}
