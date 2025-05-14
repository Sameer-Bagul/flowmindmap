
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { MediaItem, Tag } from '../../types/node';

interface NodeDisplayProps {
  label: string;
  content?: string;
  media?: MediaItem[];
  tags?: Tag[];
  isEditMode: boolean;
  isExpanded?: boolean;
  onRemoveTag: (id: string) => void;
}

export const NodeDisplay = ({ 
  label,
  content,
  media,
  tags,
  isEditMode,
  isExpanded = false,
  onRemoveTag
}: NodeDisplayProps) => {
  // Helper function to truncate content if not expanded
  const truncateContent = (text: string, maxLength: number = 150) => {
    if (!isExpanded && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  // Helper function to render YouTube videos
  const renderYouTubeEmbed = (url: string) => {
    try {
      // Extract video ID from YouTube URL
      const videoId = url.includes('youtu.be')
        ? url.split('/').pop()
        : url.includes('v=')
        ? new URLSearchParams(url.split('?')[1]).get('v')
        : url;

      return (
        <div className="aspect-w-16 aspect-h-9 mt-2">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            className="w-full h-48 rounded-md"
            allowFullScreen
          ></iframe>
        </div>
      );
    } catch (error) {
      return <div className="text-red-500 text-sm">Invalid YouTube URL</div>;
    }
  };

  // Helper function to render media items
  const renderMediaItem = (item: MediaItem, index: number) => {
    if (!isExpanded && !media?.length) return null;
    
    // Show only first media item if not expanded
    if (!isExpanded && index > 0) return null;
    
    switch (item.type) {
      case 'image':
        return (
          <div key={index} className="relative rounded-md overflow-hidden mt-2 border border-gray-200">
            <img src={item.url} alt={item.title || 'Image'} className="w-full h-auto max-h-48 object-cover" />
            {item.title && <div className="p-2 text-sm font-medium">{item.title}</div>}
          </div>
        );
      case 'youtube':
        return (
          <div key={index} className="relative mt-2">
            {renderYouTubeEmbed(item.url)}
            {item.title && <div className="p-2 text-sm font-medium">{item.title}</div>}
          </div>
        );
      case 'video':
        return (
          <div key={index} className="relative rounded-md overflow-hidden mt-2 border border-gray-200">
            <video src={item.url} controls className="w-full h-auto max-h-48" />
            {item.title && <div className="p-2 text-sm font-medium">{item.title}</div>}
          </div>
        );
      default:
        return null;
    }
  };

  // Function to get abbreviated content for preview
  const getContentPreview = () => {
    if (!content) return <p className="text-gray-400 italic">No content. Click Edit to add content.</p>;
    
    const htmlContent = isExpanded 
      ? content 
      : truncateContent(content);
      
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Display tags */}
      {Array.isArray(tags) && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="px-2 py-1 gap-1"
            >
              {tag.label}
              {isEditMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onRemoveTag(tag.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Display media items */}
      {Array.isArray(media) && media.length > 0 && (
        <div className="space-y-2">
          {media.map((item, index) => renderMediaItem(item, index))}
          {!isExpanded && media.length > 1 && (
            <div className="text-xs text-gray-500 italic">
              +{media.length - 1} more media items
            </div>
          )}
        </div>
      )}
      
      {/* Display content */}
      <div className={cn(
        "prose prose-sm",
        isExpanded ? "max-h-[400px]" : "max-h-[150px]", 
        "overflow-y-auto"
      )}>
        {getContentPreview()}
      </div>
    </div>
  );
};
