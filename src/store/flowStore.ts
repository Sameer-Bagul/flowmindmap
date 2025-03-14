
"use client";

import { create } from 'zustand';
import { Node, Edge } from '@xyflow/react';
import { produce } from 'immer';

interface FlowState {
  history: { nodes: Node[]; edges: Edge[] }[];
  currentIndex: number;
  nodes: Node[];
  edges: Edge[];
  setElements: (nodes: Node[], edges: Edge[]) => void;
  undo: () => void;
  redo: () => void;
}

// Helper function to create deep copies of nodes and edges to prevent reference issues
const deepCopy = <T extends any>(items: T[]): T[] => {
  return JSON.parse(JSON.stringify(items));
};

export const useFlowStore = create<FlowState>((set) => ({
  history: [],
  currentIndex: -1,
  nodes: [],
  edges: [],
  
  setElements: (nodes, edges) => {
    set(
      produce((state: FlowState) => {
        // Create deep copies to prevent reference issues
        const newNodes = deepCopy(nodes);
        const newEdges = deepCopy(edges);
        
        // Only add to history if there's an actual change
        const lastHistoryItem = state.history[state.currentIndex];
        const hasChanged = !lastHistoryItem || 
          JSON.stringify(lastHistoryItem.nodes) !== JSON.stringify(newNodes) || 
          JSON.stringify(lastHistoryItem.edges) !== JSON.stringify(newEdges);
        
        if (hasChanged) {
          // Trim history to current index to discard alternative futures
          state.history = state.history.slice(0, state.currentIndex + 1);
          state.history.push({ nodes: newNodes, edges: newEdges });
          state.currentIndex = state.history.length - 1;
        }
        
        state.nodes = newNodes;
        state.edges = newEdges;
      })
    );
  },
  
  undo: () => {
    set(
      produce((state: FlowState) => {
        if (state.currentIndex > 0) {
          state.currentIndex -= 1;
          const { nodes, edges } = state.history[state.currentIndex];
          state.nodes = deepCopy(nodes);
          state.edges = deepCopy(edges);
        }
      })
    );
  },
  
  redo: () => {
    set(
      produce((state: FlowState) => {
        if (state.currentIndex < state.history.length - 1) {
          state.currentIndex += 1;
          const { nodes, edges } = state.history[state.currentIndex];
          state.nodes = deepCopy(nodes);
          state.edges = deepCopy(edges);
        }
      })
    );
  },
}));
