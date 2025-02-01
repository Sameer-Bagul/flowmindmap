import { useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Tag } from '@/types/node';

interface TagInputProps {
  tags: Tag[];
  onAddTag: (tag: Tag) => void;
  onRemoveTag: (tagId: string) => void;
}

export const TagInput = ({ tags, onAddTag, onRemoveTag }: TagInputProps) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = useCallback(() => {
    if (newTag.trim()) {
      onAddTag({
        id: `tag-${Date.now()}`,
        label: newTag.trim(),
      });
      setNewTag('');
    }
  }, [newTag, onAddTag]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag]
  );

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag..."
          className="flex-1"
        />
        <Button onClick={handleAddTag} size="icon" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="px-2 py-1 gap-1"
          >
            {tag.label}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => onRemoveTag(tag.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};