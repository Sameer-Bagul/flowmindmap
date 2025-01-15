import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, Copy, Download, Upload, Play, Settings2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CodeNodeHeaderProps {
  language: string;
  setLanguage: (value: string) => void;
  theme: string;
  setTheme: (value: string) => void;
  onCopy: () => void;
  onDownload: () => void;
  onUpload: () => void;
  onRun: () => void;
  onDelete: () => void;
}

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

const themes = ['vs-dark', 'hc-black', 'hc-light'];

export const CodeNodeHeader = ({
  language,
  setLanguage,
  theme,
  setTheme,
  onCopy,
  onDownload,
  onUpload,
  onRun,
  onDelete
}: CodeNodeHeaderProps) => {
  return (
    <div className="flex items-center justify-between bg-background/20 p-2 rounded-t-lg border-b border-border/50">
      <Badge variant="outline" className="gap-2 border-primary text-primary">
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
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDownload}>
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onUpload}>
          <Upload className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRun}>
          <Play className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive" 
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};