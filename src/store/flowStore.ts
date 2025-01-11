import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface FlowState {
  history: { nodes: Node[]; edges: Edge[] }[];
  currentIndex: number;
  nodes: Node[];
  edges: Edge[];
  setElements: (nodes: Node[], edges: Edge[]) => void;
  undo: () => void;
  redo: () => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  history: [],
  currentIndex: -1,
  nodes: [],
  edges: [],
  setElements: (nodes, edges) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.currentIndex + 1);
      newHistory.push({ nodes: [...nodes], edges: [...edges] });
      return {
        nodes,
        edges,
        history: newHistory,
        currentIndex: newHistory.length - 1,
      };
    });
  },
  undo: () => {
    set((state) => {
      if (state.currentIndex > 0) {
        const newIndex = state.currentIndex - 1;
        const { nodes, edges } = state.history[newIndex];
        return {
          currentIndex: newIndex,
          nodes: [...nodes],
          edges: [...edges],
        };
      }
      return state;
    });
  },
  redo: () => {
    set((state) => {
      if (state.currentIndex < state.history.length - 1) {
        const newIndex = state.currentIndex + 1;
        const { nodes, edges } = state.history[newIndex];
        return {
          currentIndex: newIndex,
          nodes: [...nodes],
          edges: [...edges],
        };
      }
      return state;
    });
  },
}));