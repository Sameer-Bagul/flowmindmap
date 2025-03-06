
import { useState, useCallback, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { NoteEditor } from './NoteEditor';
import { MediaSection } from './nodes/MediaSection';
import { TagInput } from './TagInput';
import { NodeHeader } from './nodes/NodeHeader';
import { NodeHandles } from './nodes/NodeHandles';
import { Button } from './ui/button';
import { Edit, Sparkles } from 'lucide-react';
import type { TextNodeData, MediaItem, Tag } from '../types/node';

const getDefaultColors = (type: TextNodeData['type']) => {
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
  }
};

const TextNode = ({ id, data, isConnectable }: { id: string, data: TextNodeData; isConnectable?: boolean }) => {
  const [isLabelEditing, setIsLabelEditing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const { deleteElements, setNodes } = useReactFlow();
  const nodeRef = useRef<HTMLDivElement>(null);
  const defaultColors = getDefaultColors(data.type);

  const handleDoubleClick = useCallback(() => {
    setIsLabelEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (label.trim()) {
      setIsLabelEditing(false);
      setNodes(nodes => 
        nodes.map(node => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                label
              }
            };
          }
          return node;
        })
      );
    }
  }, [id, label, setNodes]);

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent) => {
      if (evt.key === 'Enter') {
        evt.preventDefault();
        handleBlur();
      }
    },
    [handleBlur]
  );

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
    // In a real implementation, this would call an API to generate content
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

          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={toggleEditMode}
              title={isEditMode ? "Collapse node" : "Expand and edit node"}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={expandContentWithAI}
              title="Expand content with AI"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLabelEditing ? (
          <Input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="text-xl font-medium bg-white/50 backdrop-blur-sm text-gray-800"
            placeholder="Enter note title..."
          />
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            className="text-xl font-medium cursor-text select-none min-h-[40px] flex items-center text-gray-800"
          >
            {label || 'Double click to edit'}
          </div>
        )}

        {isEditMode && (
          <>
            <TagInput
              tags={Array.isArray(data.tags) ? data.tags : []}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />

            <MediaSection 
              media={Array.isArray(data.media) ? data.media : []}
              onAddMedia={handleAddMedia}
              onRemoveMedia={handleRemoveMedia}
            />
          </>
        )}

        {isEditMode ? (
          <NoteEditor 
            content={data.content || ''} 
            onChange={handleContentChange}
            autoFocus
          />
        ) : (
          <div className="prose prose-sm max-h-[300px] overflow-y-auto">
            {data.content ? (
              <div dangerouslySetInnerHTML={{ __html: data.content }} />
            ) : (
              <p className="text-gray-400 italic">No content. Click Edit to add content.</p>
            )}
          </div>
        )}
      </div>

      <NodeHandles id={id} isConnectable={isConnectable} />
    </Card>
  );
};

export default TextNode;
