import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReactFlow, MarkerType, Panel, Edge } from "@xyflow/react";
import { toast } from "sonner";
import { ColorPicker } from './ColorPicker';
import { toPng } from 'html-to-image';

export const EdgeControls = () => {
  const { setEdges, getEdges, getNodes, screenToFlowPosition } = useReactFlow();

  const updateEdgeStyle = (style: string) => {
    setEdges((eds: Edge[]) =>
      eds.map((edge: Edge) => ({
        ...edge,
        type: style,
      }))
    );
    toast.success(`Edge style updated to ${style}`);
  };

  const toggleEdgeAnimation = () => {
    setEdges((eds: Edge[]) =>
      eds.map((edge: Edge) => ({
        ...edge,
        animated: !edge.animated,
      }))
    );
    const isAnimated = !getEdges()[0]?.animated;
    toast.success(`Edge animation ${isAnimated ? 'enabled' : 'disabled'}`);
  };

  const toggleEdgeArrows = () => {
    setEdges((eds: Edge[]) =>
      eds.map((edge: Edge) => ({
        ...edge,
        markerEnd: edge.markerEnd ? undefined : { 
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: edge.style?.stroke || '#000000'
        },
      }))
    );
    const hasArrows = !getEdges()[0]?.markerEnd;
    toast.success(`Edge arrows ${hasArrows ? 'enabled' : 'disabled'}`);
  };

  const updateEdgeColor = (color: string) => {
    setEdges((eds: Edge[]) =>
      eds.map((edge: Edge) => ({
        ...edge,
        style: { 
          ...edge.style, 
          stroke: color,
          strokeWidth: edge.style?.strokeWidth || 2
        },
        markerEnd: edge.markerEnd ? {
          ...edge.markerEnd,
          color: color
        } : undefined
      }))
    );
    toast.success('Edge color updated');
  };

  const updateEdgeWidth = (width: number) => {
    setEdges((eds: Edge[]) =>
      eds.map((edge: Edge) => ({
        ...edge,
        style: { ...edge.style, strokeWidth: width }
      }))
    );
    toast.success('Edge width updated');
  };

  const downloadImage = () => {
    const element = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!element) {
      toast.error('Could not find flow element');
      return;
    }

    const scale = 2;
    const width = element.offsetWidth * scale;
    const height = element.offsetHeight * scale;

    toPng(element, {
      backgroundColor: '#ffffff',
      width,
      height,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      },
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'flow.png';
        link.href = dataUrl;
        link.click();
        toast.success('Flow image downloaded');
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('Failed to download image');
      });
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
            <SelectItem value="bezier">Bezier</SelectItem>
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

      <div className="space-y-2">
        <Label>Edge Width</Label>
        <Slider
          defaultValue={[2]}
          max={10}
          min={1}
          step={1}
          onValueChange={(value) => updateEdgeWidth(value[0])}
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

      <Button onClick={downloadImage} variant="secondary" className="w-full">
        Download Flow Image
      </Button>
    </div>
  );
};