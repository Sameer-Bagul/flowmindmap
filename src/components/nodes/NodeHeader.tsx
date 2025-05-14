
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { ColorPicker } from '../ColorPicker';
import { NoteType } from "@/types/node";
import { memo } from "react";

interface NodeHeaderProps {
  type: NoteType;
  backgroundColor: string;
  borderColor: string;
  defaultColors: {
    bg: string;
    border: string;
    badge: string;
  };
  onUpdateColor: (key: 'backgroundColor' | 'borderColor', color: string) => void;
  onDelete: () => void;
}

export const NodeHeader = memo(({
  type,
  backgroundColor,
  borderColor,
  defaultColors,
  onUpdateColor,
  onDelete
}: NodeHeaderProps) => {
  // Use computed values to avoid re-renders
  const bgColor = backgroundColor || defaultColors.bg;
  const brdColor = borderColor || defaultColors.border;
  
  return (
    <div className="flex items-center">
      <Badge variant={defaultColors.badge as any} className="capitalize backdrop-blur-sm">
        {type.replace('-', ' ')}
      </Badge>
      <div className="ml-auto flex gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 flex flex-col gap-4 bg-white/80 backdrop-blur-xl" sideOffset={5}>
            <div className="flex items-center justify-between">
              <Label>Background</Label>
              <ColorPicker
                value={bgColor}
                onChange={(color) => onUpdateColor('backgroundColor', color)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Border</Label>
              <ColorPicker
                value={brdColor}
                onChange={(color) => onUpdateColor('borderColor', color)}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive/90"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

NodeHeader.displayName = 'NodeHeader';
