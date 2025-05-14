
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
  setInitialElements: () => void;
  undo: () => void;
  redo: () => void;
}

// Helper function to create deep copies of nodes and edges to prevent reference issues
const deepCopy = <T extends any>(items: T[]): T[] => {
  return JSON.parse(JSON.stringify(items));
};

// Storage key for persisting flow state
const FLOW_STORAGE_KEY = 'flow_state';

// Load saved state from localStorage
const loadSavedState = (): { nodes: Node[], edges: Edge[] } | null => {
  try {
    const savedState = localStorage.getItem(FLOW_STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading flow state from localStorage:', error);
  }
  return null;
};

// Save state to localStorage
const saveState = (nodes: Node[], edges: Edge[]) => {
  try {
    localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify({ nodes, edges }));
  } catch (error) {
    console.error('Error saving flow state to localStorage:', error);
  }
};

export const useFlowStore = create<FlowState>((set, get) => ({
  history: [],
  currentIndex: -1,
  nodes: [],
  edges: [],
  
  setInitialElements: () => {
    // Try to load saved state, otherwise use empty arrays
    const savedState = loadSavedState();
    const initialNodes = savedState?.nodes || [];
    const initialEdges = savedState?.edges || [];
    
    set({ 
      nodes: initialNodes,
      edges: initialEdges,
      history: initialNodes.length > 0 || initialEdges.length > 0 ? [{ nodes: initialNodes, edges: initialEdges }] : [],
      currentIndex: initialNodes.length > 0 || initialEdges.length > 0 ? 0 : -1
    });
  },
  
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
        
        // Save to localStorage
        saveState(newNodes, newEdges);
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
          
          // Save to localStorage
          saveState(state.nodes, state.edges);
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
          
          // Save to localStorage
          saveState(state.nodes, state.edges);
        }
      })
    );
  },
}));
