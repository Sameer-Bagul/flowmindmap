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
  Edge,
  Connection,
  Panel,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { BookOpen, ListTodo, FileText } from "lucide-react";
import nodeTypes from '../components/nodeTypes';
import type { NoteType } from '../components/TextNode';
import { toast } from "sonner";
import { EdgeControls } from '@/components/EdgeControls';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FlowControls } from '@/components/FlowControls';
import { useFlowStore } from '@/store/flowStore';
import { Link } from 'react-router-dom';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const defaultEdgeOptions = {
  animated: false,
  style: {
    strokeWidth: 2,
    stroke: 'hsl(var(--primary))',
  },
};

const nodeDefaults = {
  chapter: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  'main-topic': {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  'sub-topic': {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
};

const Index = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setElements, undo, redo } = useFlowStore();

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge({
          ...params,
          type: 'smoothstep',
          animated: true,
          style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 }
        }, eds);
        setElements(nodes, newEdges);
        return newEdges;
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

      const type = event.dataTransfer.getData('application/reactflow') as NoteType;
      if (!type) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${nodes.length + 1}`,
        type: 'textNode',
        position,
        data: { 
          label: `New ${type.replace('-', ' ')}`,
          type,
          ...nodeDefaults[type]
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

  // Autosave every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('flow', JSON.stringify({ nodes, edges }));
      toast.success('Flow auto-saved');
    }, 30000);

    return () => clearInterval(interval);
  }, [nodes, edges]);

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
        onEdgeClick={(_, edge) => {
          setEdges((eds) => {
            const newEdges = eds.filter((e) => e.id !== edge.id);
            setElements(nodes, newEdges);
            return newEdges;
          });
          toast.success('Edge deleted');
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        className="bg-muted/10 transition-colors duration-200"
        minZoom={0.2}
        maxZoom={4}
      >
        <Panel position="top-left" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 bg-background/60 p-2 rounded-lg backdrop-blur-sm border shadow-sm">
            {[
              { type: 'chapter', icon: BookOpen, label: 'Chapter' },
              { type: 'main-topic', icon: ListTodo, label: 'Main Topic' },
              { type: 'sub-topic', icon: FileText, label: 'Sub Topic' },
            ].map(({ type, icon: Icon, label }) => (
              <Button
                key={type}
                variant="secondary"
                className="gap-2 justify-start cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow', type);
                  event.dataTransfer.effectAllowed = 'move';
                }}
              >
                <Icon className="h-4 w-4" />
                Drag {label}
              </Button>
            ))}
          </div>
          <FlowControls />
          <EdgeControls />
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
          nodeColor={(node) => {
            const type = (node.data?.type || 'default') as NoteType;
            return nodeDefaults[type]?.backgroundColor || '#fff';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background color="#ccc" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Index;