
import { useState, useCallback } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToggleButton } from './sidebar/ToggleButton';
import { DocumentNodes } from './sidebar/DocumentNodes';
import { ShapeNodes } from './sidebar/ShapeNodes';
import { SpecialNodes } from './sidebar/SpecialNodes';
import { ContentNodes } from './sidebar/ContentNodes';
import { SidebarActions } from './sidebar/SidebarActions';

// Theme options defined outside component to prevent recreation on each render
const THEMES = [
  "linear-gradient(to right, #ee9ca7, #ffdde1)",
  "linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)",
  "linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)",
  "linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)",
  "linear-gradient(90deg, hsla(59, 86%, 68%, 1) 0%, hsla(134, 36%, 53%, 1) 100%)",
  "linear-gradient(90deg, hsla(24, 100%, 83%, 1) 0%, hsla(341, 91%, 68%, 1) 100%)",
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

        {isExpanded && (
          <>
            <DocumentNodes />
            <ShapeNodes />
            <SpecialNodes />
            <ContentNodes />
          </>
        )}

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
