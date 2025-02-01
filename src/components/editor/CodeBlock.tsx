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
      <div className="flex items-center justify-between bg-zinc-800 rounded-t-md p-2 border border-b-0 border-zinc-700">
        <Select
          value={node.attrs.language || 'javascript'}
          onValueChange={(value) => updateAttributes({ language: value })}
        >
          <SelectTrigger className="w-32 h-8 bg-zinc-900 border-zinc-700 text-zinc-100">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang} className="text-zinc-100 hover:bg-zinc-800">
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" onClick={copyCode} className="text-zinc-100 hover:bg-zinc-700">
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <NodeViewContent 
        className={cn(
          "p-4 font-mono text-sm",
          "bg-zinc-900 text-zinc-100",
          "rounded-b-md border border-t-0 border-zinc-700",
          "overflow-x-auto"
        )} 
      />
    </NodeViewWrapper>
  );
};