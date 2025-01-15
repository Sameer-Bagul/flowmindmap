import { useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image, Link, Video } from 'lucide-react';
import { NoteEditor } from '../NoteEditor';
import { toast } from 'sonner';
import type { TextNodeData, MediaItem } from '../TextNode';

export const NodeContent = ({ id, data }: { id: string; data: TextNodeData }) => {
  const [mediaUrl, setMediaUrl] = useState('');
  const { setNodes } = useReactFlow();

  const addMedia = useCallback((type: MediaItem['type']) => {
    if (!mediaUrl) {
      toast.error('Please enter a valid URL');
      return;
    }

    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          const media = Array.isArray(node.data.media) ? node.data.media : [];
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

  return (
    <div className="flex flex-col gap-4">
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
  );
};