
import { useState, useCallback, useRef, useMemo } from 'react';
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
import { Edit, Sparkles, ExpandIcon, MinusSquare, X } from 'lucide-react';
import { NodeDisplay } from './nodes/NodeDisplay';
import type { TextNodeData, MediaItem, Tag } from '../types/node';

const TextNode = ({ id, data, isConnectable }: { id: string, data: TextNodeData; isConnectable?: boolean }) => {
  const [isLabelEditing, setIsLabelEditing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const { deleteElements, setNodes } = useReactFlow();
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const defaultColors = useMemo(() => {
    switch (data.type) {
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
  }, [data.type]);

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
              content,
              lastEdited: new Date()
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
    toast.success('Media removed successfully');
  }, [id, setNodes]);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const expandContentWithAI = useCallback(() => {
    const currentContent = data.content || '';
    
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
        isEditMode || isExpanded ? "min-w-[450px]" : "min-w-[250px]",
        isExpanded ? "min-h-[500px]" : isEditMode ? "min-h-[350px]" : "min-h-[120px]",
        "p-4",
        "bg-white/95 dark:bg-white/95",
        "backdrop-blur-lg border-[3px]",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-200 ease-in-out",
        "relative rounded-lg"
      )}
      style={{
        backgroundColor: data.backgroundColor || defaultColors.bg,
        borderColor: data.borderColor || defaultColors.border,
      }}
    >
      <div className="h-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <NodeHeader
            type={data.type}
            backgroundColor={data.backgroundColor || defaultColors.bg}
            borderColor={data.borderColor || defaultColors.border}
            defaultColors={defaultColors}
            onUpdateColor={updateNodeColor}
            onDelete={handleDelete}
          />

          <div className="flex gap-1 ml-auto">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-black/5"
              onClick={toggleEditMode}
              title={isEditMode ? "View mode" : "Edit mode"}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-black/5"
              onClick={toggleExpand}
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <MinusSquare className="h-3.5 w-3.5" /> : <ExpandIcon className="h-3.5 w-3.5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-black/5"
              onClick={expandContentWithAI}
              title="Generate with AI"
            >
              <Sparkles className="h-3.5 w-3.5" />
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
            className={cn(
              "text-xl font-medium cursor-text select-none flex items-center text-gray-800",
              "border-b border-gray-200 pb-2"
            )}
          >
            {label || 'Double click to edit title'}
          </div>
        )}

        {isEditMode ? (
          <>
            <div className="space-y-4">
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
              
              <NoteEditor 
                content={data.content || ''} 
                onChange={handleContentChange}
                autoFocus
              />
            </div>
          </>
        ) : (
          <NodeDisplay 
            label={label}
            content={data.content}
            media={data.media}
            tags={data.tags}
            isEditMode={isEditMode}
            isExpanded={isExpanded}
            onRemoveTag={handleRemoveTag}
          />
        )}

        {data.lastEdited && (
          <div className="text-xs text-gray-400 mt-auto pt-2">
            Last edited: {new Date(data.lastEdited).toLocaleString()}
          </div>
        )}
      </div>

      <NodeHandles id={id} isConnectable={isConnectable} />
    </Card>
  );
};

export default TextNode;
