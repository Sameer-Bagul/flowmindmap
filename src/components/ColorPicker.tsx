
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const colors = [
  // Whites
  "#FFFFFF", // Pure white
  "#F8F9FA", // Off-white
  
  // Blues
  "#DBEAFE", // Light blue
  "#93C5FD", // Mid blue
  "#3B82F6", // Bright blue
  "#1E40AF", // Dark blue
  
  // Greens
  "#DCFCE7", // Light green
  "#86EFAC", // Mid green
  "#22C55E", // Bright green
  "#166534", // Dark green
  
  // Yellows/Ambers
  "#FEF3C7", // Light yellow
  "#FCD34D", // Mid yellow
  "#F59E0B", // Amber
  "#B45309", // Dark amber
  
  // Reds
  "#FEE2E2", // Light red
  "#FCA5A5", // Mid red
  "#EF4444", // Bright red
  "#B91C1C", // Dark red
  
  // Purples
  "#E5DEFF", // Light purple
  "#C084FC", // Mid purple
  "#8B5CF6", // Bright purple
  "#6D28D9", // Dark purple
  
  // Pinks
  "#FCE7F3", // Light pink
  "#F9A8D4", // Mid pink
  "#EC4899", // Bright pink
  "#BE185D", // Dark pink
];

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ value = "#000000", onChange }: ColorPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-10 h-10 p-0 rounded-md border-2 shadow-sm hover:shadow-md transition-all"
          style={{ 
            backgroundColor: value,
            borderColor: value === "#FFFFFF" ? "#e2e8f0" : value
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[16rem] p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={cn(
                "w-8 h-8 rounded-md transition-all duration-200 hover:scale-110 hover:shadow-lg",
                "border",
                value === color ? "ring-2 ring-primary ring-offset-2 scale-105" : "ring-offset-0"
              )}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
              title={color}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
