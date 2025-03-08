
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { TextNodeData, MediaItem, Tag } from '@/types/node';

export function useNodeUpdater(nodeId: string) {
  const { setNodes } = useReactFlow();

  const updateNodeData = useCallback(<K extends keyof TextNodeData>(
    key: K, 
    value: TextNodeData[K]
  ) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              [key]: value
            }
          };
        }
        return node;
      })
    );
  }, [nodeId, setNodes]);

  const updateNodeColor = useCallback((key: 'backgroundColor' | 'borderColor', color: string) => {
    updateNodeData(key, color);
  }, [updateNodeData]);

  const setNodeContent = useCallback((content: string) => {
    updateNodeData('content', content);
  }, [updateNodeData]);

  const setNodeLabel = useCallback((label: string) => {
    updateNodeData('label', label);
  }, [updateNodeData]);

  const addNodeTag = useCallback((tag: Tag) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === nodeId) {
          const currentTags = Array.isArray(node.data.tags) ? node.data.tags : [];
          return {
            ...node,
            data: {
              ...node.data,
              tags: [...currentTags, tag]
            }
          };
        }
        return node;
      })
    );
  }, [nodeId, setNodes]);

  const removeNodeTag = useCallback((tagId: string) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === nodeId) {
          const currentTags = Array.isArray(node.data.tags) ? node.data.tags : [];
          return {
            ...node,
            data: {
              ...node.data,
              tags: currentTags.filter(t => t.id !== tagId)
            }
          };
        }
        return node;
      })
    );
  }, [nodeId, setNodes]);

  const addNodeMedia = useCallback((mediaItem: MediaItem) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === nodeId) {
          const currentMedia = Array.isArray(node.data.media) ? node.data.media : [];
          return {
            ...node,
            data: {
              ...node.data,
              media: [...currentMedia, mediaItem]
            }
          };
        }
        return node;
      })
    );
  }, [nodeId, setNodes]);

  const removeNodeMedia = useCallback((index: number) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === nodeId) {
          const media = Array.isArray(node.data.media) ? [...node.data.media] : [];
          media.splice(index, 1);
          return {
            ...node,
            data: {
              ...node.data,
              media
            }
          };
        }
        return node;
      })
    );
  }, [nodeId, setNodes]);

  return {
    updateNodeColor,
    setNodeContent,
    setNodeLabel,
    addNodeTag,
    removeNodeTag,
    addNodeMedia,
    removeNodeMedia
  };
}
