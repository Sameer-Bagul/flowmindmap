
/**
 * This utility provides functions for automatically laying out nodes in a mindmap
 */

import { Node, Edge } from '@xyflow/react';

export function calculateRadialLayout(count: number, centerX: number, centerY: number, radius: number) {
  const positions = [];
  
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    positions.push({ x, y });
  }
  
  return positions;
}

export function calculateTreeLayout(
  count: number, 
  startX: number = 0, 
  startY: number = 0, 
  horizontalSpacing: number = 300,
  verticalSpacing: number = 150,
  maxNodesPerRow: number = 3
) {
  const positions = [];
  
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / maxNodesPerRow);
    const col = i % maxNodesPerRow;
    
    // Stagger positions for a more natural layout
    const xOffset = row % 2 === 0 ? 0 : horizontalSpacing / 2;
    
    const x = startX + (col * horizontalSpacing) + xOffset;
    const y = startY + (row * verticalSpacing);
    
    positions.push({ x, y });
  }
  
  return positions;
}

/**
 * Calculates positions for a hierarchical mindmap
 */
export function calculateHierarchicalTreeLayout(nodes: Node[]): Node[] {
  // Make a deep copy to avoid modifying the original nodes
  const processedNodes = nodes.map(node => ({
    ...node,
    position: node.position || { x: 0, y: 0 }
  }));
  
  // Constants for layout
  const centerX = 500;
  const startY = 100;
  const levelSpacing = 200;
  const horizontalSpacing = 250;
  
  // Group nodes by type
  const mainNodes = processedNodes.filter(node => node.type === 'chapter');
  const subtopicNodes = processedNodes.filter(node => node.type === 'main-topic');
  const detailNodes = processedNodes.filter(node => node.type === 'sub-topic');
  
  // Create a map for node connections
  const detailNodeConnections: Record<string, string> = {};
  
  // Position main nodes at the top center
  mainNodes.forEach((node, i) => {
    node.position = { 
      x: centerX - (mainNodes.length - 1) * horizontalSpacing / 2 + i * horizontalSpacing, 
      y: startY 
    };
  });
  
  // Position subtopic nodes in the second row, evenly spaced
  const subtopicWidth = Math.max(1, subtopicNodes.length) * horizontalSpacing;
  const subtopicStartX = centerX - subtopicWidth / 2 + horizontalSpacing / 2;
  
  subtopicNodes.forEach((node, i) => {
    node.position = { 
      x: subtopicStartX + i * horizontalSpacing, 
      y: startY + levelSpacing 
    };
  });
  
  // Position detail nodes below in a grid
  const detailsPerRow = 4;
  const detailStartX = centerX - ((Math.min(detailsPerRow, detailNodes.length) - 1) / 2) * horizontalSpacing;
  
  detailNodes.forEach((node, i) => {
    const row = Math.floor(i / detailsPerRow);
    const col = i % detailsPerRow;
    node.position = { 
      x: detailStartX + col * horizontalSpacing, 
      y: startY + levelSpacing * 2 + row * levelSpacing 
    };
  });
  
  return [...mainNodes, ...subtopicNodes, ...detailNodes];
}

export function calculatePositionsForMindmap(nodes: Node[]): Node[] {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return [];
  }
  
  try {
    // Try the hierarchical layout first
    return calculateHierarchicalTreeLayout(nodes);
  } catch (error) {
    console.error("Error in hierarchical layout, falling back to basic layout:", error);
    
    // Fallback to simple layout
    const centerX = 500;
    const centerY = 300;
    
    return nodes.map((node, index) => ({
      ...node,
      position: { x: centerX + (index * 200), y: centerY + (index % 3) * 100 }
    }));
  }
}
