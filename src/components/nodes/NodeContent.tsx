import { useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image, Link, Video, Type } from 'lucide-react';
import { NoteEditor } from '../NoteEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { TextNodeData } from '../TextNode';

export const NodeContent = ({ id, data }: { id: string; data: TextNodeData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');
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

  const handleMediaAdd = useCallback((type: 'image' | 'video' | 'link', url: string) => {
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
  }, [id, setNodes]);

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

      <div className="flex gap-2 p-2 bg-white/50 backdrop-blur-sm rounded-lg">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Image className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Image URL</DialogTitle>
            </DialogHeader>
            <Input 
              placeholder="Enter image URL..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleMediaAdd('image', e.currentTarget.value);
                }
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Video className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Video URL</DialogTitle>
            </DialogHeader>
            <Input 
              placeholder="Enter video URL..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleMediaAdd('video', e.currentTarget.value);
                }
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Link className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Link URL</DialogTitle>
            </DialogHeader>
            <Input 
              placeholder="Enter link URL..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleMediaAdd('link', e.currentTarget.value);
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {data.mediaUrl && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/5">
          {data.mediaType === 'image' && (
            <img src={data.mediaUrl} alt={label} className="w-full h-full object-contain" />
          )}
          {data.mediaType === 'video' && (
            <video src={data.mediaUrl} controls className="w-full h-full" />
          )}
          {data.mediaType === 'link' && (
            <iframe src={data.mediaUrl} className="w-full h-full" />
          )}
        </div>
      )}

      <NoteEditor content={data.content || ''} onChange={handleContentChange} />
    </div>
  );
};