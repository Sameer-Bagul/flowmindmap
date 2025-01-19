import TextNode from './TextNode';
import type { NodeTypes } from '@xyflow/react';

const nodeTypes: NodeTypes = {
  'chapter': TextNode,
  'main-topic': TextNode,
  'sub-topic': TextNode,
};

export default nodeTypes;