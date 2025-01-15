import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface CodeNodeEditorProps {
  code: string;
  language: string;
  theme: string;
  onChange: (value: string | undefined) => void;
}

export const CodeNodeEditor = ({
  code,
  language,
  theme,
  onChange,
}: CodeNodeEditorProps) => {
  const { theme: systemTheme } = useTheme();
  
  return (
    <div className="flex-1 min-h-[300px] rounded-md overflow-hidden border border-primary/20">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        theme={systemTheme === 'dark' ? 'vs-dark' : theme}
        value={code}
        onChange={onChange}
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
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
};