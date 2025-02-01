import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const languages = [
  'javascript',
  'typescript',
  'python',
  'html',
  'css',
  'json',
  'markdown',
  'sql',
];

export const CodeBlock = ({ node, updateAttributes }: any) => {
  const copyCode = () => {
    navigator.clipboard.writeText(node.textContent);
    toast.success('Code copied to clipboard');
  };

  return (
    <NodeViewWrapper className="relative my-4">
      <div className="flex items-center justify-between bg-muted/50 rounded-t-md p-2 border border-b-0">
        <Select
          value={node.attrs.language || 'javascript'}
          onValueChange={(value) => updateAttributes({ language: value })}
        >
          <SelectTrigger className="w-32 h-8">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" onClick={copyCode}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <NodeViewContent 
        className={cn(
          "p-4 bg-muted/30 rounded-b-md font-mono text-sm",
          "border border-t-0",
          "overflow-x-auto"
        )} 
      />
    </NodeViewWrapper>
  );
};