
"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCallback } from "react";

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
  // Use useCallback to prevent excessive re-renders that might lead to call stack issues
  const handleTopicChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onTopicChange(e.target.value);
  }, [onTopicChange]);

  const handleContextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAdditionalContextChange(e.target.value);
  }, [onAdditionalContextChange]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="topic">Topic</Label>
        <Input
          id="topic"
          placeholder="e.g., Machine Learning, History of Rome, Climate Change"
          value={topic}
          onChange={handleTopicChange}
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <Label htmlFor="context">Additional Context (optional)</Label>
        <Textarea
          id="context"
          placeholder="Add any specific requirements or focus areas"
          value={additionalContext}
          onChange={handleContextChange}
          rows={3}
        />
      </div>
    </div>
  );
};
