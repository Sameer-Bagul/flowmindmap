
import { memo, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getDefaultColors } from '@/utils/nodeUtils';
import { NodeHandles } from './nodes/NodeHandles';
import { NodeTitleEditor } from './nodes/NodeTitleEditor';
import { NodeActions } from './nodes/NodeActions';
import type { TextNodeData } from '../types/node';

interface ShapeNodeProps {
  id: string;
  data: TextNodeData;
  isConnectable?: boolean;
}

const ShapeNode = ({ id, data, isConnectable }: ShapeNodeProps) => {
  const { deleteElements, setNodes } = useReactFlow();
  const defaultColors = getDefaultColors(data.type);

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
    toast.success('Node deleted');
  }, [deleteElements, id]);

  const handleLabelChange = useCallback((newLabel: string) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newLabel
            }
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  // Render different shape based on type
  const renderShape = () => {
    switch (data.type) {
      case 'square':
        return 'min-w-[120px] min-h-[120px] aspect-square';
      case 'circle':
        return 'min-w-[120px] min-h-[120px] aspect-square rounded-full';
      case 'triangle':
        return 'min-w-[120px] min-h-[120px] clip-path-triangle';
      case 'text':
        return 'min-w-[150px] p-4';
      case 'image':
        return 'min-w-[200px] min-h-[150px] p-0 overflow-hidden';
      case 'table':
        return 'min-w-[200px] p-0';
      default:
        return 'min-w-[120px]';
    }
  };

  return (
    <Card 
      className={cn(
        renderShape(),
        "flex flex-col bg-white/95 dark:bg-white/95",
        "backdrop-blur-xl border-2",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
        "hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.47)]",
        "transition-all duration-200",
        "relative"
      )}
      style={{
        backgroundColor: data.backgroundColor || defaultColors.bg,
        borderColor: data.borderColor || defaultColors.border,
      }}
    >
      {data.type === 'text' && (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between">
            <NodeTitleEditor 
              label={data.label} 
              onLabelChange={handleLabelChange} 
            />
            <NodeActions 
              isEditMode={false} 
              onToggleEditMode={() => {}} 
              onExpandContent={() => {}} 
            />
          </div>
        </div>
      )}

      {data.type === 'image' && (
        <div className="relative w-full h-full flex flex-col">
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
            <NodeActions 
              isEditMode={false} 
              onToggleEditMode={() => {}} 
              onExpandContent={() => {}} 
            />
          </div>
          <div className="text-center p-2 text-sm font-medium">{data.label}</div>
          <div className="flex-1 bg-gray-200 flex items-center justify-center text-gray-500">
            Image Placeholder
          </div>
        </div>
      )}

      {data.type === 'table' && (
        <div className="flex flex-col h-full">
          <div className="p-2 text-sm font-medium border-b">{data.label}</div>
          <div className="grid grid-cols-3 text-xs">
            <div className="border p-1 font-semibold">Header 1</div>
            <div className="border p-1 font-semibold">Header 2</div>
            <div className="border p-1 font-semibold">Header 3</div>
            <div className="border p-1">Data 1</div>
            <div className="border p-1">Data 2</div>
            <div className="border p-1">Data 3</div>
          </div>
        </div>
      )}

      <NodeHandles id={id} isConnectable={isConnectable} />
    </Card>
  );
};

export default memo(ShapeNode);
