
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={onToggleEditMode}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isEditMode ? "Collapse node" : "Expand and edit node"}
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={onExpandContent}
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Expand content with AI
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
