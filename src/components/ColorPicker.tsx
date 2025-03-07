import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const colors = [
  "#FFFFFF", // Pure white
  "#F8F9FA", // Slightly off-white
  "#1EAEDB", // Bright blue
  "#33C3F0", // Sky blue
  "#F2FCE2", // Soft green
  "#FEF7CD", // Soft yellow
  "#FEC6A1", // Soft orange
  "#E5DEFF", // Soft purple
  "#FFDEE2", // Soft pink
  "#FDE1D3", // Soft peach
  "#D3E4FD", // Soft blue
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
          className="w-8 h-8 p-0 rounded-md border-2"
          style={{ 
            backgroundColor: value,
            borderColor: value === "#FFFFFF" ? "#e2e8f0" : value
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[12rem] p-2">
        <div className="grid grid-cols-4 gap-1">
          {colors.map((color) => (
            <button
              key={color}
              className={cn(
                "w-8 h-8 rounded-md transition-all duration-200 hover:scale-105",
                "border border-border",
                value === color && "ring-2 ring-primary ring-offset-2"
              )}
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};