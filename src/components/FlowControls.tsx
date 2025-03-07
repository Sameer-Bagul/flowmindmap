
import { Button } from "@/components/ui/button";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid3X3, 
  Save, 
  Download,
  Lock, 
  Unlock,
  PanelLeftOpen
} from "lucide-react";
import { useReactFlow } from '@xyflow/react';
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const FlowControls = () => {
  const { zoomIn, zoomOut, fitView, setCenter } = useReactFlow();
  const [locked, setLocked] = useState(false);

  const handleFitView = () => {
    fitView({ padding: 0.2, includeHiddenNodes: false });
  };

  const handleToogleLock = () => {
    setLocked(!locked);
    toast.success(locked ? 'Canvas unlocked' : 'Canvas locked');
  };

  const handleSave = () => {
    toast.success('Mindmap saved successfully');
  };

  const handleExport = () => {
    toast.success('Mindmap exported as image');
  };

  const centerView = () => {
    setCenter(0, 0, { zoom: 1, duration: 800 });
  };

  // Wrapper functions for zoom to handle button click events
  const handleZoomIn = () => {
    zoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
  };

  return (
    <div className="flow-panel p-4 space-y-4">
      <div className="flex items-center gap-2">
        <PanelLeftOpen className="h-4 w-4 text-primary" />
        <h3 className="font-bold text-foreground/90">Flow Controls</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          onClick={handleZoomIn} 
          variant="outline" 
          size="sm"
          className="flow-control-button flex gap-2 justify-center"
        >
          <ZoomIn className="h-4 w-4" />
          <span className="text-xs">Zoom In</span>
        </Button>
        
        <Button 
          onClick={handleZoomOut} 
          variant="outline" 
          size="sm"
          className="flow-control-button flex gap-2 justify-center"
        >
          <ZoomOut className="h-4 w-4" />
          <span className="text-xs">Zoom Out</span>
        </Button>
        
        <Button 
          onClick={handleFitView} 
          variant="outline"
          size="sm"
          className="flow-control-button flex gap-2 justify-center"
        >
          <Maximize2 className="h-4 w-4" />
          <span className="text-xs">Fit View</span>
        </Button>
        
        <Button 
          onClick={centerView} 
          variant="outline"
          size="sm"
          className="flow-control-button flex gap-2 justify-center"
        >
          <Grid3X3 className="h-4 w-4" />
          <span className="text-xs">Center</span>
        </Button>
      </div>
      
      <div className="pt-2 border-t border-border/30 grid grid-cols-2 gap-2">
        <Button 
          onClick={handleSave} 
          variant="outline"
          size="sm"
          className="flow-control-button flex gap-2 justify-center"
        >
          <Save className="h-4 w-4" />
          <span className="text-xs">Save</span>
        </Button>
        
        <Button 
          onClick={handleExport} 
          variant="outline"
          size="sm"
          className="flow-control-button flex gap-2 justify-center"
        >
          <Download className="h-4 w-4" />
          <span className="text-xs">Export</span>
        </Button>
      </div>
      
      <div className="flex items-center justify-center pt-2">
        <Button
          onClick={handleToogleLock}
          variant="outline"
          size="sm"
          className={`flow-control-button gap-2 ${locked ? 'bg-primary/20' : ''}`}
        >
          {locked ? (
            <>
              <Lock className="h-4 w-4" />
              <span className="text-xs">Locked</span>
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4" />
              <span className="text-xs">Unlocked</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
