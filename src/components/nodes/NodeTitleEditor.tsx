
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';

interface NodeTitleEditorProps {
  label: string;
  onLabelChange: (newLabel: string) => void;
}

export const NodeTitleEditor: React.FC<NodeTitleEditorProps> = ({ label, onLabelChange }) => {
  const [isLabelEditing, setIsLabelEditing] = useState(false);
  const [editingLabel, setEditingLabel] = useState(label || '');

  const handleDoubleClick = useCallback(() => {
    setIsLabelEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (editingLabel.trim()) {
      setIsLabelEditing(false);
      onLabelChange(editingLabel);
    }
  }, [editingLabel, onLabelChange]);

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent) => {
      if (evt.key === 'Enter') {
        evt.preventDefault();
        handleBlur();
      }
    },
    [handleBlur]
  );

  if (isLabelEditing) {
    return (
      <Input
        type="text"
        value={editingLabel}
        onChange={(e) => setEditingLabel(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="text-xl font-medium bg-white/50 backdrop-blur-sm text-gray-800"
        placeholder="Enter note title..."
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="text-xl font-medium cursor-text select-none min-h-[40px] flex items-center text-gray-800"
    >
      {label || 'Double click to edit'}
    </div>
  );
};
