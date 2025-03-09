
import { useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { NoteType } from '../../types/node';

interface NodeButtonProps {
  type: NoteType;
  icon: React.ElementType;
  label: string;
}

export const NodeButton = ({ type, icon: Icon, label }: NodeButtonProps) => {
  const handleDragStart = useCallback((event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  }, [type]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="glass-icon"
          size="icon"
          className="h-10 w-10 mb-2 cursor-grab active:cursor-grabbing"
          draggable
          onDragStart={handleDragStart}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};
