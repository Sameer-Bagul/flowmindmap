import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Trash2, Settings2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { ColorPicker } from '../ColorPicker';
import { toast } from 'sonner';
import type { TextNodeData } from '@/types/node';

export const NodeControls = ({ id, data }: { id: string; data: TextNodeData }) => {
  const { deleteElements, setNodes } = useReactFlow();

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
    toast.success('Node deleted');
  }, [deleteElements, id]);

  const updateNodeColor = useCallback((key: 'backgroundColor' | 'borderColor', color: string) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              [key]: color
            }
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  return (
    <div className="flex gap-2 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings2 className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 flex flex-col gap-4 bg-white/80 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <Label>Background</Label>
            <ColorPicker
              value={data.backgroundColor || ''}
              onChange={(color) => updateNodeColor('backgroundColor', color)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Border</Label>
            <ColorPicker
              value={data.borderColor || ''}
              onChange={(color) => updateNodeColor('borderColor', color)}
            />
          </div>
        </PopoverContent>
      </Popover>
      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive/90"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
