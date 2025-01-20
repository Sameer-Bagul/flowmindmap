import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Link, Video } from "lucide-react";
import { MediaType } from '@/types/node';
import { toast } from "sonner";

export const MediaSidebar = () => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [mediaItems, setMediaItems] = useState<Array<{ type: MediaType; url: string }>>([]);

  const handleAddMedia = () => {
    if (!mediaUrl) {
      toast.error('Please enter a valid URL');
      return;
    }

    setMediaItems(prev => [...prev, { type: mediaType, url: mediaUrl }]);
    setMediaUrl('');
    toast.success('Media added successfully');
  };

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, item: { type: MediaType; url: string }) => {
    event.dataTransfer.setData('application/json', JSON.stringify(item));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-80 border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-4">Media Library</h2>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Enter media URL..."
            />
            <div className="flex gap-2">
              <Button
                variant={mediaType === 'image' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setMediaType('image')}
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button
                variant={mediaType === 'video' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setMediaType('video')}
              >
                <Video className="h-4 w-4" />
              </Button>
              <Button
                variant={mediaType === 'youtube' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setMediaType('youtube')}
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button className="flex-1" onClick={handleAddMedia}>Add</Button>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="grid gap-4">
            {mediaItems.map((item, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => onDragStart(e, item)}
                className="relative group cursor-move bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt="" className="w-full h-32 object-cover" />
                ) : item.type === 'video' ? (
                  <video src={item.url} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-muted flex items-center justify-center">
                    <Link className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};