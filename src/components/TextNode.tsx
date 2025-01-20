import { useState, useCallback, useRef } from 'react';
import type { Handle as HandleType, Position } from '@xyflow/react';
import { Handle, useReactFlow } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ColorPicker } from './ColorPicker';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from '@/components/ui/label';
import { NoteEditor } from './NoteEditor';
import { MediaSection } from './nodes/MediaSection';
import type { TextNodeData, MediaItem } from '../types/node';

const getDefaultColors = (type: TextNodeData['type']) => {
  switch (type) {
    case 'chapter':
      return {
        bg: 'rgba(254, 243, 199, 0.95)',
        border: '#f59e0b',
        badge: 'warning'
      };
    case 'main-topic':
      return {
        bg: 'rgba(219, 234, 254, 0.95)',
        border: '#3b82f6',
        badge: 'secondary'
      };
    case 'sub-topic':
      return {
        bg: 'rgba(220, 252, 231, 0.95)',
        border: '#22c55e',
        badge: 'default'
      };
  }
};

const TextNode = ({ id, data, isConnectable }: { id: string, data: TextNodeData; isConnectable?: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const { deleteElements, setNodes } = useReactFlow();
  const nodeRef = useRef<HTMLDivElement>(null);
  const defaultColors = getDefaultColors(data.type);

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
          return {
            ...node,
            data: {
              ...node.data,
              [key]: color
            }
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  const handleContentChange = useCallback((content: string) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              content
            }
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  const handleAddMedia = useCallback((mediaItem: MediaItem) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          const currentMedia = Array.isArray(node.data.media) ? node.data.media : [];
          return {
            ...node,
            data: {
              ...node.data,
              media: [...currentMedia, mediaItem]
            }
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  const handleRemoveMedia = useCallback((index: number) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          const media = Array.isArray(node.data.media) ? [...node.data.media] : [];
          media.splice(index, 1);
          return {
            ...node,
            data: {
              ...node.data,
              media
            }
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  return (
    <Card 
      ref={nodeRef}
      className={cn(
        "min-w-[450px] min-h-[350px] p-6",
        "bg-white/95 dark:bg-white/95",
        "backdrop-blur-xl border-2",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
        "hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.47)]",
        "transition-shadow duration-200",
        "relative"
      )}
      style={{
        backgroundColor: data.backgroundColor || defaultColors.bg,
        borderColor: data.borderColor || defaultColors.border,
      }}
    >
      <div className="h-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Badge variant={defaultColors.badge as any} className="capitalize backdrop-blur-sm">
            {data.type.replace('-', ' ')}
          </Badge>
          <div className="flex gap-2 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 flex flex-col gap-4 bg-white/80 backdrop-blur-xl">
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
            className="text-xl font-medium bg-white/50 backdrop-blur-sm text-gray-800"
            placeholder="Enter note title..."
          />
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            className="text-xl font-medium cursor-text select-none min-h-[40px] flex items-center text-gray-800"
          >
            {label || 'Double click to edit'}
          </div>
        )}

        <MediaSection 
          media={data.media || []}
          onAddMedia={handleAddMedia}
          onRemoveMedia={handleRemoveMedia}
        />

        <NoteEditor 
          content={data.content || ''} 
          onChange={handleContentChange}
          autoFocus
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {['top', 'right', 'bottom', 'left'].map((position) => (
          <Handle
            key={position}
            type="source"
            position={position as Position}
            className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "!bg-primary/50 hover:!bg-primary",
              "w-3 h-3 rounded-full border-2 border-white"
            )}
            id={`${position}-${id}`}
            isConnectable={isConnectable}
          />
        ))}
      </div>
    </Card>
  );
};

export default TextNode;