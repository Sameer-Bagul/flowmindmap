
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import type { TextNodeData, MediaItem, Tag } from '../types/node';

export function useNodeData(id: string) {
  const { deleteElements, setNodes } = useReactFlow();

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
    toast.success('Node deleted');
  }, [deleteElements, id]);

  const updateNodeColor = useCallback((key: 'backgroundColor' | 'borderColor', color: string) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              [key]: color
            }
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  const handleContentChange = useCallback((content: string) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              content
            }
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  const handleLabelChange = useCallback((newLabel: string) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newLabel
            }
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  const handleAddTag = useCallback((tag: Tag) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
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
  }, [id, setNodes]);

  const handleRemoveTag = useCallback((tagId: string) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
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
  }, [id, setNodes]);

  const handleAddMedia = useCallback((mediaItem: MediaItem) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
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
  }, [id, setNodes]);

  const handleRemoveMedia = useCallback((index: number) => {
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
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
  }, [id, setNodes]);

  const expandContentWithAI = useCallback(() => {
    const currentContent = '';
    
    toast.promise(
      // Simulate API call with a delay
      new Promise((resolve) => {
        setTimeout(() => {
          const expandedContent = `${currentContent}\n\n## AI Generated Content\nHere is some expanded content based on your notes...`;
          
          // Update the node content
          setNodes(nodes => 
            nodes.map(node => {
              if (node.id === id) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    content: expandedContent
                  }
                };
              }
              return node;
            })
          );
          resolve(true);
        }, 1500);
      }),
      {
        loading: 'Generating content...',
        success: 'Content expanded with AI',
        error: 'Failed to generate content'
      }
    );
  }, [id, setNodes]);

  return {
    handleDelete,
    updateNodeColor,
    handleContentChange,
    handleLabelChange,
    handleAddTag,
    handleRemoveTag,
    handleAddMedia,
    handleRemoveMedia,
    expandContentWithAI
  };
}
