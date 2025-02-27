import { useState } from 'react';
import AceEditor from 'react-ace';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Play, Copy, Download } from 'lucide-react';

// Import Ace editor modes
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
}

export const CodeEditor = ({ code, onChange, language = 'javascript' }: CodeEditorProps) => {
  const [output, setOutput] = useState('');

  const handleRun = () => {
    try {
      // For JavaScript code execution
      if (language === 'javascript') {
        // eslint-disable-next-line no-new-func
        const result = new Function(code)();
        setOutput(String(result));
        toast.success('Code executed successfully');
      } else {
        toast.error('Only JavaScript execution is supported at the moment');
      }
    } catch (error) {
      setOutput(String(error));
      toast.error('Code execution failed');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const handleDownload = () => {
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
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={handleRun}>
          <Play className="h-4 w-4 mr-1" /> Run
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-1" /> Copy
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" /> Download
        </Button>
      </div>
      <AceEditor
        mode={language}
        theme="monokai"
        onChange={onChange}
        value={code}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
        style={{ width: '100%', height: '200px' }}
        className="rounded-md border"
      />
      {output && (
        <div className="mt-2 p-2 bg-muted rounded-md">
          <pre className="text-sm whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
};