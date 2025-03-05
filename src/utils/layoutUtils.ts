
/**
 * This utility provides functions for automatically laying out nodes in a mindmap
 */

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

export function calculatePositionsForMindmap(nodes) {
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
