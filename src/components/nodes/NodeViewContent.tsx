
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NodeMedia } from './NodeMedia';
import type { MediaItem, Tag } from '@/types/node';

interface NodeViewContentProps {
  content?: string;
  media?: MediaItem[];
  tags?: Tag[];
}

export const NodeViewContent: React.FC<NodeViewContentProps> = ({ 
  content, 
  media = [], 
  tags = [] 
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Display tags */}
      {Array.isArray(tags) && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="px-2 py-1"
            >
              {tag.label}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Display media items */}
      {Array.isArray(media) && media.length > 0 && (
        <NodeMedia media={media} />
      )}
      
      {/* Display content */}
      <div className="prose prose-sm max-h-[300px] overflow-y-auto">
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <p className="text-gray-400 italic">No content. Click Edit to add content.</p>
        )}
      </div>
    </div>
  );
};
