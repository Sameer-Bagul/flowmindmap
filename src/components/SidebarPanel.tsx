
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  MenuSquare, CircleIcon, Triangle, ArrowRight, StickyNote, 
  FileText, BookOpen, ListTodo, Text, Image, Table, 
  Save, Download, Upload, Palette, X, ChevronDown, ChevronUp
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import type { NoteType } from '../types/node';

const NodeButton = ({ type, icon: Icon, label }: { type: NoteType; icon: React.ElementType; label: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="glass-icon"
          size="icon"
          className="h-10 w-10 mb-2 cursor-grab active:cursor-grabbing"
          draggable
          onDragStart={(event) => {
            event.dataTransfer.setData('application/reactflow', type);
            event.dataTransfer.effectAllowed = 'move';
          }}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const SidebarPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(0);
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  
  const themes = [
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

  const clearFlow = () => {
    if (window.confirm('Are you sure you want to clear the flow?')) {
      setNodes([]);
      setEdges([]);
      toast.success('Flow cleared successfully');
    }
  };

  const changeTheme = () => {
    setCurrentTheme((prev) => (prev + 1) % themes.length);
    toast.success('Theme changed!');
  };

  return (
    <TooltipProvider>
      <div 
        className="flex flex-col items-center p-3 rounded-xl backdrop-blur-lg z-10 border border-white/20 shadow-lg"
        style={{ background: `${themes[currentTheme]}` }}
      >
        <Button 
          variant="glass-icon"
          size="icon"
          className="mb-3"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {isExpanded && (
          <>
            <div className="mb-3">
              <h6 className="text-xs text-white/80 font-semibold mb-2 text-center">Documents</h6>
              <NodeButton type="chapter" icon={BookOpen} label="Chapter" />
              <NodeButton type="main-topic" icon={ListTodo} label="Main Topic" />
              <NodeButton type="sub-topic" icon={FileText} label="Sub Topic" />
            </div>

            <div className="mb-3">
              <h6 className="text-xs text-white/80 font-semibold mb-2 text-center">Shapes</h6>
              <NodeButton type="square" icon={MenuSquare} label="Square" />
              <NodeButton type="circle" icon={CircleIcon} label="Circle" />
              <NodeButton type="triangle" icon={Triangle} label="Triangle" />
            </div>

            <div className="mb-3">
              <h6 className="text-xs text-white/80 font-semibold mb-2 text-center">Specials</h6>
              <NodeButton type="sticky-note" icon={StickyNote} label="Sticky Note" />
              <NodeButton type="arrow" icon={ArrowRight} label="Arrow" />
            </div>

            <div className="mb-3">
              <h6 className="text-xs text-white/80 font-semibold mb-2 text-center">Content</h6>
              <NodeButton type="text" icon={Text} label="Text Block" />
              <NodeButton type="image" icon={Image} label="Image" />
              <NodeButton type="table" icon={Table} label="Table" />
            </div>
          </>
        )}

        <div className="pt-2 border-t border-white/20">
          <h6 className="text-xs text-white/80 font-semibold mb-2 text-center">Actions</h6>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={saveFlow} variant="glass-icon" size="icon" className="mb-2">
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Save Flow</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={downloadFlow} variant="glass-icon" size="icon" className="mb-2">
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Download JSON</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="glass-icon" size="icon" className="mb-2 relative">
                <Upload className="h-4 w-4" />
                <input
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
              <Button onClick={changeTheme} variant="glass-icon" size="icon" className="mb-2">
                <Palette className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Change Theme</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={clearFlow} variant="glass-icon" size="icon" className="mb-2">
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Clear Canvas</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
