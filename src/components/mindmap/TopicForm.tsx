
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TopicFormProps {
  topic: string;
  additionalContext: string;
  onTopicChange: (value: string) => void;
  onAdditionalContextChange: (value: string) => void;
}

export const TopicForm: React.FC<TopicFormProps> = ({
  topic,
  additionalContext,
  onTopicChange,
  onAdditionalContextChange
}) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="topic">Topic</Label>
        <Input
          id="topic"
          placeholder="e.g., Machine Learning, History of Rome, Climate Change"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <Label htmlFor="context">Additional Context (optional)</Label>
        <Textarea
          id="context"
          placeholder="Add any specific requirements or focus areas"
          value={additionalContext}
          onChange={(e) => onAdditionalContextChange(e.target.value)}
          rows={3}
        />
      </div>
    </>
  );
};
