import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, Image as ImageIcon,
  Table as TableIcon, Undo, Redo, Minus
} from "lucide-react";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("URL de l'image :");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const btnClass = (active: boolean) =>
    `h-8 w-8 rounded-md flex items-center justify-center transition-colors ${
      active ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/30">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))} title="Gras">
        <Bold className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))} title="Italique">
        <Italic className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive("underline"))} title="Souligné">
        <UnderlineIcon className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive("strike"))} title="Barré">
        <Strikethrough className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive("heading", { level: 1 }))} title="Titre 1">
        <Heading1 className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive("heading", { level: 2 }))} title="Titre 2">
        <Heading2 className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive("heading", { level: 3 }))} title="Titre 3">
        <Heading3 className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))} title="Liste">
        <List className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))} title="Liste numérotée">
        <ListOrdered className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive("blockquote"))} title="Citation">
        <Quote className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)} title="Ligne">
        <Minus className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className={btnClass(editor.isActive({ textAlign: "left" }))} title="Gauche">
        <AlignLeft className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className={btnClass(editor.isActive({ textAlign: "center" }))} title="Centre">
        <AlignCenter className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className={btnClass(editor.isActive({ textAlign: "right" }))} title="Droite">
        <AlignRight className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button onClick={addImage} className={btnClass(false)} title="Image">
        <ImageIcon className="h-4 w-4" />
      </button>
      <button onClick={addTable} className={btnClass(false)} title="Tableau">
        <TableIcon className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)} title="Annuler">
        <Undo className="h-4 w-4" />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)} title="Rétablir">
        <Redo className="h-4 w-4" />
      </button>
    </div>
  );
};

const TipTapEditor = ({ content, onChange, placeholder }: TipTapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image.configure({ inline: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder || "Commencez à écrire..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none course-content",
      },
    },
  });

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
