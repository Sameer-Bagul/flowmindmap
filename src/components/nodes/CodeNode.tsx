import { useState, useCallback } from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, Copy, Play, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AceEditor from 'react-ace';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ace from 'ace-builds';

// Import Ace editor modes and themes
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

// Configure Ace Editor base path
ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict/');
ace.config.setModuleUrl('ace/mode/javascript_worker', '/node_modules/ace-builds/src-noconflict/worker-javascript.js');

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
  code: string;
}

export const CodeNode = ({ id, data }: { id: string; data: CodeNodeData }) => {
  const [code, setCode] = useState(data.code || '// Write your code here');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('monokai');
  const { deleteElements, setNodes } = useReactFlow();

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, code: newCode } } : node
      )
    );
  }, [id, setNodes]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  }, [code]);

  const handleRun = useCallback(() => {
    try {
      if (language === 'javascript') {
        // eslint-disable-next-line no-new-func
        const result = new Function(code)();
        console.log('Code execution result:', result);
        toast.success('Code executed successfully');
      } else {
        toast.error('Only JavaScript execution is supported at the moment');
      }
    } catch (error) {
      console.error('Code execution error:', error);
      toast.error('Code execution failed');
    }
  }, [code, language]);

  const handleDelete = useCallback(() => {
    deleteElements({ nodes: [{ id }] });
    toast.success('Node deleted');
  }, [deleteElements, id]);

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
        className={cn(
          "min-w-[400px] min-h-[300px] p-4",
          "bg-background/95 backdrop-blur-xl border-2",
          "shadow-xl"
        )}
      >
        <div className="flex flex-col h-full gap-2">
          <div className="flex items-center justify-between bg-muted p-2 rounded-lg">
            <Badge variant="outline" className="gap-2">
              <Code2 className="h-4 w-4" />
              Code Editor
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
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRun}>
                <Play className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 min-h-[200px] rounded-md overflow-hidden border">
            <AceEditor
              mode={language}
              theme={theme}
              onChange={handleCodeChange}
              value={code}
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
                useWorker: false // Disable web workers to avoid the loading error
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
                "opacity-100 transition-opacity duration-200",
                "!bg-primary/50 hover:!bg-primary",
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