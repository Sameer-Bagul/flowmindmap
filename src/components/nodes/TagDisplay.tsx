
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Tag } from '@/types/node';

interface TagDisplayProps {
  tags: Tag[];
  isEditMode: boolean;
  onRemoveTag?: (tagId: string) => void;
}

export const TagDisplay: React.FC<TagDisplayProps> = ({ 
  tags = [], 
  isEditMode, 
  onRemoveTag 
}) => {
  if (!Array.isArray(tags) || tags.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className="px-2 py-1 gap-1"
        >
          {tag.label}
          {isEditMode && onRemoveTag && (
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
  );
};
