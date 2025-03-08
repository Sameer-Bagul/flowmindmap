import { useCallback, useEffect } from 'react';
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
import { FlowControls } from '@/components/FlowControls';
import { useFlowStore } from '@/store/flowStore';
import { FlowToolbar } from '@/components/FlowToolbar';
import { FlowActions } from '@/components/FlowActions';
import { GenerateMindmapModal } from '@/components/GenerateMindmapModal';
import { NodeShapesPanel } from '@/components/NodeShapesPanel';
import { Settings } from 'lucide-react';

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

  useEffect(() => {
    if (Array.isArray(nodes) && Array.isArray(edges)) {
      const cleanNodes = nodes.map(node => ({
        ...node,
        data: { ...node.data }
      }));
      const cleanEdges = edges.map(edge => ({ ...edge }));
      
      setElements(cleanNodes, cleanEdges);
    }
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
        const update = addEdge(newEdge, eds);
        return update;
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
          const update = eds.filter((e) => e.id !== edge.id);
          return update;
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
      minZoom={0.2}
      maxZoom={4}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Panel position="top-left" className="flex flex-col gap-4">
        <FlowToolbar />
        <NodeShapesPanel />
        <FlowControls />
        <FlowActions />
        <div className="flex flex-col gap-2 bg-background/40 p-4 rounded-xl backdrop-blur-md border shadow-lg">
          <h3 className="font-semibold text-foreground/80 mb-2">Utilities</h3>
          <GenerateMindmapModal onGenerate={handleGeneratedMindmap} />
          <Link to="/roadmaps">
            <Button variant="outline" className="w-full h-10 gap-2 justify-start">
              All Roadmaps
            </Button>
          </Link>
          <Link to="/shortcuts">
            <Button variant="outline" className="w-full h-10 gap-2 justify-start">
              View Shortcuts
            </Button>
          </Link>
        </div>
      </Panel>
      <Panel position="top-right" className="flex gap-2">
        <Link to="/settings">
          <Button variant="outline" size="icon" className="rounded-full" title="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
        <ThemeToggle />
      </Panel>
      <Controls className="bg-background/80 border-border shadow-sm" />
      <MiniMap className="bg-background/80 border-border shadow-sm" />
      <Background color="#666" gap={16} size={1} />
    </ReactFlow>
  );
};

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
