import React, { useRef, useEffect } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import { useStore } from '../store/useStore';

interface CodeEditorProps {
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ className = '' }) => {
  const { openFiles, activeFileId, updateFileContent, closeFile, setActiveFile, theme, editorSettings } = useStore();
  const editorRef = useRef<any>(null);

  const activeFile = openFiles.find(f => f.id === activeFileId);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleEditorChange: OnChange = (value) => {
    if (activeFileId && value !== undefined) {
      updateFileContent(activeFileId, value);
    }
  };

  // Update editor options in real-time when settings change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        minimap: { enabled: editorSettings.minimap },
        fontSize: editorSettings.fontSize,
        lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
        wordWrap: editorSettings.wordWrap ? 'on' : 'off',
        tabSize: editorSettings.tabSize,
      });
    }
  }, [editorSettings.minimap, editorSettings.fontSize, editorSettings.lineNumbers, editorSettings.wordWrap, editorSettings.tabSize]);

  useEffect(() => {
    if (editorRef.current && activeFile) {
      editorRef.current.focus();
    }
  }, [activeFileId]);

  const getFileIcon = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, string> = {
      tsx: '⚛️',
      jsx: '⚛️',
      ts: '🔷',
      js: '🟨',
      py: '🐍',
      html: '🌐',
      css: '🎨',
      json: '📋',
      md: '📝',
    };
    return iconMap[ext || ''] || '📄';
  };

  return (
    <div className={`flex flex-col h-full bg-vscode-bg ${className}`}>
      {/* Tabs */}
      <div className="flex items-center h-7 bg-vscode-sidebar border-b border-vscode-border overflow-x-auto">
        {openFiles.map((file) => (
          <div
            key={file.id}
            className={`flex items-center gap-1.5 px-2 py-1 border-r border-vscode-border cursor-pointer min-w-fit text-[10px]
              ${file.id === activeFileId 
                ? 'bg-vscode-bg text-white border-t border-t-vscode-accent' 
                : 'text-vscode-textMuted hover:text-white'}`}
            onClick={() => setActiveFile(file.id)}
          >
            <span className="text-xs">{getFileIcon(file.name)}</span>
            <span className="whitespace-nowrap">{file.name}</span>
            {file.isDirty && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.id);
              }}
              className="ml-0.5 p-0.5 text-vscode-textMuted hover:text-white"
            >
              <span className="text-[10px]">✕</span>
            </button>
          </div>
        ))}
        {openFiles.length === 0 && (
          <div className="px-3 py-1 text-vscode-textMuted text-[10px]">
            No files open
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1">
        {activeFile ? (
          <Editor
            height="100%"
            language={activeFile.language}
            value={activeFile.content}
            theme="vs-dark"
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: editorSettings.minimap },
              fontSize: editorSettings.fontSize,
              fontFamily: "'Menlo', 'Monaco', 'Consolas', monospace",
              fontLigatures: true,
              lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
              wordWrap: editorSettings.wordWrap ? 'on' : 'off',
              automaticLayout: true,
              tabSize: editorSettings.tabSize,
              scrollBeyondLastLine: false,
              renderWhitespace: 'selection',
              bracketPairColorization: { enabled: true },
              padding: { top: 16 },
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-vscode-bg text-vscode-textMuted">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-20">⚡</div>
              <h2 className="text-lg font-medium text-white mb-2">AI Digital Friend Zone</h2>
              <p className="text-sm">Select a file to edit</p>
              <p className="text-xs mt-2 text-vscode-textMuted">or create from templates</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
