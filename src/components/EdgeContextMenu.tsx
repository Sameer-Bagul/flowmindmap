import { useCallback } from "react";
import { Edge, useReactFlow } from "@xyflow/react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ColorPicker } from "./ColorPicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface EdgeContextMenuProps {
  edge: Edge;
  children: React.ReactNode;
}

export function EdgeContextMenu({ children, edge }: EdgeContextMenuProps) {
  const { setEdges } = useReactFlow();

  const updateEdgeStyle = useCallback((style: string) => {
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        type: e.id === edge.id ? style : e.type,
      }))
    );
    toast.success(`Edge style updated`);
  }, [edge.id, setEdges]);

  const toggleEdgeAnimation = useCallback(() => {
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        animated: e.id === edge.id ? !e.animated : e.animated,
      }))
    );
    toast.success(`Edge animation toggled`);
  }, [edge.id, setEdges]);

  const updateEdgeColor = useCallback((color: string) => {
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        style: e.id === edge.id ? { 
          ...e.style, 
          stroke: color,
          strokeWidth: e.style?.strokeWidth || 2
        } : e.style,
      }))
    );
    toast.success('Edge color updated');
  }, [edge.id, setEdges]);

  const deleteEdge = useCallback(() => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    toast.success('Edge deleted');
  }, [edge.id, setEdges]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          <div className="flex items-center justify-between w-full">
            <span>Edge Style</span>
            <Select onValueChange={updateEdgeStyle} defaultValue={edge.type || 'default'}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Straight</SelectItem>
                <SelectItem value="smoothstep">Smooth</SelectItem>
                <SelectItem value="step">Step</SelectItem>
                <SelectItem value="bezier">Bezier</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ContextMenuItem>
        <ContextMenuItem>
          <div className="flex items-center justify-between w-full">
            <span>Edge Color</span>
            <ColorPicker
              value={edge.style?.stroke as string || '#3b82f6'}
              onChange={updateEdgeColor}
            />
          </div>
        </ContextMenuItem>
        <ContextMenuItem onClick={toggleEdgeAnimation}>
          Toggle Animation
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-red-600" onClick={deleteEdge}>
          Delete Edge
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}