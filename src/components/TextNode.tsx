import { useState, useCallback, useRef } from 'react';
import type { Handle as HandleType, Position } from '@xyflow/react';
import { Handle, useReactFlow } from '@xyflow/react';
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

interface HandleData {
  id: string;
  position: Position;
  x: number;
  y: number;
}

export interface TextNodeData {
  label: string;
  content?: string;
  type: NoteType;
  backgroundColor?: string;
  borderColor?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'link';
  handles?: HandleData[];
}

const getDefaultColors = (type: NoteType) => {
  switch (type) {
    case 'chapter':
      return {
        bg: '#fef3c7',
        border: '#f59e0b',
        badge: 'warning'
      };
    case 'main-topic':
      return {
        bg: '#dbeafe',
        border: '#3b82f6',
        badge: 'secondary'
      };
    case 'sub-topic':
      return {
        bg: '#dcfce7',
        border: '#22c55e',
        badge: 'default'
      };
  };
};

const TextNode = ({ id, data, isConnectable }: { id: string, data: TextNodeData; isConnectable?: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const { deleteElements, setNodes } = useReactFlow();
  const nodeRef = useRef<HTMLDivElement>(null);
  const defaultColors = getDefaultColors(data.type);

  const editor = useEditor({
    extensions: [StarterKit],
    content: data.content || '',
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
    if (label.trim()) {
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
    }
  }, [id, label, setNodes]);

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent) => {
      if (evt.key === 'Enter') {
        evt.preventDefault();
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
        if (data.mediaUrl.includes('youtube.com') || data.mediaUrl.includes('youtu.be')) {
          const videoId = data.mediaUrl.includes('youtu.be') 
            ? data.mediaUrl.split('/').pop() 
            : new URLSearchParams(new URL(data.mediaUrl).search).get('v');
          return (
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg mb-2"
            />
          );
        }
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
      ref={nodeRef}
      className={cn(
        "min-w-[350px] min-h-[250px] p-6 backdrop-blur-sm border-2 transition-colors duration-200",
        "dark:bg-background/40 bg-background/60"
      )}
      style={{
        backgroundColor: data.backgroundColor || defaultColors.bg,
        borderColor: data.borderColor || defaultColors.border,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="h-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Badge variant={defaultColors.badge as any} className="capitalize">
            {data.type.replace('-', ' ')}
          </Badge>
          <div className="flex gap-2 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Label>Background</Label>
                  <ColorPicker
                    value={data.backgroundColor || defaultColors.bg}
                    onChange={(color) => updateNodeColor('backgroundColor', color)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Border</Label>
                  <ColorPicker
                    value={data.borderColor || defaultColors.border}
                    onChange={(color) => updateNodeColor('borderColor', color)}
                  />
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
      <div className="absolute inset-0 pointer-events-none">
        {['left', 'right', 'top', 'bottom'].map((side) => (
          <div
            key={side}
            className={cn(
              "absolute w-full h-full",
              side === 'left' && "left-0",
              side === 'right' && "right-0",
              side === 'top' && "top-0",
              side === 'bottom' && "bottom-0"
            )}
            onMouseEnter={(e) => {
              const rect = nodeRef.current?.getBoundingClientRect();
              if (!rect) return;
              
              const position = side as Position;
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              setNodes(nodes => 
                nodes.map(node => {
                  if (node.id === id) {
                    const handleId = `${side}-${Date.now()}`;
                    const handles = node.data.handles || [];
                    return {
                      ...node,
                      data: {
                        ...node.data,
                        handles: [...handles, { id: handleId, position, x, y }]
                      }
                    };
                  }
                  return node;
                })
              );
            }}
          />
        ))}
        {(data.handles || []).map((handle: HandleData) => (
          <Handle
            key={handle.id}
            type="source"
            position={handle.position}
            id={handle.id}
            style={{
              left: handle.x,
              top: handle.y,
              transform: 'translate(-50%, -50%)',
              opacity: 0.001
            }}
            isConnectable={isConnectable}
            className="w-2 h-2 !bg-primary/50 hover:!bg-primary transition-colors"
          />
        ))}
      </div>
    </Card>
  );
};

export default TextNode;
