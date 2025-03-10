
import { useState, useCallback } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToggleButton } from './sidebar/ToggleButton';
import { DocumentNodes } from './sidebar/DocumentNodes';
import { SidebarActions } from './sidebar/SidebarActions';

const THEMES = [
  "linear-gradient(to right, #ee9ca7, #ffdde1)",
  "linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)",
];

export const SidebarPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(0);
  
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <TooltipProvider>
      <div 
        className="flex flex-col items-center p-3 rounded-xl backdrop-blur-lg z-10 border border-white/20 shadow-lg"
        style={{ background: THEMES[currentTheme] }}
      >
        <ToggleButton isExpanded={isExpanded} onClick={toggleExpanded} />

        {isExpanded && <DocumentNodes />}

        <div className="pt-2 border-t border-white/20">
          <SidebarActions 
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};
