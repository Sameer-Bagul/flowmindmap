import { useState, useCallback, useRef } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Code2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const languages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby'
];

const themes = [
  'vs-dark',
  'light'
];

interface CodeNodeData {
  label: string;
  code: string;
  language: string;
  theme: string;
}

const CodeNode = ({ id, data, isConnectable }: { id: string, data: CodeNodeData; isConnectable?: boolean }) => {
  const [code, setCode] = useState(data.code || '// Write your code here');
  const [language, setLanguage] = useState(data.language || 'typescript');
  const [theme, setTheme] = useState(data.theme || 'vs-dark');
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  }, [code]);

  return (
    <>
      <NodeResizer 
        minWidth={400}
        minHeight={300}
        isVisible={true}
        lineClassName="border-primary"
        handleClassName="h-3 w-3 bg-white border-2 border-primary rounded-full"
      />
      <Card 
        ref={nodeRef}
        className={cn(
          "min-w-[400px] min-h-[300px] p-4",
          "bg-background/95 backdrop-blur-xl border-2",
          "shadow-xl"
        )}
      >
        <div className="flex flex-col h-full gap-2">
          <div className="flex items-center justify-between bg-card p-2 rounded-t-lg border-b">
            <Badge variant="outline" className="gap-2">
              <Code2 className="h-3 w-3" />
              Code Snippet
            </Badge>
            <div className="flex gap-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[100px] h-8">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map(t => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 min-h-[200px] rounded-md overflow-hidden border">
            <Editor
              height="100%"
              defaultLanguage={language}
              language={language}
              theme={theme}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                glyphMargin: true,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
              }}
            />
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {['top', 'right', 'bottom', 'left'].map((position) => (
            <Handle
              key={position}
              type="source"
              position={position as Position}
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                "!bg-primary/50 hover:!bg-primary",
                "w-3 h-3 rounded-full border-2 border-white"
              )}
              id={`${position}-${id}`}
              isConnectable={isConnectable}
            />
          ))}
        </div>
      </Card>
    </>
  );
};

export default CodeNode;