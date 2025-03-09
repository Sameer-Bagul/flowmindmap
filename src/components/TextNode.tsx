
import { useState, useRef, useCallback, memo } from 'react';
import { NodeHeader } from './nodes/NodeHeader';
import { NodeTitleEditor } from './nodes/NodeTitleEditor';
import { NodeActions } from './nodes/NodeActions';
import { NodeViewContent } from './nodes/NodeViewContent';
import { NodeContentEditor } from './nodes/NodeContentEditor';
import { TagDisplay } from './nodes/TagDisplay';
import { NodeWrapper } from './nodes/NodeWrapper';
import { useNodeData } from '@/hooks/useNodeData';
import { useEditMode } from '@/hooks/useEditMode';
import { getDefaultColors } from '@/utils/nodeUtils';
import type { TextNodeData } from '../types/node';

const TextNode = memo(({ id, data, isConnectable }: { id: string, data: TextNodeData; isConnectable?: boolean }) => {
  const [label, setLabel] = useState(data.label || '');
  const { isEditMode, toggleEditMode } = useEditMode(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const defaultColors = getDefaultColors(data.type);

  const {
    handleDelete,
    updateNodeColor,
    handleContentChange,
    handleLabelChange,
    handleAddTag,
    handleRemoveTag,
    handleAddMedia,
    handleRemoveMedia,
    expandContentWithAI
  } = useNodeData(id);

  const onLabelChange = useCallback((newLabel: string) => {
    setLabel(newLabel);
    handleLabelChange(newLabel);
  }, [handleLabelChange]);

  return (
    <NodeWrapper
      id={id}
      isEditMode={isEditMode}
      backgroundColor={data.backgroundColor || defaultColors.bg}
      borderColor={data.borderColor || defaultColors.border}
      isConnectable={isConnectable}
    >
      <div className="flex items-center justify-between">
        <NodeHeader
          type={data.type}
          backgroundColor={data.backgroundColor || defaultColors.bg}
          borderColor={data.borderColor || defaultColors.border}
          defaultColors={defaultColors}
          onUpdateColor={updateNodeColor}
          onDelete={handleDelete}
        />

        <NodeActions 
          isEditMode={isEditMode} 
          onToggleEditMode={toggleEditMode} 
          onExpandContent={expandContentWithAI} 
        />
      </div>

      <NodeTitleEditor 
        label={label} 
        onLabelChange={onLabelChange} 
      />

      {/* Display tags in non-edit mode */}
      {!isEditMode && Array.isArray(data.tags) && data.tags.length > 0 && (
        <TagDisplay 
          tags={data.tags} 
          isEditMode={false} 
        />
      )}

      {isEditMode ? (
        <NodeContentEditor 
          content={data.content || ''}
          media={Array.isArray(data.media) ? data.media : []}
          tags={Array.isArray(data.tags) ? data.tags : []}
          onContentChange={handleContentChange}
          onAddMedia={handleAddMedia}
          onRemoveMedia={handleRemoveMedia}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      ) : (
        <NodeViewContent 
          content={data.content}
          media={data.media}
          tags={data.tags}
        />
      )}
    </NodeWrapper>
  );
});

TextNode.displayName = 'TextNode';

export default TextNode;
