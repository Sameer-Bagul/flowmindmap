import { useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image, Link, Video, Type } from 'lucide-react';
import { NoteEditor } from '../NoteEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { TextNodeData } from '../TextNode';
import { ScrollArea } from "@/components/ui/scroll-area";

export const NodeContent = ({ id, data }: { id: string; data: TextNodeData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const [mediaUrl, setMediaUrl] = useState('');
  const { setNodes } = useReactFlow();

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

  const addMedia = useCallback((type: 'image' | 'video' | 'youtube' | 'link') => {
    if (!mediaUrl) return;

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
  }, [id, mediaUrl, setNodes]);

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  return (
    <div className="flex flex-col gap-4">
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

      {data.media && data.media.length > 0 && (
        <ScrollArea className="w-full max-h-[200px]">
          <div className="flex flex-col gap-4">
            {data.media.map((item, index) => (
              <div key={index} className="relative">
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

      <NoteEditor content={data.content || ''} onChange={handleContentChange} />
    </div>
  );
};
