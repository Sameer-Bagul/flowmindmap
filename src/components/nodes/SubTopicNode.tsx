import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { NodeControls } from './NodeControls';
import { NodeContent } from './NodeContent';
import type { TextNodeData } from '../TextNode';

const SubTopicNode = ({ id, data }: { id: string; data: TextNodeData }) => {
  return (
    <>
      <NodeResizer 
        minWidth={350}
        minHeight={250}
        isVisible={true}
        lineClassName="border-green-500"
        handleClassName="h-3 w-3 bg-white border-2 border-green-500 rounded-full"
      />
      <Card 
        className={cn(
          "min-w-[350px] min-h-[250px] p-6",
          "bg-green-100/70 dark:bg-green-100/70",
          "backdrop-blur-xl border-2 border-green-500",
          "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
        )}
      >
        <div className="h-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="capitalize backdrop-blur-sm bg-green-500/20 text-green-700">
              Sub Topic
            </Badge>
            <NodeControls id={id} data={data} />
          </div>
          <NodeContent id={id} data={data} />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {['top', 'right', 'bottom', 'left'].map((position) => (
            <Handle
              key={position}
              type="source"
              position={position as Position}
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                "!bg-green-500/50 hover:!bg-green-500",
                "w-3 h-3 rounded-full border-2 border-white"
              )}
              id={`${position}-${id}`}
            />
          ))}
        </div>
      </Card>
    </>
  );
};

export default memo(SubTopicNode);