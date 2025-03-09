
import { MenuSquare, CircleIcon, Triangle } from "lucide-react";
import { NodeButton } from "./NodeButton";
import { NodeSection } from "./NodeSection";

export const ShapeNodes = () => {
  return (
    <NodeSection title="Shapes">
      <NodeButton type="square" icon={MenuSquare} label="Square" />
      <NodeButton type="circle" icon={CircleIcon} label="Circle" />
      <NodeButton type="triangle" icon={Triangle} label="Triangle" />
    </NodeSection>
  );
};
