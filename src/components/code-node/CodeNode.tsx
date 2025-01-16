import { useState, useCallback } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, Copy, Download, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AceEditor from "react-ace";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import Ace editor modes and themes
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const languages = [
  'javascript',
  'python',
  'typescript'
];

const themes = [
  'monokai',
  'github'
];

interface CodeNodeData {
  label: string;
  code: string;
  language: string;
  theme: string;
}

const CodeNode = ({ id, data, onDelete }: { id: string; data: CodeNodeData; onDelete?: (id: string) => void }) => {
  const [code, setCode] = useState(data.code || '// Write your code here');
  const [language, setLanguage] = useState(data.language || 'javascript');
  const [theme, setTheme] = useState(data.theme || 'monokai');
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  }, [code]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded');
  }, [code, language]);

  const handleRun = useCallback(() => {
    try {
      // For JavaScript code execution
      if (language === 'javascript') {
        // eslint-disable-next-line no-new-func
        const result = new Function(code)();
        setOutput(String(result));
        setShowOutput(true);
        toast.success('Code executed successfully');
      } else {
        toast.error('Only JavaScript execution is supported at the moment');
      }
    } catch (error) {
      setOutput(String(error));
      setShowOutput(true);
      toast.error('Code execution failed');
    }
  }, [code, language]);

  return (
    <>
      <NodeResizer 
        minWidth={400}
        minHeight={300}
        isVisible={true}
        lineClassName="border-violet-500"
        handleClassName="h-3 w-3 bg-white border-2 border-violet-500 rounded-full"
      />
      <Card 
        className={cn(
          "min-w-[400px] min-h-[300px] p-4",
          "bg-background/95 backdrop-blur-xl border-2 border-violet-500",
          "shadow-xl"
        )}
      >
        <div className="flex flex-col h-full gap-2">
          <div className="flex items-center justify-between bg-card p-2 rounded-t-lg border-b">
            <Badge variant="outline" className="gap-2 border-violet-500 text-violet-500">
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
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRun}>
                <Play className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 min-h-[200px] rounded-md overflow-hidden border">
            <AceEditor
              mode={language}
              theme={theme}
              value={code}
              onChange={setCode}
              name={`editor-${id}`}
              width="100%"
              height="100%"
              fontSize={14}
              showPrintMargin={false}
              showGutter={true}
              highlightActiveLine={true}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          </div>

          {showOutput && (
            <div className="mt-2 p-2 bg-muted rounded-md">
              <pre className="text-sm whitespace-pre-wrap">{output}</pre>
            </div>
          )}
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {['top', 'right', 'bottom', 'left'].map((position) => (
            <Handle
              key={position}
              type="source"
              position={position as Position}
              className={cn(
                "!bg-violet-500/50 hover:!bg-violet-500",
                "w-3 h-3 rounded-full border-2 border-white"
              )}
              id={`${position}-${id}`}
            />
          ))}
        </div>
      </Card>
    </>
  );
};

export default CodeNode;