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
import { ColorPicker } from '@/components/ColorPicker';
import nodeTypes from '../components/nodeTypes';
import { toast } from "sonner";
import { ThemeToggle } from '@/components/ThemeToggle';
import { FlowControls } from '@/components/FlowControls';
import { useFlowStore } from '@/store/flowStore';
import { useSettingsStore } from '@/store/settingsStore';
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

const Index = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setElements } = useFlowStore();
  const { backgroundColor, setBackgroundColor } = useSettingsStore();

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

  const getNodeColor = (node) => {
    switch (node.type) {
      case 'chapter':
        return 'rgba(254, 243, 199, 0.7)';
      case 'main-topic':
        return 'rgba(219, 234, 254, 0.7)';
      case 'sub-topic':
        return 'rgba(220, 252, 231, 0.7)';
      default:
        return '#fff';
    }
  };

  return (
    <div className="w-screen h-screen" style={{ backgroundColor }}>
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
        className="bg-zinc-900/50 transition-colors duration-200"
        minZoom={0.2}
        maxZoom={4}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <Panel position="top-left" className="flex flex-col gap-4">
          <FlowToolbar />
          <FlowControls />
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-md">
            <span className="text-sm text-white">Background:</span>
            <ColorPicker value={backgroundColor} onChange={setBackgroundColor} />
          </div>
          <Link to="/shortcuts">
            <Button variant="outline" className="w-full">
              View Shortcuts
            </Button>
          </Link>
        </Panel>
        <Panel position="top-right" className="flex gap-2">
          <ThemeToggle />
        </Panel>
        <Controls className="bg-zinc-900/80 border-zinc-700 shadow-sm" />
        <MiniMap className="bg-zinc-900/80 border-zinc-700 shadow-sm" />
        <Background color="#666" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Index;
