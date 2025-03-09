
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  hasInput?: boolean;
}

export const ActionButton = ({ 
  icon: Icon, 
  label, 
  onClick,
  className = "",
  hasInput = false,
  inputProps
}: ActionButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={onClick} variant="glass-icon" size="icon" className={`mb-2 ${className}`}>
          <Icon className="h-4 w-4" />
          {hasInput && (
            <input
              {...inputProps}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};
