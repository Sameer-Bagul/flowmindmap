
import TextNode from './TextNode';
import ShapeNode from './ShapeNode';
import type { NodeTypes } from '@xyflow/react';

const nodeTypes: NodeTypes = {
  'chapter': TextNode,
  'main-topic': TextNode,
  'sub-topic': TextNode,
  'text': ShapeNode,
  'image': ShapeNode,
  'table': ShapeNode,
  'square': ShapeNode,
  'circle': ShapeNode,
  'triangle': ShapeNode,
};

export default nodeTypes;
