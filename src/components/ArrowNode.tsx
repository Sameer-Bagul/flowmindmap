
import { memo, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { NodeHandles } from './nodes/NodeHandles';
import { TextNodeData } from '@/types/node';

interface ArrowNodeProps {
  id: string;
  data: TextNodeData;
  isConnectable?: boolean;
}

const ArrowNode = ({ id, data, isConnectable }: ArrowNodeProps) => {
  const { deleteElements } = useReactFlow();

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
  }, [deleteElements, id]);

  // Render an arrow shape
  return (
    <div 
      className="min-w-[100px] min-h-[40px] flex items-center justify-center"
      onDoubleClick={handleDelete}
    >
      <svg width="100" height="40" viewBox="0 0 100 40">
        <defs>
          <marker
            id={`arrowhead-${id}`}
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon 
              points="0 0, 10 3.5, 0 7" 
              fill={data.borderColor || '#3b82f6'} 
            />
          </marker>
        </defs>
        <line
          x1="0"
          y1="20"
          x2="90"
          y2="20"
          stroke={data.borderColor || '#3b82f6'}
          strokeWidth="3"
          markerEnd={`url(#arrowhead-${id})`}
        />
      </svg>
      
      <NodeHandles id={id} isConnectable={isConnectable} />
    </div>
  );
};

export default memo(ArrowNode);
