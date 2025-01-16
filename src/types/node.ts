import { Position } from '@xyflow/react';

export type NoteType = 'chapter' | 'main-topic' | 'sub-topic';

export type MediaItem = {
  type: 'image' | 'video' | 'youtube' | 'link';
  url: string;
};

export interface HandleData {
  id: string;
  position: Position;
  x: number;
  y: number;
}

export interface BaseNodeData {
  label: string;
  content?: string;
}

export interface TextNodeData extends BaseNodeData {
  type: NoteType;
  backgroundColor?: string;
  borderColor?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'link';
  handles?: HandleData[];
}

export interface CodeNodeData extends BaseNodeData {
  code: string;
  language: string;
  theme: string;
  fontSize?: number;
  wordWrap?: boolean;
  minimap?: boolean;
  lineNumbers?: boolean;
}