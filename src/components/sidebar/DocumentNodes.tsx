
import { BookOpen, ListTodo, FileText } from "lucide-react";
import { NodeButton } from "./NodeButton";
import { NodeSection } from "./NodeSection";

export const DocumentNodes = () => {
  return (
    <NodeSection title="Documents">
      <NodeButton type="chapter" icon={BookOpen} label="Chapter" />
      <NodeButton type="main-topic" icon={ListTodo} label="Main Topic" />
      <NodeButton type="sub-topic" icon={FileText} label="Sub Topic" />
    </NodeSection>
  );
};
