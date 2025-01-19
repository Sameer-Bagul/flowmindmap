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

export interface TextNodeData {
  label: string;
  content?: string;
  type: NoteType;
  backgroundColor?: string;
  borderColor?: string;
  media?: MediaItem[];
  handles?: HandleData[];
}