
import { Button } from "@/components/ui/button";
import { BookOpen, ListTodo, FileText, Sparkles } from "lucide-react";
import type { NoteType } from '../types/node';
import { Badge } from "@/components/ui/badge";

export const FlowToolbar = () => {
  return (
    <div className="flow-panel p-6 space-y-4 min-w-[280px]">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-foreground/90 text-lg">Add New Node</h3>
      </div>
      
      <div className="space-y-3">
        {[
          { 
            type: 'chapter' as NoteType, 
            icon: BookOpen, 
            label: 'Chapter',
            description: 'Main sections of your mindmap',
            className: 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-100'
          },
          { 
            type: 'main-topic' as NoteType, 
            icon: ListTodo, 
            label: 'Main Topic',
            description: 'Primary connecting ideas',
            className: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-800 dark:text-blue-100'
          },
          { 
            type: 'sub-topic' as NoteType, 
            icon: FileText, 
            label: 'Sub Topic',
            description: 'Supporting details & notes',
            className: 'bg-green-100 hover:bg-green-200 dark:bg-green-900/40 dark:hover:bg-green-900/60 text-green-800 dark:text-green-100'
          },
        ].map(({ type, icon: Icon, label, description, className }) => (
          <div 
            key={type}
            className="group"
          >
            <Button
              variant="outline"
              className={`flex gap-3 justify-start cursor-grab active:cursor-grabbing w-full items-center py-6 transition-all border-2 ${className}`}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', type);
                event.dataTransfer.effectAllowed = 'move';
              }}
            >
              <div className="bg-white/60 dark:bg-zinc-800/60 p-2 rounded-lg border shadow-sm">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-medium text-base">{label}</div>
                <div className="text-xs opacity-75">{description}</div>
              </div>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
