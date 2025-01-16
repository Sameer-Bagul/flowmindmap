import { memo } from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, Copy, Play, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

interface CodeNodeData {
  code: string;
}

export const CodeNode = memo(({ id, data }: { id: string; data: CodeNodeData }) => {
  const { deleteElements, setNodes } = useReactFlow();

  const handleCodeChange = (newCode: string) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, code: newCode } } : node
      )
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.code || '');
    toast.success('Code copied to clipboard');
  };

  const handleRun = () => {
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(data.code)();
      console.log('Code execution result:', result);
      toast.success('Code executed successfully');
    } catch (error) {
      console.error('Code execution error:', error);
      toast.error('Code execution failed');
    }
  };

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
    toast.success('Node deleted');
  };

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
              mode="javascript"
              theme="monokai"
              onChange={handleCodeChange}
              value={data.code || '// Write your code here'}
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
});