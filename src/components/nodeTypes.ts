import ChapterNode from './nodes/ChapterNode';
import MainTopicNode from './nodes/MainTopicNode';
import SubTopicNode from './nodes/SubTopicNode';
import CodeNode from './nodes/CodeNode';
import type { NodeTypes } from '@xyflow/react';

const nodeTypes: NodeTypes = {
  'chapter': ChapterNode,
  'main-topic': MainTopicNode,
  'sub-topic': SubTopicNode,
  'code': CodeNode,
};

export default nodeTypes;