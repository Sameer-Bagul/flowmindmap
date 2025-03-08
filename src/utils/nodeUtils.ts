
import type { TextNodeData } from '../types/node';

export const getDefaultColors = (type: TextNodeData['type']) => {
  switch (type) {
    case 'chapter':
      return {
        bg: 'rgba(254, 243, 199, 0.95)',
        border: '#f59e0b',
        badge: 'warning'
      };
    case 'main-topic':
      return {
        bg: 'rgba(219, 234, 254, 0.95)',
        border: '#3b82f6',
        badge: 'secondary'
      };
    case 'sub-topic':
      return {
        bg: 'rgba(220, 252, 231, 0.95)',
        border: '#22c55e',
        badge: 'default'
      };
    case 'sticky-note':
      return {
        bg: 'rgba(254, 252, 191, 0.95)',
        border: '#eab308',
        badge: 'warning'
      };
    case 'arrow':
      return {
        bg: 'transparent',
        border: '#3b82f6',
        badge: 'secondary'
      };
    case 'square':
    case 'circle':
    case 'triangle':
      return {
        bg: 'rgba(255, 255, 255, 0.95)',
        border: '#9b87f5',
        badge: 'secondary'
      };
    default:
      return {
        bg: 'rgba(255, 255, 255, 0.95)',
        border: '#9b87f5',
        badge: 'default'
      };
  }
};
