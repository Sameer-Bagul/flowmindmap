
import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode,
  Panel,
  Edge,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import nodeTypes from '../components/nodeTypes';
import { toast } from "sonner";
import { ThemeToggle } from '@/components/ThemeToggle';
import { useFlowStore } from '@/store/flowStore';
import { GenerateMindmapModal } from '@/components/GenerateMindmapModal';
import { Settings } from 'lucide-react';
import { SidebarPanel } from '@/components/SidebarPanel';

const initialNodes = [];
const initialEdges = [];

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: {
    strokeWidth: 2,
    stroke: 'hsl(var(--primary))',
    cursor: 'pointer',
  },
};

const FlowContent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setElements } = useFlowStore();

  // Use useMemo for complex objects to prevent recreations
  const reactFlowStyle = useMemo(() => ({
    backgroundColor: 'var(--background)'
  }), []);

  useEffect(() => {
    // Only run when nodes or edges change and they're actual arrays
    if (!Array.isArray(nodes) || !Array.isArray(edges)) return;
    
    const cleanNodes = nodes.map(node => ({
      ...node,
      data: { ...node.data }
    }));
    const cleanEdges = edges.map(edge => ({ ...edge }));
    
    setElements(cleanNodes, cleanEdges);
  }, [nodes, edges, setElements]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2, cursor: 'pointer' }
      };
      setEdges((eds) => {
        if (!Array.isArray(eds)) return [newEdge];
        return addEdge(newEdge, eds);
      });
      toast.success('Nodes connected successfully');
    },
    [setEdges],
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const isDelete = window.confirm('Do you want to remove this connection?');
      if (isDelete) {
        setEdges((eds) => {
          if (!Array.isArray(eds)) return [];
          return eds.filter((e) => e.id !== edge.id);
        });
        toast.success('Connection removed successfully');
      }
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { 
          label: `New ${type.replace('-', ' ')}`,
          type,
        },
      };

      setNodes((nds) => {
        if (!Array.isArray(nds)) return [newNode];
        return [...nds, newNode];
      });
      toast.success(`Added new ${type.replace('-', ' ')}`);
    },
    [setNodes],
  );

  const handleGeneratedMindmap = useCallback((generatedNodes, generatedEdges) => {
    if ((nodes.length > 0 || edges.length > 0) &&
        !window.confirm("This will replace your current mindmap. Continue?")) {
      return;
    }
    
    const cleanNodes = generatedNodes.map(node => ({
      ...node,
      data: { ...node.data }
    }));
    
    setNodes(cleanNodes);
    setEdges(generatedEdges);
    toast.success("AI-generated mindmap created successfully!");
  }, [nodes.length, edges.length, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgeClick={onEdgeClick}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionMode={ConnectionMode.Loose}
      fitView
      className="bg-background transition-colors duration-200"
      style={reactFlowStyle}
      minZoom={0.2}
      maxZoom={4}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Panel position="top-left" className="flex flex-col gap-4">
        <SidebarPanel />
      </Panel>
      <Panel position="top-right" className="flex gap-2">
        <Link to="/settings">
          <Button variant="outline" size="icon" className="rounded-full" title="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
        <ThemeToggle />
      </Panel>
      <Panel position="bottom-center" className="flex gap-2">
        <div className="flex items-center gap-2 backdrop-blur-md border shadow-lg rounded-xl p-2">
          <GenerateMindmapModal onGenerate={handleGeneratedMindmap} />
          <Link to="/roadmaps">
            <Button variant="outline" size="sm">Roadmaps</Button>
          </Link>
        </div>
      </Panel>
      <Controls className="bg-background/80 border-border shadow-sm" />
      <MiniMap className="bg-background/80 border-border shadow-sm" />
      <Background color="#666" gap={16} size={1} />
    </ReactFlow>
  );
};

// Memoized Index component to prevent unnecessary re-renders
const Index = () => {
  return (
    <div className="w-screen h-screen flex bg-background">
      <div className="flex-1">
        <ReactFlowProvider>
          <FlowContent />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Index;
