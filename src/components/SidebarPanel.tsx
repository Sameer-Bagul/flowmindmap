
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  BookOpen, ListTodo, FileText, ChevronDown, ChevronUp, 
  Square, Circle, Triangle, ArrowRight, Text, Image, 
  Table, StickyNote
} from "lucide-react";
import { 
  CollapsibleTrigger, CollapsibleContent, Collapsible 
} from "@/components/ui/collapsible";
import type { NoteType } from '../types/node';

interface NodeTypeOption {
  type: NoteType;
  icon: React.ElementType;
  label: string;
  description?: string;
}

const textNodes: NodeTypeOption[] = [
  { type: 'chapter', icon: BookOpen, label: 'Chapter' },
  { type: 'main-topic', icon: ListTodo, label: 'Main Topic' },
  { type: 'sub-topic', icon: FileText, label: 'Sub Topic' },
];

const shapeNodes: NodeTypeOption[] = [
  { type: 'square', icon: Square, label: 'Square' },
  { type: 'circle', icon: Circle, label: 'Circle' },
  { type: 'triangle', icon: Triangle, label: 'Triangle' },
];

const specialNodes: NodeTypeOption[] = [
  { type: 'sticky-note', icon: StickyNote, label: 'Sticky Note' },
  { type: 'arrow', icon: ArrowRight, label: 'Arrow' },
];

const contentNodes: NodeTypeOption[] = [
  { type: 'text', icon: Text, label: 'Text Block' },
  { type: 'image', icon: Image, label: 'Image' },
  { type: 'table', icon: Table, label: 'Table' },
];

interface NodeCategoryProps {
  title: string;
  nodes: NodeTypeOption[];
  defaultOpen?: boolean;
}

const NodeCategory = ({ title, nodes, defaultOpen = false }: NodeCategoryProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-foreground/80">{title}</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="space-y-2 mb-3">
        {nodes.map(({ type, icon: Icon, label }) => (
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

export const SidebarPanel = () => {
  return (
    <div className="flex flex-col gap-2 bg-background/40 p-4 rounded-xl backdrop-blur-md border shadow-lg max-h-[calc(100vh-2rem)] overflow-y-auto">
      <h2 className="text-lg font-bold mb-3">Node Library</h2>
      
      <NodeCategory title="Document Nodes" nodes={textNodes} defaultOpen={true} />
      <NodeCategory title="Basic Shapes" nodes={shapeNodes} />
      <NodeCategory title="Special Nodes" nodes={specialNodes} />
      <NodeCategory title="Content Blocks" nodes={contentNodes} />
    </div>
  );
};
