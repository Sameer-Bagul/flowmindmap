import { Button } from "@/components/ui/button";
import { BookOpen, ListTodo, FileText } from "lucide-react";
import type { NoteType } from '../types/node';

export const FlowToolbar = () => {
  return (
    <div className="flex flex-col gap-2 bg-background/40 p-4 rounded-xl backdrop-blur-md border shadow-lg">
      <h3 className="font-semibold text-foreground/80 mb-2">Add New Node</h3>
      {[
        { type: 'chapter' as NoteType, icon: BookOpen, label: 'Chapter' },
        { type: 'main-topic' as NoteType, icon: ListTodo, label: 'Main Topic' },
        { type: 'sub-topic' as NoteType, icon: FileText, label: 'Sub Topic' },
      ].map(({ type, icon: Icon, label }) => (
        <Button
          key={type}
          variant="secondary"
          className="gap-2 justify-start cursor-grab active:cursor-grabbing bg-white/50 hover:bg-white/70 dark:text-gray-800"
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
    </div>
  );
};