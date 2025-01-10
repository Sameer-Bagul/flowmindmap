import { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Settings2, Image, Link, Video } from "lucide-react";
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
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'link';
}

const TextNode = ({ id, data, isConnectable }: { id: string, data: TextNodeData; isConnectable?: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const { deleteElements, setNodes } = useReactFlow();

  const editor = useEditor({
    extensions: [StarterKit],
    content: data.content || '<p>Click to add content...</p>',
    editable: true,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[100px] p-2',
      },
    },
    onUpdate: ({ editor }) => {
      setNodes(nodes => 
        nodes.map(node => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                content: editor.getHTML()
              }
            };
          }
          return node;
        })
      );
    },
  });

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label
            }
          };
        }
        return node;
      })
    );
  }, [id, label, setNodes]);

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent) => {
      if (evt.key === 'Enter') {
        evt.preventDefault();
        setIsEditing(false);
        handleBlur();
      }
    },
    [handleBlur]
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

  const handleMediaInput = (type: 'image' | 'video' | 'link') => {
    const url = prompt(`Enter ${type} URL:`);
    if (url) {
      setNodes(nodes => 
        nodes.map(node => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                mediaUrl: url,
                mediaType: type
              }
            };
          }
          return node;
        })
      );
      toast.success(`${type} added successfully`);
    }
  };

  const renderMedia = () => {
    if (!data.mediaUrl) return null;
    
    switch (data.mediaType) {
      case 'image':
        return (
          <img 
            src={data.mediaUrl} 
            alt="Node media" 
            className="max-w-full h-auto rounded-lg mb-2"
          />
        );
      case 'video':
        return (
          <video 
            src={data.mediaUrl} 
            controls 
            className="max-w-full h-auto rounded-lg mb-2"
          />
        );
      case 'link':
        return (
          <a 
            href={data.mediaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline mb-2 block"
          >
            {data.mediaUrl}
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <Card 
      className={cn(
        "min-w-[350px] min-h-[250px] p-6 backdrop-blur-sm border-2 transition-colors duration-200",
        "dark:bg-background/40 bg-background/60"
      )}
      style={{
        backgroundColor: data.backgroundColor ? `${data.backgroundColor}20` : 'transparent',
        borderColor: data.borderColor || 'hsl(var(--border))',
        backdropFilter: 'blur(8px)',
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
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleMediaInput('image')}
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleMediaInput('video')}
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleMediaInput('link')}
          >
            <Link className="h-4 w-4" />
          </Button>
        </div>

        {renderMedia()}
        
        <div 
          className="flex-1 rounded-lg text-sm text-foreground border cursor-text hover:border-ring dark:bg-background/50 bg-background/50"
        >
          <EditorContent editor={editor} />
        </div>
      </div>
      {Array.from({ length: 8 }).map((_, index) => {
        const position = index < 2 ? Position.Left :
                        index < 4 ? Position.Right :
                        index < 6 ? Position.Top :
                        Position.Bottom;
        const style = {
          top: index < 6 ? `${(index % 2) * 50 + 25}%` : undefined,
          left: index >= 6 ? `${(index % 2) * 50 + 25}%` : undefined
        };
        
        return (
          <Handle
            key={`handle-${index}`}
            type="source"
            position={position}
            id={`handle-${index}`}
            style={style}
            isConnectable={isConnectable}
            className="w-3 h-3 !bg-primary/50 hover:!bg-primary transition-colors"
          />
        );
      })}
    </Card>
  );
};

export default TextNode;
