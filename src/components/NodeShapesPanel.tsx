
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, BookOpen, ListTodo, FileText } from "lucide-react";
import { CollapsibleTrigger, CollapsibleContent, Collapsible } from "@/components/ui/collapsible";
import type { NoteType } from '../types/node';

interface ShapeType {
  type: NoteType;
  icon: React.ElementType;
  label: string;
}

const nodeShapes: ShapeType[] = [
  { type: 'chapter', icon: BookOpen, label: 'Chapter' },
  { type: 'main-topic', icon: ListTodo, label: 'Main Topic' },
  { type: 'sub-topic', icon: FileText, label: 'Sub Topic' },
];

export const NodeShapesPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex flex-col gap-2 bg-background/40 p-4 rounded-xl backdrop-blur-md border shadow-lg"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground/80">Node Shapes</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="space-y-2 mt-2">
        {nodeShapes.map(({ type, icon: Icon, label }) => (
          <Button
            key={type}
            variant="outline"
            className="gap-2 justify-start cursor-grab active:cursor-grabbing hover:bg-accent hover:text-accent-foreground w-full h-10"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', type);
              event.dataTransfer.effectAllowed = 'move';
            }}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
