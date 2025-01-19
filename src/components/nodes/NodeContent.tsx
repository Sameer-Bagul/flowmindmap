import { useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image, Link, Video } from 'lucide-react';
import { NoteEditor } from '../NoteEditor';
import { toast } from 'sonner';
import type { TextNodeData, MediaItem } from '../../types/node';

export const NodeContent = ({ id, data }: { id: string; data: TextNodeData }) => {
  const [mediaUrl, setMediaUrl] = useState('');
  const { setNodes } = useReactFlow();

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const addMedia = useCallback((type: MediaItem['type']) => {
    if (!mediaUrl) {
      toast.error('Please enter a valid URL');
      return;
    }

    if (type === 'youtube' && !getYouTubeVideoId(mediaUrl)) {
      toast.error('Please enter a valid YouTube URL');
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
          <Link className="h-4 w-4" />
        </Button>
      </div>

      <NoteEditor content={data.content || ''} onChange={handleContentChange} />

      {data.media && data.media.map((item, index) => (
        <div key={index} className="relative rounded-md overflow-hidden">
          {item.type === 'image' && (
            <img src={item.url} alt="Node media" className="w-full h-auto" />
          )}
          {item.type === 'video' && (
            <video src={item.url} controls className="w-full h-auto" />
          )}
          {item.type === 'youtube' && (
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(item.url)}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      ))}
    </div>
  );
};