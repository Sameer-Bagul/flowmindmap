
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToggleButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

export const ToggleButton = ({ isExpanded, onClick }: ToggleButtonProps) => {
  return (
    <Button 
      variant="glass-icon"
      size="icon"
      className="mb-3"
      onClick={onClick}
    >
      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </Button>
  );
};
