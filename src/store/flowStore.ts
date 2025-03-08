
import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface FlowState {
  history: { nodes: Node[]; edges: Edge[] }[];
  currentIndex: number;
  nodes: Node[];
  edges: Edge[];
  canUndo: boolean;
  canRedo: boolean;
  setElements: (nodes: Node[], edges: Edge[]) => void;
  undo: () => { nodes: Node[]; edges: Edge[] };
  redo: () => { nodes: Node[]; edges: Edge[] };
}

export const useFlowStore = create<FlowState>((set, get) => ({
  history: [],
  currentIndex: -1,
  nodes: [],
  edges: [],
  canUndo: false,
  canRedo: false,
  setElements: (nodes, edges) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.currentIndex + 1);
      newHistory.push({ nodes: [...nodes], edges: [...edges] });
      return {
        nodes,
        edges,
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
      set({
        currentIndex: newIndex,
        nodes: [...nodes],
        edges: [...edges],
        canUndo: newIndex > 0,
        canRedo: true,
      });
      return { nodes: [...nodes], edges: [...edges] };
    }
    return { nodes: state.nodes, edges: state.edges };
  },
  redo: () => {
    const state = get();
    if (state.currentIndex < state.history.length - 1) {
      const newIndex = state.currentIndex + 1;
      const { nodes, edges } = state.history[newIndex];
      set({
        currentIndex: newIndex,
        nodes: [...nodes],
        edges: [...edges],
        canUndo: true,
        canRedo: newIndex < state.history.length - 1,
      });
      return { nodes: [...nodes], edges: [...edges] };
    }
    return { nodes: state.nodes, edges: state.edges };
  },
}));
