import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface FlowState {
  history: Array<{ nodes: Node[]; edges: Edge[] }>;
  currentIndex: number;
  nodes: Node[];
  edges: Edge[];
  canUndo: boolean;
  canRedo: boolean;
  setElements: (nodes: Node[], edges: Edge[]) => void;
  undo: () => { nodes: Node[]; edges: Edge[] };
  redo: () => { nodes: Node[]; edges: Edge[] };
}

// Helper function to create clean copies of nodes and edges
// to avoid circular references
const createCleanCopy = <T extends Node[] | Edge[]>(items: T): T => {
  if (!Array.isArray(items)) return [] as unknown as T;
  
  return items.map(item => {
    if ('data' in item) {
      // It's a node
      return {
        ...item,
        data: { ...item.data }
      };
    }
    // It's an edge
    return { ...item };
  }) as T;
};

export const useFlowStore = create<FlowState>((set, get) => ({
  history: [],
  currentIndex: -1,
  nodes: [],
  edges: [],
  canUndo: false,
  canRedo: false,
  
  setElements: (nodes, edges) => {
    set((state) => {
      // Create clean copies without circular references
      const cleanNodes = createCleanCopy(nodes);
      const cleanEdges = createCleanCopy(edges);
      
      // Only keep history up to current index (discard any redoable states)
      const newHistory = state.history.slice(0, state.currentIndex + 1);
      newHistory.push({ nodes: cleanNodes, edges: cleanEdges });
      
      return {
        nodes: cleanNodes,
        edges: cleanEdges,
        history: newHistory,
        currentIndex: newHistory.length - 1,
        canUndo: newHistory.length > 1,
        canRedo: false,
      };
    });
  },
  
  undo: () => {
    const state = get();
    if (state.currentIndex > 0) {
      const newIndex = state.currentIndex - 1;
      const { nodes, edges } = state.history[newIndex];
      const cleanNodes = createCleanCopy(nodes);
      const cleanEdges = createCleanCopy(edges);
      
      set({
        currentIndex: newIndex,
        nodes: cleanNodes,
        edges: cleanEdges,
        canUndo: newIndex > 0,
        canRedo: true,
      });
      return { nodes: cleanNodes, edges: cleanEdges };
    }
    return { nodes: state.nodes, edges: state.edges };
  },
  
  redo: () => {
    const state = get();
    if (state.currentIndex < state.history.length - 1) {
      const newIndex = state.currentIndex + 1;
      const { nodes, edges } = state.history[newIndex];
      const cleanNodes = createCleanCopy(nodes);
      const cleanEdges = createCleanCopy(edges);
      
      set({
        currentIndex: newIndex,
        nodes: cleanNodes,
        edges: cleanEdges,
        canUndo: true,
        canRedo: newIndex < state.history.length - 1,
      });
      return { nodes: cleanNodes, edges: cleanEdges };
    }
    return { nodes: state.nodes, edges: state.edges };
  },
}));
