
import { useCallback } from 'react';
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

const Index = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setElements } = useFlowStore();

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2, cursor: 'pointer' }
      };
      setEdges((eds) => {
        const update = addEdge(newEdge, eds);
        setElements(nodes, update);
        return update;
      });
      toast.success('Nodes connected successfully');
    },
    [setEdges, nodes, setElements],
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const isDelete = window.confirm('Do you want to remove this connection?');
      if (isDelete) {
        setEdges((eds) => {
          const update = eds.filter((e) => e.id !== edge.id);
          setElements(nodes, update);
          return update;
        });
        toast.success('Connection removed successfully');
      }
    },
    [setEdges, nodes, setElements]
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

      // Get the reactflow wrapper bounds
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type,
        position,
        data: { 
          label: `New ${type.replace('-', ' ')}`,
          type,
        },
      };

      setNodes((nds) => {
        const update = [...nds, newNode];
        setElements(update, edges);
        return update;
      });
      toast.success(`Added new ${type.replace('-', ' ')}`);
    },
    [nodes.length, setNodes, edges, setElements],
  );

  const handleGeneratedMindmap = (generatedNodes, generatedEdges) => {
    if (nodes.length > 0 || edges.length > 0) {
      if (!window.confirm("This will replace your current mindmap. Continue?")) {
        return;
      }
    }
    
    setNodes(generatedNodes);
    setEdges(generatedEdges);
    setElements(generatedNodes, generatedEdges);
    toast.success("AI-generated mindmap created successfully!");
  };

  return (
    <div className="w-screen h-screen flex bg-background">
      <div className="flex-1">
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
            <FlowControls />
            <div className="flex flex-col gap-2">
              <GenerateMindmapModal onGenerate={handleGeneratedMindmap} />
              <FlowActions />
              <Link to="/roadmaps">
                <Button variant="outline" className="w-full">
                  All Roadmaps
                </Button>
              </Link>
              <Link to="/shortcuts">
                <Button variant="outline" className="w-full">
                  View Shortcuts
                </Button>
              </Link>
            </div>
          </Panel>
          <Panel position="top-right" className="flex gap-2">
            <ThemeToggle />
          </Panel>
          <Controls className="bg-background/80 border-border shadow-sm" />
          <MiniMap className="bg-background/80 border-border shadow-sm" />
          <Background color="#666" gap={16} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Index;
