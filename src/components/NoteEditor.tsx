import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const defaultContent = '<p></p>'; // Default empty paragraph

export const NoteEditor = ({ content, onChange }: NoteEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || defaultContent, // Use provided content or default
    editable: true,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[100px] p-3',
          'bg-white/40 backdrop-blur-sm rounded-lg',
          'text-gray-800'
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return <EditorContent editor={editor} />;
};