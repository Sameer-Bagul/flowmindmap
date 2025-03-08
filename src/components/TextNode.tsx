
import { useState, useCallback, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { NodeHeader } from './nodes/NodeHeader';
import { NodeHandles } from './nodes/NodeHandles';
import { NodeTitleEditor } from './nodes/NodeTitleEditor';
import { NodeActions } from './nodes/NodeActions';
import { NodeViewContent } from './nodes/NodeViewContent';
import { NodeContentEditor } from './nodes/NodeContentEditor';
import { getDefaultColors } from '@/utils/nodeUtils';
import type { TextNodeData, MediaItem, Tag } from '../types/node';

const TextNode = ({ id, data, isConnectable }: { id: string, data: TextNodeData; isConnectable?: boolean }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const { deleteElements, setNodes } = useReactFlow();
  const nodeRef = useRef<HTMLDivElement>(null);
  const defaultColors = getDefaultColors(data.type);

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
    setLabel(newLabel);
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

  const toggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  const expandContentWithAI = useCallback(() => {
    const currentContent = data.content || '';
    
    // This is a placeholder for AI content generation
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
  }, [data.content, id, setNodes]);

  return (
    <Card 
      ref={nodeRef}
      className={cn(
        isEditMode ? "min-w-[450px] min-h-[350px]" : "min-w-[250px]",
        "p-6",
        "bg-white/95 dark:bg-white/95",
        "backdrop-blur-xl border-2",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
        "hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.47)]",
        "transition-all duration-200",
        "relative"
      )}
      style={{
        backgroundColor: data.backgroundColor || defaultColors.bg,
        borderColor: data.borderColor || defaultColors.border,
      }}
    >
      <div className="h-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <NodeHeader
            type={data.type}
            backgroundColor={data.backgroundColor || defaultColors.bg}
            borderColor={data.borderColor || defaultColors.border}
            defaultColors={defaultColors}
            onUpdateColor={updateNodeColor}
            onDelete={handleDelete}
          />

          <NodeActions 
            isEditMode={isEditMode} 
            onToggleEditMode={toggleEditMode} 
            onExpandContent={expandContentWithAI} 
          />
        </div>

        <NodeTitleEditor 
          label={label} 
          onLabelChange={handleLabelChange} 
        />

        {/* Display tags in non-edit mode */}
        {!isEditMode && Array.isArray(data.tags) && data.tags.length > 0 && (
          <TagDisplay 
            tags={data.tags} 
            isEditMode={false} 
          />
        )}

        {isEditMode ? (
          <NodeContentEditor 
            content={data.content || ''}
            media={Array.isArray(data.media) ? data.media : []}
            tags={Array.isArray(data.tags) ? data.tags : []}
            onContentChange={handleContentChange}
            onAddMedia={handleAddMedia}
            onRemoveMedia={handleRemoveMedia}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
        ) : (
          <NodeViewContent 
            content={data.content}
            media={data.media}
            tags={data.tags}
          />
        )}
      </div>

      <NodeHandles id={id} isConnectable={isConnectable} />
    </Card>
  );
};

export default TextNode;
