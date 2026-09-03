"use client";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { tiptapExtensions, EMPTY_DOC, type JSONContent } from "@delead/shared/tiptap";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function parse(value: string): JSONContent {
  if (!value) return EMPTY_DOC;
  try {
    const j = JSON.parse(value);
    return j && typeof j === "object" && j.type === "doc" ? j : EMPTY_DOC;
  } catch {
    return EMPTY_DOC;
  }
}

function Btn({
  on,
  active,
  disabled,
  title,
  children,
}: {
  on: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={on}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40",
        active && "bg-muted text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 px-1.5 py-1">
      <Btn title="Bold" active={editor.isActive("bold")} on={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </Btn>
      <Btn title="Italic" active={editor.isActive("italic")} on={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </Btn>
      <Btn title="Strikethrough" active={editor.isActive("strike")} on={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn title="Heading 2" active={editor.isActive("heading", { level: 2 })} on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </Btn>
      <Btn title="Heading 3" active={editor.isActive("heading", { level: 3 })} on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="h-4 w-4" />
      </Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn title="Bullet list" active={editor.isActive("bulletList")} on={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </Btn>
      <Btn title="Numbered list" active={editor.isActive("orderedList")} on={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </Btn>
      <Btn title="Quote" active={editor.isActive("blockquote")} on={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </Btn>
      <Btn title="Code block" active={editor.isActive("codeBlock")} on={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code2 className="h-4 w-4" />
      </Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn title="Undo" disabled={!editor.can().undo()} on={() => editor.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </Btn>
      <Btn title="Redo" disabled={!editor.can().redo()} on={() => editor.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </Btn>
    </div>
  );
}

/** JSON-in / JSON-out rich text editor. `value` / `onChange` are the stringified
 *  TipTap document (stored in `blog_posts.body_json`). */
export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (json: string) => void;
}) {
  const editor = useEditor({
    extensions: tiptapExtensions,
    content: parse(value),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[240px] max-h-[520px] overflow-y-auto px-3.5 py-3 text-sm leading-relaxed focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(JSON.stringify(editor.getJSON())),
  });

  // reset content if the form swaps to a different row
  useEffect(() => {
    if (!editor) return;
    const current = JSON.stringify(editor.getJSON());
    if (current !== value && value) editor.commands.setContent(parse(value), { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  return (
    <div className="overflow-hidden rounded-md border bg-background">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
