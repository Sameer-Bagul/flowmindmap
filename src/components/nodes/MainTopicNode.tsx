import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { NodeControls } from './NodeControls';
import { NodeContent } from './NodeContent';
import type { TextNodeData } from '../TextNode';

const MainTopicNode = ({ id, data }: { id: string; data: TextNodeData }) => {
  return (
    <>
      <NodeResizer 
        minWidth={350}
        minHeight={250}
        isVisible={true}
        lineClassName="border-blue-500"
        handleClassName="h-3 w-3 bg-white border-2 border-blue-500 rounded-full"
      />
      <Card 
        className={cn(
          "min-w-[350px] min-h-[250px] p-6",
          "bg-blue-100/70 dark:bg-blue-100/70",
          "backdrop-blur-xl border-2 border-blue-500",
          "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
        )}
      >
        <div className="h-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="capitalize backdrop-blur-sm bg-blue-500/20 text-blue-700">
              Main Topic
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
                "!bg-blue-500/50 hover:!bg-blue-500",
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

export default memo(MainTopicNode);