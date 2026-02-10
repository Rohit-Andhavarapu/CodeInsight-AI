
import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  language: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language }) => {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-700 h-[500px] shadow-2xl">
      <Editor
        height="100%"
        defaultLanguage={language}
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'Fira Code',
          padding: { top: 20, bottom: 20 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on"
        }}
      />
    </div>
  );
};

export default CodeEditor;
