
import { useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Save,
  Upload,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  Settings,
  Maximize2,
  Minimize2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FlowControls } from "./FlowControls";
import { FlowActions } from "./FlowActions";
import { FlowToolbar } from "./FlowToolbar";

export const MiniFlowControls = () => {
  const { getNodes, getEdges, setNodes, setEdges, zoomIn, zoomOut } = useReactFlow();
  const [expanded, setExpanded] = useState(false);

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

  const handleZoomIn = () => {
    zoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
  };

  if (expanded) {
    return (
      <div className="flex flex-col gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="self-end rounded-full" 
          onClick={() => setExpanded(false)}
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
        <FlowControls />
        <FlowActions />
        <FlowToolbar />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 bg-background/40 p-2 rounded-xl backdrop-blur-md border shadow-lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={() => setExpanded(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Expand Controls</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={saveFlow} variant="outline" size="icon" className="rounded-full">
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Save Flow</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={downloadFlow} variant="outline" size="icon" className="rounded-full">
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Download JSON</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full relative"
              onClick={() => document.getElementById('mini-flow-upload')?.click()}
            >
              <Upload className="h-4 w-4" />
              <input
                id="mini-flow-upload"
                type="file"
                accept=".json"
                onChange={uploadFlow}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Upload JSON</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleZoomIn} variant="outline" size="icon" className="rounded-full">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleZoomOut} variant="outline" size="icon" className="rounded-full">
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Zoom Out</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={() => setExpanded(true)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Show More Options</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
