
import { Button } from "@/components/ui/button";
import { Save, Upload, Download, ZoomIn, ZoomOut } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";

export const FlowControls = () => {
  const { getNodes, getEdges, setNodes, setEdges, zoomIn, zoomOut } = useReactFlow();

  const saveFlow = () => {
    const flow = { nodes: getNodes(), edges: getEdges() };
    localStorage.setItem('flow', JSON.stringify(flow));
    toast.success('Flow saved successfully!');
  };

  const downloadFlow = () => {
    const flow = { nodes: getNodes(), edges: getEdges() };
    const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mindmap-flow.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Flow downloaded successfully!');
  };

  const uploadFlow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const flow = JSON.parse(e.target?.result as string);
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          toast.success('Flow imported successfully!');
        } catch (error) {
          toast.error('Error importing flow. Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Wrapper functions to handle the zoom events
  const handleZoomIn = () => {
    zoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={saveFlow} variant="outline" className="gap-2 justify-start">
        <Save className="h-4 w-4" />
        Save Flow
      </Button>
      <Button onClick={downloadFlow} variant="outline" className="gap-2 justify-start">
        <Download className="h-4 w-4" />
        Download JSON
      </Button>
      <Button
        variant="outline"
        className="gap-2 justify-start relative"
        onClick={() => document.getElementById('flow-upload')?.click()}
      >
        <Upload className="h-4 w-4" />
        Upload JSON
        <input
          id="flow-upload"
          type="file"
          accept=".json"
          onChange={uploadFlow}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </Button>
      <Button onClick={handleZoomIn} variant="outline" className="gap-2 justify-start">
        <ZoomIn className="h-4 w-4" />
        Zoom In
      </Button>
      <Button onClick={handleZoomOut} variant="outline" className="gap-2 justify-start">
        <ZoomOut className="h-4 w-4" />
        Zoom Out
      </Button>
    </div>
  );
};
