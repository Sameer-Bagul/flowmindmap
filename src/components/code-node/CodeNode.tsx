import { useState, useCallback, useRef } from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CodeNodeHeader } from './CodeNodeHeader';
import { CodeNodeEditor } from './CodeNodeEditor';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      console.log('Code execution result:', result);
      toast.success('Code executed successfully');
    } catch (error) {
      console.error('Code execution error:', error);
      toast.error('Code execution failed');
    }
  }, [code]);

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
        handleClassName="h-3 w-3 bg-background border-2 border-primary rounded-full"
      />
      <Card 
        className={cn(
          "min-w-[400px] min-h-[300px] p-4",
          "bg-background/95 backdrop-blur-xl border-2",
          "shadow-xl dark:shadow-primary/20",
          "dark:bg-background/80 dark:border-primary/50"
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

          <CodeNodeEditor
            code={code}
            language={language}
            theme={theme}
            onChange={(value) => setCode(value || '')}
          />
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
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CodeNode;