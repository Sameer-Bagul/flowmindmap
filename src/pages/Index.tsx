import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Connection,
  ConnectionMode,
  Panel,
  GetMiniMapNodeAttribute,
  BaseEdge,
  EdgeProps,
  getBezierPath,
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
import { EdgeContextMenu } from '@/components/EdgeContextMenu';
import type { Edge } from '@xyflow/react';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

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
  const { setElements, undo, redo } = useFlowStore();

  // Load saved flow on mount
  useEffect(() => {
    const savedFlow = localStorage.getItem('flow');
    if (savedFlow) {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedFlow);
      setNodes(savedNodes);
      setEdges(savedEdges);
    }
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 }
      };
      setEdges((eds) => {
        const updatedEdges = addEdge(newEdge, eds);
        setElements(nodes, updatedEdges);
        return updatedEdges;
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
        const newNodes = [...nds, newNode];
        setElements(newNodes, edges);
        return newNodes;
      });
      toast.success(`Added new ${type.replace('-', ' ')}`);
    },
    [nodes.length, setNodes, edges, setElements],
  );

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'z':
            event.preventDefault();
            undo();
            break;
          case 'y':
            event.preventDefault();
            redo();
            break;
          case 's':
            event.preventDefault();
            localStorage.setItem('flow', JSON.stringify({ nodes, edges }));
            toast.success('Flow saved');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [nodes, edges, undo, redo]);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('flow', JSON.stringify({ nodes, edges }));
      toast.success('Flow auto-saved');
    }, 30000);

    return () => clearInterval(interval);
  }, [nodes, edges]);

  const getNodeColor: GetMiniMapNodeAttribute<Node> = (node) => {
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
        className="bg-muted/10 transition-colors duration-200"
        minZoom={0.2}
        maxZoom={4}
        onDragOver={onDragOver}
        onDrop={onDrop}
        edgeTypes={{
          default: (props: EdgeProps) => {
            const [edgePath] = getBezierPath({
              sourceX: props.sourceX,
              sourceY: props.sourceY,
              sourcePosition: props.sourcePosition,
              targetX: props.targetX,
              targetY: props.targetY,
              targetPosition: props.targetPosition,
            });

            return (
              <EdgeContextMenu edge={props}>
                <BaseEdge 
                  path={edgePath}
                  {...props}
                  style={{
                    ...props.style,
                    strokeWidth: 2,
                    stroke: props.style?.stroke || 'hsl(var(--primary))',
                  }}
                />
              </EdgeContextMenu>
            );
          },
        }}
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
        <Controls className="bg-background/60 border shadow-sm" />
        <MiniMap 
          className="bg-background/60 border shadow-sm !bottom-5 !right-5"
          nodeColor={getNodeColor}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background color="#ccc" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Index;