import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image, Link, Video, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { MediaItem, MediaType } from '@/types/node';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface MediaSectionProps {
  media?: MediaItem[];
  onAddMedia: (item: MediaItem) => void;
  onRemoveMedia: (index: number) => void;
}

export const MediaSection = ({ media = [], onAddMedia, onRemoveMedia }: MediaSectionProps) => {
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('youtube');

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleAddMedia = () => {
    if (!mediaUrl) {
      toast.error('Please enter a valid URL');
      return;
    }

    if (mediaType === 'youtube' && !getYouTubeVideoId(mediaUrl)) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    onAddMedia({ type: mediaType, url: mediaUrl });
    setMediaUrl('');
    toast.success('Media added successfully');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="Enter media URL..."
          className="flex-1"
        />
        <Button variant="ghost" size="icon" onClick={() => setMediaType('image')}>
          <Image className={`h-4 w-4 ${mediaType === 'image' ? 'text-primary' : ''}`} />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setMediaType('video')}>
          <Video className={`h-4 w-4 ${mediaType === 'video' ? 'text-primary' : ''}`} />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setMediaType('youtube')}>
          <Link className={`h-4 w-4 ${mediaType === 'youtube' ? 'text-primary' : ''}`} />
        </Button>
        <Button onClick={handleAddMedia}>Add</Button>
      </div>

      {media.length > 0 && (
        <Carousel className="w-full">
          <CarouselContent>
            {media.map((item, index) => (
              <CarouselItem key={index}>
                <div className="relative group">
                  {item.type === 'youtube' ? (
                    <div className="aspect-video w-full rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(item.url)}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0"
                      />
                    </div>
                  ) : item.type === 'image' ? (
                    <img src={item.url} alt="Media content" className="w-full rounded-lg" />
                  ) : (
                    <video src={item.url} controls className="w-full rounded-lg" />
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemoveMedia(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
};