import { useState, useCallback, useRef } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, Copy, Download, Upload, Play, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Editor } from "@monaco-editor/react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CodeNodeHeader } from './CodeNodeHeader';
import { CodeOutput } from './CodeOutput';

interface CodeNodeData {
  label: string;
  code: string;
  language: string;
  theme: string;
}

const CodeNode = ({ id, data }: { id: string; data: CodeNodeData }) => {
  const [code, setCode] = useState(data.code || '// Write your code here');
  const [language, setLanguage] = useState(data.language || 'typescript');
  const [theme, setTheme] = useState(data.theme || 'vs-dark');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [output, setOutput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        toast.success('Code uploaded');
      };
      reader.readAsText(file);
    }
  }, []);

  const handleRun = useCallback(() => {
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(code)();
      const output = JSON.stringify(result, null, 2);
      setOutput(output);
      setShowOutput(true);
      toast.success('Code executed successfully');
    } catch (error) {
      setOutput(String(error));
      setShowOutput(true);
      toast.error('Code execution failed');
    }
  }, [code]);

  return (
    <>
      <NodeResizer 
        minWidth={400}
        minHeight={300}
        isVisible={true}
        lineClassName="border-primary"
        handleClassName="h-3 w-3 bg-background border-2 border-primary rounded-full"
      />
      <Card 
        className={cn(
          "min-w-[400px] min-h-[300px] p-4",
          "bg-background/80 backdrop-blur-xl border-2",
          "shadow-xl dark:shadow-primary/20",
          "dark:bg-zinc-900/80 dark:border-primary/50"
        )}
      >
        <div className="flex flex-col h-full gap-2">
          <CodeNodeHeader
            language={language}
            setLanguage={setLanguage}
            theme={theme}
            setTheme={setTheme}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onUpload={handleUpload}
            onRun={handleRun}
            onDelete={() => setShowDeleteDialog(true)}
          />

          <div className="flex-1 min-h-[300px] rounded-md overflow-hidden border border-primary/20">
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
                padding: { top: 20, bottom: 20 },
                bracketPairColorization: { 
                  enabled: true, 
                  independentColorPoolPerBracketType: true 
                }
              }}
            />
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".js,.ts,.py,.java,.cpp,.cs,.go,.rs,.php,.rb,.txt"
        />

        <div className="absolute inset-0 pointer-events-none">
          {['top', 'right', 'bottom', 'left'].map((position) => (
            <Handle
              key={position}
              type="source"
              position={position as Position}
              className={cn(
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                "!bg-primary/50 hover:!bg-primary",
                "w-3 h-3 rounded-full border-2 border-background"
              )}
              id={`${position}-${id}`}
            />
          ))}
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the code node.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {}} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CodeOutput 
        isOpen={showOutput} 
        onClose={() => setShowOutput(false)} 
        output={output}
      />
    </>
  );
};

export default CodeNode;