
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Sparkles } from 'lucide-react';

interface NodeActionsProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onExpandContent: () => void;
}

export const NodeActions: React.FC<NodeActionsProps> = ({ 
  isEditMode, 
  onToggleEditMode, 
  onExpandContent 
}) => {
  return (
    <div className="flex gap-1">
      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8"
        onClick={onToggleEditMode}
        title={isEditMode ? "Collapse node" : "Expand and edit node"}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8"
        onClick={onExpandContent}
        title="Expand content with AI"
      >
        <Sparkles className="h-4 w-4" />
      </Button>
    </div>
  );
};
