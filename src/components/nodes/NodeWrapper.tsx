
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from "@/lib/utils";
import { NodeHandles } from './NodeHandles';

interface NodeWrapperProps {
  id: string;
  isEditMode: boolean;
  backgroundColor: string;
  borderColor: string;
  isConnectable?: boolean;
  children: React.ReactNode;
}

export const NodeWrapper: React.FC<NodeWrapperProps> = ({
  id,
  isEditMode,
  backgroundColor,
  borderColor,
  isConnectable,
  children
}) => {
  return (
    <Card 
      className={cn(
        isEditMode ? "min-w-[450px] min-h-[350px]" : "min-w-[250px]",
        "p-6",
        "bg-white/95 dark:bg-white/95",
        "backdrop-blur-xl border-2",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
        "hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.47)]",
        "transition-all duration-200",
        "relative"
      )}
      style={{
        backgroundColor,
        borderColor,
      }}
    >
      <div className="h-full flex flex-col gap-4">
        {children}
      </div>
      
      <NodeHandles id={id} isConnectable={isConnectable} />
    </Card>
  );
};
