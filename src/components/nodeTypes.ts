
import TextNode from './TextNode';
import ShapeNode from './ShapeNode';
import StickyNoteNode from './StickyNoteNode';
import ArrowNode from './ArrowNode';
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
  'sticky-note': StickyNoteNode,
  'arrow': ArrowNode,
};

export default nodeTypes;
