import TextNode from './TextNode';
import CodeNode from './CodeNode';
import type { NodeTypes } from '@xyflow/react';

const nodeTypes: NodeTypes = {
  'chapter': TextNode,
  'main-topic': TextNode,
  'sub-topic': TextNode,
  'code': CodeNode,
};

export default nodeTypes;