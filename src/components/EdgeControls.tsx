import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useReactFlow, Edge } from '@xyflow/react';
import { toast } from "sonner";
import { ColorPicker } from './ColorPicker';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useState } from "react";

const defaultEdgeStyle = {
  stroke: '#3b82f6',
  strokeWidth: 2,
  opacity: 1,
};

export const EdgeControls = () => {
  const { setEdges, getEdges } = useReactFlow();
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const edges = getEdges();

  const updateEdgeStyle = (style: string) => {
    if (!selectedEdge) {
      toast.error('Please select an edge first');
      return;
    }
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        type: edge.id === selectedEdge ? style : edge.type,
        style: edge.id === selectedEdge ? edge.style || defaultEdgeStyle : edge.style,
      }))
    );
    toast.success(`Edge style updated`);
  };

  const toggleEdgeAnimation = () => {
    if (!selectedEdge) {
      toast.error('Please select an edge first');
      return;
    }
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: edge.id === selectedEdge ? !edge.animated : edge.animated,
      }))
    );
    const edge = edges.find(e => e.id === selectedEdge);
    const isAnimated = !edge?.animated;
    toast.success(`Edge animation ${isAnimated ? 'enabled' : 'disabled'}`);
  };

  const updateEdgeColor = (color: string) => {
    if (!selectedEdge) {
      toast.error('Please select an edge first');
      return;
    }
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        style: edge.id === selectedEdge ? { 
          ...edge.style, 
          stroke: color,
          strokeWidth: edge.style?.strokeWidth || 2
        } : edge.style,
      }))
    );
    toast.success('Edge color updated');
  };

  const deleteSelectedEdge = () => {
    if (!selectedEdge) {
      toast.error('Please select an edge first');
      return;
    }
    setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge));
    setSelectedEdge(null);
    toast.success('Edge deleted');
  };

  const updateEdgeWidth = (width: number) => {
    if (!selectedEdge) {
      toast.error('Please select an edge first');
      return;
    }
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        style: edge.id === selectedEdge ? { ...edge.style, strokeWidth: width } : edge.style,
      }))
    );
    toast.success('Edge width updated');
  };

  const updateEdgeOpacity = (opacity: number) => {
    if (!selectedEdge) {
      toast.error('Please select an edge first');
      return;
    }
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        style: edge.id === selectedEdge ? { ...edge.style, opacity } : edge.style,
      }))
    );
    toast.success('Edge opacity updated');
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-background/60 backdrop-blur-sm rounded-lg border shadow-sm">
      <div className="space-y-2">
        <Label>Select Edge</Label>
        <Select value={selectedEdge || ''} onValueChange={setSelectedEdge}>
          <SelectTrigger>
            <SelectValue placeholder="Select an edge" />
          </SelectTrigger>
          <SelectContent>
            {edges.map((edge) => (
              <SelectItem key={edge.id} value={edge.id}>
                Edge {edge.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Edge Style</Label>
        <Select onValueChange={updateEdgeStyle} defaultValue="smoothstep">
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

      <div className="flex items-center justify-between gap-4">
        <Label>Edge Color</Label>
        <ColorPicker
          value={edges.find(e => e.id === selectedEdge)?.style?.stroke || '#3b82f6'}
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

      <div className="space-y-2">
        <Label>Edge Opacity</Label>
        <Slider
          defaultValue={[1]}
          max={1}
          min={0}
          step={0.1}
          onValueChange={(value) => updateEdgeOpacity(value[0])}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label>Animate Edge</Label>
        <Switch onCheckedChange={toggleEdgeAnimation} />
      </div>

      <Button 
        onClick={deleteSelectedEdge} 
        variant="destructive"
        className="w-full"
      >
        Delete Edge
      </Button>
    </div>
  );
};