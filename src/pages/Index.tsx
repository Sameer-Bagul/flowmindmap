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

const initialNodes = [];
const initialEdges = [];

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: {
    strokeWidth: 2,
    stroke: 'hsl(var(--primary))',
  },
};

const nodeConstraints = {
  minWidth: 350,
  maxWidth: 800,
  minHeight: 250,
  maxHeight: 600,
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
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 }
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
        id: `${type}-${nodes.length + 1}`,
        type,
        position,
        data: { 
          label: `New ${type.replace('-', ' ')}`,
          type,
        },
        style: {
          width: nodeConstraints.minWidth,
          height: nodeConstraints.minHeight,
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
          <Link to="/shortcuts">
            <Button variant="outline" className="w-full">
              View Shortcuts
            </Button>
          </Link>
        </Panel>
        <Panel position="top-right" className="flex gap-2">
          <ThemeToggle />
        </Panel>
        <Controls className="bg-background/80 border-border shadow-sm" />
        <MiniMap className="bg-background/80 border-border shadow-sm" />
        <Background color="#666" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Index;