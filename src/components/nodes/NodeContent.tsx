import { useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NoteEditor } from '../NoteEditor';
import { MediaSection } from './MediaSection';
import { toast } from 'sonner';
import type { TextNodeData, MediaItem, DocumentFormat } from '../../types/node';

export const NodeContent = ({ id, data }: { id: string; data: TextNodeData }) => {
  const [format, setFormat] = useState<DocumentFormat>(data.format || 'default');
  const { setNodes } = useReactFlow();

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

  const handleFormatChange = useCallback((newFormat: DocumentFormat) => {
    setFormat(newFormat);
    setNodes(nodes => 
      nodes.map(node => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              format: newFormat
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
          const media = Array.isArray(node.data.media) ? node.data.media : [];
          return {
            ...node,
            data: {
              ...node.data,
              media: [...media, mediaItem]
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Select value={format} onValueChange={handleFormatChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="a4">A4</SelectItem>
            <SelectItem value="wide">Wide</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <MediaSection 
        media={data.media} 
        onAddMedia={handleAddMedia}
        onRemoveMedia={handleRemoveMedia}
      />

      <NoteEditor 
        content={data.content || ''} 
        onChange={handleContentChange}
        format={format}
        autoFocus
      />
    </div>
  );
};