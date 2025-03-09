
import { StickyNote, ArrowRight } from "lucide-react";
import { NodeButton } from "./NodeButton";
import { NodeSection } from "./NodeSection";

export const SpecialNodes = () => {
  return (
    <NodeSection title="Specials">
      <NodeButton type="sticky-note" icon={StickyNote} label="Sticky Note" />
      <NodeButton type="arrow" icon={ArrowRight} label="Arrow" />
    </NodeSection>
  );
};
