import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReactFlow, MarkerType } from "@xyflow/react";
import { toast } from "sonner";
import { ColorPicker } from './ColorPicker';

export const EdgeControls = () => {
  const { setEdges, getEdges } = useReactFlow();

  const updateEdgeStyle = (style: string) => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        type: style,
      }))
    );
    toast.success(`Edge style updated to ${style}`);
  };

  const toggleEdgeAnimation = () => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: !edge.animated,
      }))
    );
    const isAnimated = !getEdges()[0]?.animated;
    toast.success(`Edge animation ${isAnimated ? 'enabled' : 'disabled'}`);
  };

  const toggleEdgeArrows = () => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        markerEnd: edge.markerEnd ? undefined : { type: MarkerType.Arrow },
      }))
    );
    const hasArrows = !getEdges()[0]?.markerEnd;
    toast.success(`Edge arrows ${hasArrows ? 'enabled' : 'disabled'}`);
  };

  const updateEdgeColor = (color: string) => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        style: { ...edge.style, stroke: color },
      }))
    );
    toast.success('Edge color updated');
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-background/60 backdrop-blur-sm rounded-lg border shadow-sm">
      <div className="space-y-2">
        <Label>Edge Style</Label>
        <Select onValueChange={updateEdgeStyle} defaultValue="default">
          <SelectTrigger>
            <SelectValue placeholder="Select edge style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Straight</SelectItem>
            <SelectItem value="smoothstep">Smooth</SelectItem>
            <SelectItem value="step">Step</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Edge Color</Label>
        <ColorPicker
          value={getEdges()[0]?.style?.stroke || '#000000'}
          onChange={updateEdgeColor}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Animate Edges</Label>
        <Switch onCheckedChange={toggleEdgeAnimation} />
      </div>

      <div className="flex items-center justify-between">
        <Label>Show Arrows</Label>
        <Switch onCheckedChange={toggleEdgeArrows} />
      </div>
    </div>
  );
};