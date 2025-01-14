import { useState, useCallback, useRef } from 'react';
import type { Handle as HandleType, Position } from '@xyflow/react';
import { Handle, useReactFlow } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Settings2, Image, Link, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ColorPicker } from './ColorPicker';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from '@/components/ui/label';
import { NoteEditor } from './NoteEditor';
import { ScrollArea } from "@/components/ui/scroll-area";

export type NoteType = 'chapter' | 'main-topic' | 'sub-topic';

interface HandleData {
  id: string;
  position: Position;
  x: number;
  y: number;
}

export interface MediaItem {
  type: 'image' | 'video' | 'youtube' | 'link';
  url: string;
  title?: string;
}

export interface TextNodeData {
  label: string;
  content?: string;
  type: NoteType;
  backgroundColor?: string;
  borderColor?: string;
  media?: MediaItem[];
  handles?: HandleData[];
}

const getDefaultColors = (type: NoteType) => {
  switch (type) {
    case 'chapter':
      return {
        bg: 'rgba(254, 243, 199, 0.7)',
        border: '#f59e0b',
        badge: 'warning'
      };
    case 'main-topic':
      return {
        bg: 'rgba(219, 234, 254, 0.7)',
        border: '#3b82f6',
        badge: 'secondary'
      };
    case 'sub-topic':
      return {
        bg: 'rgba(220, 252, 231, 0.7)',
        border: '#22c55e',
        badge: 'default'
      };
  }
};

const TextNode = ({ id, data, isConnectable }: { id: string, data: TextNodeData; isConnectable?: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const [mediaUrl, setMediaUrl] = useState('');
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

  const addMedia = useCallback((type: MediaItem['type']) => {
    if (!mediaUrl) {
      toast.error('Please enter a valid URL');
      return;
    }

    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          const media = node.data.media || [];
          return {
            ...node,
            data: {
              ...node.data,
              media: [...media, { type, url: mediaUrl }]
            }
          };
        }
        return node;
      })
    );
    setMediaUrl('');
    toast.success('Media added successfully');
  }, [id, mediaUrl, setNodes]);

  const removeMedia = useCallback((index: number) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          const media = [...(node.data.media || [])];
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
    toast.success('Media removed');
  }, [id, setNodes]);

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  return (
    <Card 
      ref={nodeRef}
      className={cn(
        "min-w-[350px] min-h-[250px] p-6",
        "bg-white/80 dark:bg-white/80",
        "backdrop-blur-xl border-2",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
      )}
      style={{
        backgroundColor: data.backgroundColor || defaultColors.bg,
        borderColor: data.borderColor || defaultColors.border,
      }}
    >
      <div className="h-full flex gap-4">
        <div className="flex-1 flex flex-col gap-4">
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
              className="text-lg font-medium bg-white/50 backdrop-blur-sm text-gray-800"
              placeholder="Enter note title..."
            />
          ) : (
            <div
              onDoubleClick={handleDoubleClick}
              className="text-lg font-medium cursor-text select-none min-h-[40px] flex items-center text-gray-800"
            >
              {label || 'Double click to edit'}
            </div>
          )}

          <div className="flex gap-2 items-center">
            <Input
              type="text"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Enter media URL..."
              className="flex-1"
            />
            <Button variant="ghost" size="icon" onClick={() => addMedia('image')}>
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => addMedia('video')}>
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => addMedia('youtube')}>
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => addMedia('link')}>
              <Link className="h-4 w-4" />
            </Button>
          </div>

          <NoteEditor content={data.content || ''} onChange={handleContentChange} />
        </div>

        {data.media && data.media.length > 0 && (
          <ScrollArea className="w-[200px] border-l pl-4">
            <div className="flex flex-col gap-4">
              {data.media.map((item, index) => (
                <div key={index} className="relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => removeMedia(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  {item.type === 'image' && (
                    <img src={item.url} alt={item.title || 'Image'} className="w-full rounded-lg" />
                  )}
                  {item.type === 'video' && (
                    <video src={item.url} controls className="w-full rounded-lg" />
                  )}
                  {item.type === 'youtube' && (
                    <iframe
                      src={getYouTubeEmbedUrl(item.url)}
                      className="w-full aspect-video rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                  {item.type === 'link' && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline break-all"
                    >
                      {item.title || item.url}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
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
