
import { useCallback } from 'react';
import { useReactFlow } from "@xyflow/react";
import { Save, Download, Upload, Palette, X } from "lucide-react";
import { toast } from "sonner";
import { ActionButton } from "./ActionButton";
import { NodeSection } from "./NodeSection";

// Theme options defined outside component to prevent recreation on each render
const THEMES = [
  "linear-gradient(to right, #ee9ca7, #ffdde1)",
  "linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)",
  "linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)",
  "linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)",
  "linear-gradient(90deg, hsla(59, 86%, 68%, 1) 0%, hsla(134, 36%, 53%, 1) 100%)",
  "linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)",
];

interface SidebarActionsProps {
  currentTheme: number;
  setCurrentTheme: (value: React.SetStateAction<number>) => void;
}

export const SidebarActions = ({ currentTheme, setCurrentTheme }: SidebarActionsProps) => {
  const reactFlowInstance = useReactFlow();
  
  // Extract methods using destructuring to prevent infinite re-renders
  const { getNodes, getEdges, setNodes, setEdges } = reactFlowInstance;

  const saveFlow = useCallback(() => {
    const flow = { nodes: getNodes(), edges: getEdges() };
    localStorage.setItem('flow', JSON.stringify(flow));
    toast.success('Flow saved successfully!');
  }, [getNodes, getEdges]);

  const downloadFlow = useCallback(() => {
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
  }, [getNodes, getEdges]);

  const uploadFlow = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [setNodes, setEdges]);

  const clearFlow = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the flow?')) {
      setNodes([]);
      setEdges([]);
      toast.success('Flow cleared successfully');
    }
  }, [setNodes, setEdges]);

  const changeTheme = useCallback(() => {
    setCurrentTheme(prev => (prev + 1) % THEMES.length);
    toast.success('Theme changed!');
  }, [setCurrentTheme]);
  
  return (
    <NodeSection title="Actions">
      <ActionButton icon={Save} label="Save Flow" onClick={saveFlow} />
      <ActionButton icon={Download} label="Download JSON" onClick={downloadFlow} />
      <ActionButton 
        icon={Upload} 
        label="Upload JSON" 
        hasInput={true}
        inputProps={{
          type: "file",
          accept: ".json",
          onChange: uploadFlow
        }}
      />
      <ActionButton icon={Palette} label="Change Theme" onClick={changeTheme} />
      <ActionButton icon={X} label="Clear Canvas" onClick={clearFlow} />
    </NodeSection>
  );
};
