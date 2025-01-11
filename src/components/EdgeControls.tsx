import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReactFlow, Edge } from '@xyflow/react';
import { toast } from "sonner";
import { ColorPicker } from './ColorPicker';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const defaultEdgeStyle = {
  stroke: '#3b82f6',
  strokeWidth: 2,
};

export const EdgeControls = () => {
  const { setEdges, getEdges, getNodes } = useReactFlow();

  const updateEdgeStyle = (style: string) => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        type: style,
        style: edge.style || defaultEdgeStyle,
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

  const updateEdgeColor = (color: string) => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        style: { 
          ...edge.style, 
          stroke: color,
          strokeWidth: edge.style?.strokeWidth || 2
        },
      }))
    );
    toast.success('Edge color updated');
  };

  const updateEdgeWidth = (width: number) => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        style: { ...edge.style, strokeWidth: width }
      }))
    );
    toast.success('Edge width updated');
  };

  const downloadPDF = async () => {
    const element = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!element) {
      toast.error('Could not find flow element');
      return;
    }

    try {
      const nodes = getNodes();
      const bounds = nodes.reduce(
        (acc, node) => ({
          minX: Math.min(acc.minX, node.position.x),
          minY: Math.min(acc.minY, node.position.y),
          maxX: Math.max(acc.maxX, node.position.x + (node.width || 0)),
          maxY: Math.max(acc.maxY, node.position.y + (node.height || 0)),
        }),
        { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
      );

      element.style.width = `${bounds.maxX - bounds.minX + 100}px`;
      element.style.height = `${bounds.maxY - bounds.minY + 100}px`;

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('mindmap.pdf');
      toast.success('Flow exported as PDF');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to export PDF');
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-background/60 backdrop-blur-sm rounded-lg border shadow-sm">
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
          value={getEdges()[0]?.style?.stroke || '#3b82f6'}
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

      <Button onClick={downloadPDF} variant="secondary" className="w-full">
        Download as PDF
      </Button>
    </div>
  );
};