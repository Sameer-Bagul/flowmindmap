import { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ColorPicker } from './ColorPicker';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from '@/components/ui/label';

export type NoteType = 'chapter' | 'main-topic' | 'sub-topic';

export interface TextNodeData {
  label: string;
  content?: string;
  type: NoteType;
  backgroundColor?: string;
  borderColor?: string;
}

const TextNode = ({ id, data, isConnectable }: { id: string, data: TextNodeData; isConnectable?: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const { deleteElements, setNodes } = useReactFlow();

  const editor = useEditor({
    extensions: [StarterKit],
    content: data.content || '<p>Click to add content...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[100px] p-2',
      },
    },
  });

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    data.label = label;
    if (editor) {
      data.content = editor.getHTML();
    }
  }, [data, editor, label]);

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent) => {
      if (evt.key === 'Enter') {
        setIsEditing(false);
        data.label = label;
      }
    },
    [data, label]
  );

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
    toast.success('Node deleted');
  }, [deleteElements, id]);

  const updateNodeColor = useCallback((key: 'backgroundColor' | 'borderColor', color: string) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          const newData = { ...node.data, [key]: color };
          return { ...node, data: newData };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  return (
    <Card 
      className={cn(
        "min-w-[350px] min-h-[250px] p-6 backdrop-blur-sm border-2 transition-colors duration-200",
        "dark:bg-background/80 bg-background/95"
      )}
      style={{
        backgroundColor: data.backgroundColor || 'transparent',
        borderColor: data.borderColor || 'hsl(var(--border))'
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-4 h-4 !bg-primary/50 hover:!bg-primary transition-colors"
      />
      <div className="h-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="capitalize">
            {data.type.replace('-', ' ')}
          </Badge>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <ColorPicker
                      value={data.backgroundColor || '#ffffff'}
                      onChange={(color) => updateNodeColor('backgroundColor', color)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Border Color</Label>
                    <ColorPicker
                      value={data.borderColor || '#e2e8f0'}
                      onChange={(color) => updateNodeColor('borderColor', color)}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive/90"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isEditing ? (
          <Input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="text-lg font-medium"
            placeholder="Enter note title..."
          />
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            className="text-lg font-medium cursor-text select-none min-h-[40px] flex items-center"
          >
            {label || 'Double click to edit'}
          </div>
        )}
        <div 
          className="flex-1 rounded-lg text-sm text-foreground border cursor-text hover:border-ring dark:bg-background/50 bg-background/50"
          onClick={() => editor?.chain().focus().run()}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-4 h-4 !bg-primary/50 hover:!bg-primary transition-colors"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        isConnectable={isConnectable}
        className="w-4 h-4 !bg-primary/50 hover:!bg-primary transition-colors"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={isConnectable}
        className="w-4 h-4 !bg-primary/50 hover:!bg-primary transition-colors"
      />
    </Card>
  );
};

export default TextNode;