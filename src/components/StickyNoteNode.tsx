
import { useState, useCallback, memo } from 'react';
import { useReactFlow } from '@xyflow/react';
import { cn } from "@/lib/utils";
import { Card } from '@/components/ui/card';
import { Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { NodeHandles } from './nodes/NodeHandles';
import { NodeTitleEditor } from './nodes/NodeTitleEditor';
import { TextNodeData } from '@/types/node';

interface StickyNoteNodeProps {
  id: string;
  data: TextNodeData;
  isConnectable?: boolean;
}

const StickyNoteNode = memo(({ id, data, isConnectable }: StickyNoteNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content || '');
  const { setNodes, deleteElements } = useReactFlow();

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

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  const toggleEditing = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  const saveContent = useCallback(() => {
    setIsEditing(false);
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              content
            }
          };
        }
        return node;
      })
    );
    toast.success('Sticky note updated');
  }, [content, id, setNodes]);

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
    toast.success('Sticky note deleted');
  }, [deleteElements, id]);

  return (
    <Card
      className={cn(
        "min-w-[200px] min-h-[200px]",
        "p-4",
        "bg-yellow-100 dark:bg-yellow-100",
        "border-2 border-yellow-300",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
        "hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.47)]",
        "transition-all duration-200",
        "relative",
        "flex flex-col"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <NodeTitleEditor 
          label={data.label} 
          onLabelChange={handleLabelChange} 
        />
        <div className="flex gap-1">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6" 
            onClick={toggleEditing}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6" 
            onClick={handleDelete}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="flex-1 flex flex-col">
          <textarea
            className="flex-1 p-2 bg-yellow-50 resize-none border border-yellow-200 rounded"
            value={content}
            onChange={handleContentChange}
            placeholder="Write your note here..."
          />
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 self-end"
            onClick={saveContent}
          >
            Save
          </Button>
        </div>
      ) : (
        <div 
          className="flex-1 p-2 text-slate-700 whitespace-pre-wrap" 
          style={{ fontSize: '14px', fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
        >
          {content || "Double-click to edit"}
        </div>
      )}

      <NodeHandles id={id} isConnectable={isConnectable} />
    </Card>
  );
});

StickyNoteNode.displayName = 'StickyNoteNode';

export default StickyNoteNode;
