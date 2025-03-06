
import React from 'react';
import type { MediaItem } from '@/types/node';

interface NodeMediaProps {
  media?: MediaItem[];
}

export const NodeMedia: React.FC<NodeMediaProps> = ({ media = [] }) => {
  if (!Array.isArray(media) || media.length === 0) {
    return null;
  }

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

  return (
    <div className="space-y-2">
      {media.map((item, index) => renderMediaItem(item, index))}
    </div>
  );
};
