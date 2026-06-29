'use client';

import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';

interface AdminMdxEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function AdminMdxEditor({ value, onChange, disabled = false }: AdminMdxEditorProps) {
  return (
    <CodeMirror
      value={value}
      height="100%"
      className="h-full overflow-hidden rounded-xl border border-app-border text-sm"
      editable={!disabled}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
        bracketMatching: true,
      }}
      extensions={[markdown({ base: markdownLanguage })]}
      onChange={onChange}
    />
  );
}
