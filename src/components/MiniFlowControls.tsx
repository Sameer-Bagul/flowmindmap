
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
  Maximize2,
  Minimize2,
  Palette,
  Sparkles,
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
  const [currentGradient, setCurrentGradient] = useState(0);

  const gradients = [
    "linear-gradient(to right, #ee9ca7, #ffdde1)",
    "linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)",
    "linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)",
    "linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)",
    "linear-gradient(90deg, hsla(59, 86%, 68%, 1) 0%, hsla(134, 36%, 53%, 1) 100%)",
    "linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)",
  ];

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

  const changeGradient = () => {
    setCurrentGradient((prev) => (prev + 1) % gradients.length);
    toast.success('Theme changed!');
  };

  if (expanded) {
    return (
      <div className="fixed bottom-4 left-4 flex flex-col gap-6 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          className="self-end rounded-full shadow-md bg-background/70 backdrop-blur-md border-white/20"
          onClick={() => setExpanded(false)}
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <FlowControls />
          <FlowActions />
          <FlowToolbar />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div 
        className="fixed bottom-4 left-4 flex flex-wrap gap-2 p-3 rounded-xl backdrop-blur-lg z-10 border border-white/20 shadow-lg"
        style={{ background: `${gradients[currentGradient]}`, maxWidth: '300px' }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/30 backdrop-blur-md border-white/20 hover:bg-white/50"
              onClick={() => setExpanded(true)}
            >
              <Maximize2 className="h-4 w-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Expand Controls</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={saveFlow} 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/30 backdrop-blur-md border-white/20 hover:bg-white/50"
            >
              <Save className="h-4 w-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Save Flow</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={downloadFlow} 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/30 backdrop-blur-md border-white/20 hover:bg-white/50"
            >
              <Download className="h-4 w-4 text-white" />
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
              className="rounded-full bg-white/30 backdrop-blur-md border-white/20 hover:bg-white/50 relative"
              onClick={() => document.getElementById('mini-flow-upload')?.click()}
            >
              <Upload className="h-4 w-4 text-white" />
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
            <Button 
              onClick={handleZoomIn} 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/30 backdrop-blur-md border-white/20 hover:bg-white/50"
            >
              <ZoomIn className="h-4 w-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={handleZoomOut} 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/30 backdrop-blur-md border-white/20 hover:bg-white/50"
            >
              <ZoomOut className="h-4 w-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Zoom Out</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={changeGradient} 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/30 backdrop-blur-md border-white/20 hover:bg-white/50"
            >
              <Palette className="h-4 w-4 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Change Theme</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
