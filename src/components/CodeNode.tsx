import { useState, useCallback, useRef } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, Copy, Download, Upload, Play, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from '@/components/ui/label';
import { Switch } from "@/components/ui/switch";

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
  'ruby',
  'html',
  'css',
  'json',
  'markdown',
  'yaml',
  'sql'
];

const themes = [
  'vs-dark',
  'hc-black',
  'hc-light'
];

interface CodeNodeData {
  label: string;
  code: string;
  language: string;
  theme: string;
  fontSize?: number;
  wordWrap?: boolean;
  minimap?: boolean;
  lineNumbers?: boolean;
}

const CodeNode = ({ id, data }: { id: string; data: CodeNodeData }) => {
  const [code, setCode] = useState(data.code || '// Write your code here');
  const [language, setLanguage] = useState(data.language || 'typescript');
  const [theme, setTheme] = useState(data.theme || 'vs-dark');
  const [fontSize, setFontSize] = useState(data.fontSize || 14);
  const [wordWrap, setWordWrap] = useState(data.wordWrap ?? true);
  const [minimap, setMinimap] = useState(data.minimap ?? true);
  const [lineNumbers, setLineNumbers] = useState(data.lineNumbers ?? true);
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
      toast.success('Code executed successfully');
    } catch (error) {
      toast.error('Code execution failed');
    }
  }, [code]);

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
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Label>Font Size</Label>
                      <Select value={fontSize.toString()} onValueChange={(v) => setFontSize(Number(v))}>
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {[12, 14, 16, 18, 20].map(size => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}px
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Word Wrap</Label>
                      <Switch checked={wordWrap} onCheckedChange={setWordWrap} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Minimap</Label>
                      <Switch checked={minimap} onCheckedChange={setMinimap} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Line Numbers</Label>
                      <Switch checked={lineNumbers} onCheckedChange={setLineNumbers} />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleUpload}>
                <Upload className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRun}>
                <Play className="h-4 w-4" />
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
                minimap: { enabled: minimap },
                fontSize: fontSize,
                wordWrap: wordWrap ? 'on' : 'off',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                lineNumbers: lineNumbers ? 'on' : 'off',
                glyphMargin: true,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
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
