import { Position } from '@xyflow/react';

export type NoteType = 'chapter' | 'main-topic' | 'sub-topic';

export type MediaType = 'image' | 'video' | 'youtube';

export type MediaItem = {
  type: MediaType;
  url: string;
  title?: string;
};

export type DocumentFormat = 'default' | 'a4' | 'wide';

export type Tag = {
  id: string;
  label: string;
  color?: string;
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
  format?: DocumentFormat;
  fontSize?: number;
  lineHeight?: number;
  lastEdited?: Date;
  tags?: Tag[];
}