
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
 * Calculates positions for a tree-like mindmap structure
 * With the main node at the top, subtopics in the second row,
 * and detail nodes arranged in a hierarchical tree below them
 */
export function calculateHierarchicalTreeLayout(nodes: Node[]): Node[] {
  // Reset all node positions
  const processedNodes = [...nodes];
  
  // Constants for layout
  const centerX = 500;
  const startY = 100;
  const levelSpacing = 200;
  const horizontalSpacing = 250;
  
  // Group nodes by type
  const mainNodes = processedNodes.filter(node => node.type === 'chapter');
  const subtopicNodes = processedNodes.filter(node => node.type === 'main-topic');
  const detailNodes = processedNodes.filter(node => node.type === 'sub-topic');
  
  // Create a map to track which subtopic each detail node belongs to
  const detailNodeConnections: Record<string, string> = {};
  
  // Find connections between nodes based on edges
  const nodesWithEdges = processedNodes.filter(node => 'edges' in node && Array.isArray(node.edges));
  const edges: Edge[] = nodesWithEdges.flatMap(node => (node as any).edges || []);
  
  // Map detail nodes to their parent subtopics
  edges.forEach(edge => {
    const sourceNode = processedNodes.find(node => node.id === edge.source);
    const targetNode = processedNodes.find(node => node.id === edge.target);
    
    if (sourceNode && targetNode) {
      if (sourceNode.type === 'main-topic' && targetNode.type === 'sub-topic') {
        detailNodeConnections[targetNode.id] = sourceNode.id;
      }
    }
  });
  
  // Position main nodes at the top center
  mainNodes.forEach((node, i) => {
    node.position = { 
      x: centerX - (mainNodes.length - 1) * horizontalSpacing / 2 + i * horizontalSpacing, 
      y: startY 
    };
  });
  
  // Position subtopic nodes in the second row, evenly spaced
  const subtopicWidth = subtopicNodes.length * horizontalSpacing;
  const subtopicStartX = centerX - subtopicWidth / 2 + horizontalSpacing / 2;
  
  subtopicNodes.forEach((node, i) => {
    node.position = { 
      x: subtopicStartX + i * horizontalSpacing, 
      y: startY + levelSpacing 
    };
  });
  
  // Group detail nodes by their parent subtopic
  const detailNodesBySubtopic: Record<string, Node[]> = {};
  
  detailNodes.forEach(node => {
    const parentId = detailNodeConnections[node.id] || 'unconnected';
    if (!detailNodesBySubtopic[parentId]) {
      detailNodesBySubtopic[parentId] = [];
    }
    detailNodesBySubtopic[parentId].push(node);
  });
  
  // Position detail nodes below their parent subtopics
  Object.entries(detailNodesBySubtopic).forEach(([parentId, nodes]) => {
    if (parentId === 'unconnected') {
      // Handle unconnected detail nodes - place them at the bottom
      const detailNodesPerRow = 4;
      const startX = centerX - ((nodes.length - 1) / 2) * horizontalSpacing;
      
      nodes.forEach((node, i) => {
        const row = Math.floor(i / detailNodesPerRow);
        const col = i % detailNodesPerRow;
        node.position = { 
          x: startX + col * horizontalSpacing, 
          y: startY + levelSpacing * 3 + row * levelSpacing 
        };
      });
    } else {
      // Find the parent subtopic's position
      const parentNode = subtopicNodes.find(node => node.id === parentId);
      if (parentNode) {
        const parentX = parentNode.position.x;
        const parentY = parentNode.position.y;
        
        // Arrange detail nodes in a tree below their parent
        const detailsPerRow = 2;
        nodes.forEach((node, i) => {
          const row = Math.floor(i / detailsPerRow);
          const col = i % detailsPerRow;
          const xOffset = col === 0 ? -horizontalSpacing/2 : horizontalSpacing/2;
          
          node.position = { 
            x: parentX + xOffset, 
            y: parentY + levelSpacing + row * levelSpacing/1.5 
          };
        });
      }
    }
  });
  
  return [...mainNodes, ...subtopicNodes, ...detailNodes];
}

export function calculatePositionsForMindmap(nodes: Node[]): Node[] {
  // First try to use the hierarchical tree layout for a better mindmap structure
  if (Array.isArray(nodes) && nodes.length > 0) {
    return calculateHierarchicalTreeLayout(nodes);
  }
  
  // Fallback to the original implementation
  // Set the main node (chapter) at the center
  const centerX = 500;
  const centerY = 300;
  
  // Find the chapter node (main node)
  const mainNodes = nodes.filter(node => node.type === 'chapter');
  const subtopicNodes = nodes.filter(node => node.type === 'main-topic');
  const detailNodes = nodes.filter(node => node.type === 'sub-topic');
  
  // Position the main nodes at the center
  mainNodes.forEach((node, i) => {
    node.position = { x: centerX + (i * 300), y: centerY };
  });
  
  // Position subtopic nodes in a circle around the main node
  const subtopicPositions = calculateRadialLayout(
    subtopicNodes.length, 
    centerX, 
    centerY, 
    300 // radius
  );
  
  subtopicNodes.forEach((node, i) => {
    node.position = subtopicPositions[i];
  });
  
  // Position detail nodes in a tree layout
  const detailPositions = calculateTreeLayout(
    detailNodes.length,
    centerX - 600,
    centerY + 300,
    300,
    150,
    5
  );
  
  detailNodes.forEach((node, i) => {
    node.position = detailPositions[i];
  });
  
  return [...mainNodes, ...subtopicNodes, ...detailNodes];
}
