import { memo, useState, useCallback, useRef } from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code2, Copy, Download, Play, Settings2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import AceEditor from 'react-ace';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/ext-language_tools';

import type { CodeNodeData } from '@/types/node';

const languages = ['javascript', 'python', 'typescript'];
const themes = ['github', 'monokai', 'tomorrow_night'];

const CodeNode = ({ id, data }: { id: string; data: CodeNodeData }) => {
  const [code, setCode] = useState(data.code || '// Write your code here');
  const [language, setLanguage] = useState(data.language || 'javascript');
  const [theme, setTheme] = useState(data.theme || 'github');
  const [output, setOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const { deleteElements } = useReactFlow();

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
      // For demonstration, only JavaScript execution is implemented
      if (language === 'javascript') {
        // eslint-disable-next-line no-new-func
        const result = new Function(code)();
        setOutput(JSON.stringify(result, null, 2));
      } else {
        setOutput(`Execution for ${language} is not implemented in this demo`);
      }
      setShowOutput(true);
    } catch (error) {
      setOutput(String(error));
      setShowOutput(true);
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
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRun}>
                <Play className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
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
        </div>

        <Dialog open={showOutput} onOpenChange={setShowOutput}>
          <DialogContent className="sm:max-w-[600px]">
            <div className="p-4 bg-background rounded-md">
              <pre className="whitespace-pre-wrap overflow-auto max-h-[400px]">
                {output}
              </pre>
            </div>
          </DialogContent>
        </Dialog>

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
            />
          ))}
        </div>
      </Card>
    </>
  );
};

export default memo(CodeNode);