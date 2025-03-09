
import { Text, Image, Table } from "lucide-react";
import { NodeButton } from "./NodeButton";
import { NodeSection } from "./NodeSection";

export const ContentNodes = () => {
  return (
    <NodeSection title="Content">
      <NodeButton type="text" icon={Text} label="Text Block" />
      <NodeButton type="image" icon={Image} label="Image" />
      <NodeButton type="table" icon={Table} label="Table" />
    </NodeSection>
  );
};
