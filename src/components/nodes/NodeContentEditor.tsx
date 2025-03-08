
import React from 'react';
import { NoteEditor } from '@/components/NoteEditor';
import { MediaSection } from '@/components/nodes/MediaSection';
import { TagInput } from '@/components/TagInput';
import { TagDisplay } from '@/components/nodes/TagDisplay';
import { MediaItem, Tag } from '@/types/node';

interface NodeContentEditorProps {
  content: string;
  media: MediaItem[];
  tags: Tag[];
  onContentChange: (content: string) => void;
  onAddMedia: (mediaItem: MediaItem) => void;
  onRemoveMedia: (index: number) => void;
  onAddTag: (tag: Tag) => void;
  onRemoveTag: (tagId: string) => void;
}

export const NodeContentEditor: React.FC<NodeContentEditorProps> = ({
  content,
  media,
  tags,
  onContentChange,
  onAddMedia,
  onRemoveMedia,
  onAddTag,
  onRemoveTag
}) => {
  return (
    <>
      <TagDisplay 
        tags={tags} 
        isEditMode={true} 
        onRemoveTag={onRemoveTag} 
      />
    
      <TagInput
        tags={tags}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />

      <MediaSection 
        media={media}
        onAddMedia={onAddMedia}
        onRemoveMedia={onRemoveMedia}
      />
      
      <NoteEditor 
        content={content} 
        onChange={onContentChange}
        autoFocus
      />
    </>
  );
};
