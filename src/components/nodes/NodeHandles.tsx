
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface NodeHandlesProps {
  id: string;
  isConnectable?: boolean;
}

export const NodeHandles = ({ id, isConnectable }: NodeHandlesProps) => {
  const positions = useMemo(() => [
    { position: Position.Top, id: `top-${id}` },
    { position: Position.Right, id: `right-${id}` },
    { position: Position.Bottom, id: `bottom-${id}` },
    { position: Position.Left, id: `left-${id}` }
  ], [id]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {positions.map(({ position, id }) => (
        <Handle
          key={id}
          type="source"
          position={position}
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "!bg-primary/70 hover:!bg-primary",
            "w-3 h-3 rounded-full border-2 border-white"
          )}
          id={id}
          isConnectable={isConnectable}
        />
      ))}
    </div>
  );
};
