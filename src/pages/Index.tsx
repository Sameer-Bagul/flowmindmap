import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  Panel,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { BookOpen, ListTodo, FileText, Save, Upload, Download, Sun, Moon, Trash2 } from "lucide-react";
import nodeTypes from '../components/nodeTypes';
import type { NoteType } from '../components/TextNode';
import { toast } from "sonner";
import { useTheme } from 'next-themes';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'textNode',
    data: { 
      label: 'My First Chapter',
      type: 'chapter' as NoteType,
    },
    position: { x: 250, y: 100 },
  },
];

const initialEdges: Edge[] = [];

const defaultEdgeOptions = {
  animated: false,
  style: {
    strokeWidth: 2,
    stroke: 'hsl(var(--primary))',
  },
};

const Index = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { theme, setTheme } = useTheme();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'default' }, eds)),
    [setEdges],
  );

  const addNewNode = useCallback((type: NoteType) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'textNode',
      data: { 
        label: `New ${type.replace('-', ' ')}`,
        type 
      },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    };
    setNodes((nds) => [...nds, newNode]);
    toast.success(`Added new ${type.replace('-', ' ')}`);
  }, [nodes.length, setNodes]);

  const saveFlow = useCallback(() => {
    const flow = { nodes, edges };
    localStorage.setItem('flow', JSON.stringify(flow));
    toast.success('Flow saved successfully!');
  }, [nodes, edges]);

  const downloadFlow = useCallback(() => {
    const flow = { nodes, edges };
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
  }, [nodes, edges]);

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

  const onEdgeDelete = useCallback((edge: Edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    toast.success('Edge deleted');
  }, [setEdges]);

  return (
    <div className="w-screen h-screen bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        onEdgeClick={(_, edge) => onEdgeDelete(edge)}
        fitView
        className="bg-muted/10 transition-colors duration-200"
      >
        <Panel position="top-left" className="flex flex-col gap-2 bg-background/60 p-2 rounded-lg backdrop-blur-sm border shadow-sm">
          <Button onClick={() => addNewNode('chapter')} variant="secondary" className="gap-2 justify-start">
            <BookOpen className="h-4 w-4" />
            Add Chapter
          </Button>
          <Button onClick={() => addNewNode('main-topic')} variant="secondary" className="gap-2 justify-start">
            <ListTodo className="h-4 w-4" />
            Add Main Topic
          </Button>
          <Button onClick={() => addNewNode('sub-topic')} variant="secondary" className="gap-2 justify-start">
            <FileText className="h-4 w-4" />
            Add Sub Topic
          </Button>
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
        </Panel>
        <Panel position="top-right" className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-background/60 backdrop-blur-sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </Panel>
        <Controls className="bg-background/60 border shadow-sm" />
        <MiniMap className="bg-background/60 border shadow-sm" />
        <Background color="#ccc" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Index;