import { Handle, Position } from '@xyflow/react';
import { cn } from "@/lib/utils";

interface NodeHandlesProps {
  id: string;
  isConnectable?: boolean;
}

export const NodeHandles = ({ id, isConnectable }: NodeHandlesProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {['top', 'right', 'bottom', 'left'].map((position) => (
        <Handle
          key={position}
          type="source"
          position={position as Position}
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "!bg-primary/50 hover:!bg-primary",
            "w-3 h-3 rounded-full border-2 border-white"
          )}
          id={`${position}-${id}`}
          isConnectable={isConnectable}
        />
      ))}
    </div>
  );
};