import { useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { NoteEditor } from '../NoteEditor';
import type { TextNodeData } from '../TextNode';

export const NodeContent = ({ id, data }: { id: string; data: TextNodeData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const { setNodes } = useReactFlow();

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (label.trim()) {
      setIsEditing(false);
      setNodes(nodes => 
        nodes.map(node => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                label
              }
            };
          }
          return node;
        })
      );
    }
  }, [id, label, setNodes]);

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent) => {
      if (evt.key === 'Enter') {
        evt.preventDefault();
        handleBlur();
      }
    },
    [handleBlur]
  );

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
    <>
      {isEditing ? (
        <Input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="text-lg font-medium bg-white/50 backdrop-blur-sm text-gray-800"
          placeholder="Enter note title..."
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          className="text-lg font-medium cursor-text select-none min-h-[40px] flex items-center text-gray-800"
        >
          {label || 'Double click to edit'}
        </div>
      )}
      <NoteEditor content={data.content || ''} onChange={handleContentChange} />
    </>
  );
};