/**
 * Professional Code Editor Component
 * Features:
 * - Syntax highlighting for 50+ languages
 * - Multi-cursor editing & smart selection
 * - LSP-like IntelliSense & completions
 * - Undo/Redo with history
 * - Large file support with optimizations
 * - Multiple themes (monokai, dracula, nord, etc.)
 * - Bracket pair colorization
 * - Code folding
 * - Find & Replace with regex
 * - Go to line/symbol
 */

import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import Editor, { OnMount, OnChange, Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useStore } from '../store/useStore';
import { EditorTheme } from '../types';

interface CodeEditorProps {
  className?: string;
}

// Custom themes registry
const CUSTOM_THEMES: Record<string, editor.IStandaloneThemeData> = {
  'monokai': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '88846f', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'f92672' },
      { token: 'string', foreground: 'e6db74' },
      { token: 'number', foreground: 'ae81ff' },
      { token: 'type', foreground: '66d9ef', fontStyle: 'italic' },
      { token: 'function', foreground: 'a6e22e' },
      { token: 'variable', foreground: 'f8f8f2' },
      { token: 'constant', foreground: 'ae81ff' },
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#f8f8f2',
      'editor.lineHighlightBackground': '#3e3d32',
      'editor.selectionBackground': '#49483e',
      'editorCursor.foreground': '#f8f8f0',
    }
  },
  'dracula': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff79c6' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'number', foreground: 'bd93f9' },
      { token: 'type', foreground: '8be9fd', fontStyle: 'italic' },
      { token: 'function', foreground: '50fa7b' },
      { token: 'variable', foreground: 'f8f8f2' },
    ],
    colors: {
      'editor.background': '#282a36',
      'editor.foreground': '#f8f8f2',
      'editor.lineHighlightBackground': '#44475a',
      'editor.selectionBackground': '#44475a',
      'editorCursor.foreground': '#f8f8f0',
    }
  },
  'github-dark': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff7b72' },
      { token: 'string', foreground: 'a5d6ff' },
      { token: 'number', foreground: '79c0ff' },
      { token: 'type', foreground: 'ffa657' },
      { token: 'function', foreground: 'd2a8ff' },
      { token: 'variable', foreground: 'c9d1d9' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#c9d1d9',
      'editor.lineHighlightBackground': '#161b22',
      'editor.selectionBackground': '#264f78',
      'editorCursor.foreground': '#c9d1d9',
    }
  },
  'one-dark-pro': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c678dd' },
      { token: 'string', foreground: '98c379' },
      { token: 'number', foreground: 'd19a66' },
      { token: 'type', foreground: 'e5c07b' },
      { token: 'function', foreground: '61afef' },
      { token: 'variable', foreground: 'e06c75' },
    ],
    colors: {
      'editor.background': '#282c34',
      'editor.foreground': '#abb2bf',
      'editor.lineHighlightBackground': '#2c313c',
      'editor.selectionBackground': '#3e4451',
      'editorCursor.foreground': '#528bff',
    }
  },
  'nord': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '616e88', fontStyle: 'italic' },
      { token: 'keyword', foreground: '81a1c1' },
      { token: 'string', foreground: 'a3be8c' },
      { token: 'number', foreground: 'b48ead' },
      { token: 'type', foreground: '8fbcbb' },
      { token: 'function', foreground: '88c0d0' },
      { token: 'variable', foreground: 'd8dee9' },
    ],
    colors: {
      'editor.background': '#2e3440',
      'editor.foreground': '#d8dee9',
      'editor.lineHighlightBackground': '#3b4252',
      'editor.selectionBackground': '#434c5e',
      'editorCursor.foreground': '#d8dee9',
    }
  },
  'solarized-dark': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '586e75', fontStyle: 'italic' },
      { token: 'keyword', foreground: '859900' },
      { token: 'string', foreground: '2aa198' },
      { token: 'number', foreground: 'd33682' },
      { token: 'type', foreground: 'b58900' },
      { token: 'function', foreground: '268bd2' },
      { token: 'variable', foreground: '839496' },
    ],
    colors: {
      'editor.background': '#002b36',
      'editor.foreground': '#839496',
      'editor.lineHighlightBackground': '#073642',
      'editor.selectionBackground': '#073642',
      'editorCursor.foreground': '#839496',
    }
  },
  'material-dark': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '546e7a', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c792ea' },
      { token: 'string', foreground: 'c3e88d' },
      { token: 'number', foreground: 'f78c6c' },
      { token: 'type', foreground: 'ffcb6b' },
      { token: 'function', foreground: '82aaff' },
      { token: 'variable', foreground: 'eeffff' },
    ],
    colors: {
      'editor.background': '#263238',
      'editor.foreground': '#eeffff',
      'editor.lineHighlightBackground': '#00000050',
      'editor.selectionBackground': '#80cbc420',
      'editorCursor.foreground': '#ffcc00',
    }
  },
};

// File icon mapping with colors
const FILE_ICONS: Record<string, { icon: string; color: string }> = {
  tsx: { icon: '⚛', color: '#61dafb' },
  jsx: { icon: '⚛', color: '#61dafb' },
  ts: { icon: 'TS', color: '#3178c6' },
  js: { icon: 'JS', color: '#f7df1e' },
  py: { icon: '🐍', color: '#3776ab' },
  html: { icon: '◇', color: '#e34c26' },
  css: { icon: '#', color: '#264de4' },
  scss: { icon: '#', color: '#cc6699' },
  json: { icon: '{ }', color: '#cbcb41' },
  md: { icon: 'M↓', color: '#ffffff' },
  yaml: { icon: '⚙', color: '#cb171e' },
  yml: { icon: '⚙', color: '#cb171e' },
  xml: { icon: '◇', color: '#f16529' },
  svg: { icon: '◎', color: '#ffb13b' },
  sql: { icon: '⊞', color: '#e38c00' },
  sh: { icon: '$', color: '#4eaa25' },
  bash: { icon: '$', color: '#4eaa25' },
  go: { icon: 'Go', color: '#00add8' },
  rs: { icon: '⚙', color: '#dea584' },
  java: { icon: '☕', color: '#b07219' },
  cpp: { icon: 'C++', color: '#f34b7d' },
  c: { icon: 'C', color: '#555555' },
  php: { icon: '🐘', color: '#777bb4' },
  rb: { icon: '💎', color: '#cc342d' },
  swift: { icon: '🦅', color: '#ffac45' },
  kt: { icon: 'K', color: '#a97bff' },
  vue: { icon: 'V', color: '#41b883' },
  svelte: { icon: 'S', color: '#ff3e00' },
};

export const CodeEditor: React.FC<CodeEditorProps> = ({ className = '' }) => {
  const { 
    openFiles, 
    activeFileId, 
    updateFileContent, 
    closeFile, 
    setActiveFile, 
    editorSettings 
  } = useStore();
  
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [selectionInfo, setSelectionInfo] = useState<string>('');

  const activeFile = openFiles.find(f => f.id === activeFileId);

  // Get file icon and color
  const getFileIcon = useCallback((name: string) => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    return FILE_ICONS[ext] || { icon: '📄', color: '#858585' };
  }, []);

  // Initialize Monaco with custom themes and language services
  const handleEditorWillMount = useCallback((monaco: Monaco) => {
    // Register custom themes
    Object.entries(CUSTOM_THEMES).forEach(([themeName, themeData]) => {
      monaco.editor.defineTheme(themeName, themeData);
    });

    // Register completion provider for TypeScript/JavaScript
    const tsCompletions = [
      { label: 'console.log', kind: monaco.languages.CompletionItemKind.Function, insertText: 'console.log($1)', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Log output to console' },
      { label: 'async function', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'async function ${1:name}(${2:params}): Promise<${3:void}> {\n\t$0\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Async function declaration' },
      { label: 'interface', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'interface ${1:Name} {\n\t$0\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Interface declaration' },
      { label: 'useState', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'const [${1:state}, set${2:State}] = useState<${3:type}>(${4:initial})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'React useState hook' },
      { label: 'useEffect', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'useEffect(() => {\n\t$1\n\treturn () => {\n\t\t$2\n\t};\n}, [${3:deps}])', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'React useEffect hook' },
      { label: 'arrow function', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'const ${1:name} = (${2:params}) => {\n\t$0\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Arrow function' },
      { label: 'try-catch', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'try {\n\t$1\n} catch (error) {\n\t$2\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Try-catch block' },
    ];

    ['typescript', 'javascript', 'typescriptreact', 'javascriptreact'].forEach(lang => {
      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          return {
            suggestions: tsCompletions.map(item => ({ ...item, range })) as any[],
          };
        },
      });
    });

    // Register Python completions
    monaco.languages.registerCompletionItemProvider('python', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        return {
          suggestions: [
            { label: 'def', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'def ${1:name}(${2:params}):\n\t${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Function definition', range },
            { label: 'class', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'class ${1:Name}:\n\tdef __init__(self${2:, params}):\n\t\t${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Class definition', range },
            { label: 'if __name__', kind: monaco.languages.CompletionItemKind.Snippet, insertText: "if __name__ == '__main__':\n\t${1:main()}", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Main entry point', range },
          ] as any[],
        };
      },
    });

    monacoRef.current = monaco;
  }, []);

  // Handle editor mount
  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    editor.focus();

    // Track cursor position
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({ line: e.position.lineNumber, column: e.position.column });
    });

    // Track selection
    editor.onDidChangeCursorSelection((e) => {
      const selection = e.selection;
      if (selection.isEmpty()) {
        setSelectionInfo('');
      } else {
        const selectedText = editor.getModel()?.getValueInRange(selection) || '';
        const lines = selectedText.split('\n').length;
        const chars = selectedText.length;
        setSelectionInfo(`${lines} lines, ${chars} chars selected`);
      }
    });

    // Register keyboard shortcuts for multi-cursor and smart selection
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
      editor.trigger('keyboard', 'editor.action.addSelectionToNextFindMatch', null);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyL, () => {
      editor.trigger('keyboard', 'editor.action.selectHighlights', null);
    });

    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, () => {
      editor.trigger('keyboard', 'editor.action.moveLinesUpAction', null);
    });

    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, () => {
      editor.trigger('keyboard', 'editor.action.moveLinesDownAction', null);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyK, () => {
      editor.trigger('keyboard', 'editor.action.deleteLines', null);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
      editor.trigger('keyboard', 'editor.action.commentLine', null);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      editor.trigger('keyboard', 'editor.action.formatDocument', null);
    });

  }, []);

  // Handle content changes
  const handleEditorChange: OnChange = useCallback((value) => {
    if (activeFileId && value !== undefined) {
      updateFileContent(activeFileId, value);
    }
  }, [activeFileId, updateFileContent]);

  // Update editor options when settings change
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const ed = editorRef.current;
      
      // Apply theme
      monacoRef.current.editor.setTheme(editorSettings.theme);
      
      // Apply all editor options
      ed.updateOptions({
        fontSize: editorSettings.fontSize,
        fontFamily: editorSettings.fontFamily,
        tabSize: editorSettings.tabSize,
        wordWrap: editorSettings.wordWrap ? 'on' : 'off',
        minimap: { enabled: editorSettings.minimap },
        lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
        cursorStyle: editorSettings.cursorStyle,
        cursorBlinking: editorSettings.cursorBlinking,
        smoothScrolling: editorSettings.smoothScrolling,
        mouseWheelZoom: editorSettings.mouseWheelZoom,
        multiCursorModifier: editorSettings.multiCursorModifier,
        columnSelection: editorSettings.columnSelection,
        quickSuggestions: editorSettings.quickSuggestions,
        suggestOnTriggerCharacters: editorSettings.suggestOnTriggerCharacters,
        acceptSuggestionOnEnter: editorSettings.acceptSuggestionOnEnter,
        parameterHints: { enabled: editorSettings.parameterHints },
        autoClosingBrackets: editorSettings.autoClosingBrackets,
        autoClosingQuotes: editorSettings.autoClosingQuotes,
        autoIndent: editorSettings.autoIndent,
        formatOnPaste: editorSettings.formatOnPaste,
        formatOnType: editorSettings.formatOnType,
        renderWhitespace: editorSettings.renderWhitespace,
        renderControlCharacters: editorSettings.renderControlCharacters,
        renderLineHighlight: editorSettings.renderLineHighlight,
        guides: editorSettings.guides,
        largeFileOptimizations: editorSettings.largeFileOptimizations,
        maxTokenizationLineLength: editorSettings.maxTokenizationLineLength,
      });
    }
  }, [editorSettings]);

  // Focus editor when active file changes
  useEffect(() => {
    if (editorRef.current && activeFile) {
      editorRef.current.focus();
    }
  }, [activeFileId, activeFile]);

  // Editor options computed from settings
  const editorOptions = useMemo((): editor.IStandaloneEditorConstructionOptions => ({
    fontSize: editorSettings.fontSize,
    fontFamily: editorSettings.fontFamily,
    fontLigatures: true,
    tabSize: editorSettings.tabSize,
    wordWrap: editorSettings.wordWrap ? 'on' : 'off',
    minimap: { 
      enabled: editorSettings.minimap,
      scale: 1,
      showSlider: 'mouseover',
    },
    lineNumbers: editorSettings.lineNumbers ? 'on' : 'off',
    
    // Cursor
    cursorStyle: editorSettings.cursorStyle,
    cursorBlinking: editorSettings.cursorBlinking,
    cursorSmoothCaretAnimation: 'on',
    
    // Scrolling
    smoothScrolling: editorSettings.smoothScrolling,
    mouseWheelZoom: editorSettings.mouseWheelZoom,
    scrollBeyondLastLine: false,
    
    // Multi-cursor
    multiCursorModifier: editorSettings.multiCursorModifier,
    columnSelection: editorSettings.columnSelection,
    
    // IntelliSense
    quickSuggestions: editorSettings.quickSuggestions,
    suggestOnTriggerCharacters: editorSettings.suggestOnTriggerCharacters,
    acceptSuggestionOnEnter: editorSettings.acceptSuggestionOnEnter,
    parameterHints: { enabled: editorSettings.parameterHints },
    suggest: {
      showKeywords: true,
      showSnippets: true,
      showClasses: true,
      showFunctions: true,
      showVariables: true,
      showConstants: true,
      showInterfaces: true,
      showModules: true,
      showProperties: true,
      showEvents: true,
      showOperators: true,
      showUnits: true,
      showValues: true,
      showEnumMembers: true,
      insertMode: 'insert',
      filterGraceful: true,
      snippetsPreventQuickSuggestions: false,
    },
    
    // Auto features
    autoClosingBrackets: editorSettings.autoClosingBrackets,
    autoClosingQuotes: editorSettings.autoClosingQuotes,
    autoIndent: editorSettings.autoIndent,
    formatOnPaste: editorSettings.formatOnPaste,
    formatOnType: editorSettings.formatOnType,
    autoSurround: 'languageDefined',
    
    // Display
    renderWhitespace: editorSettings.renderWhitespace,
    renderControlCharacters: editorSettings.renderControlCharacters,
    renderLineHighlight: editorSettings.renderLineHighlight,
    bracketPairColorization: { enabled: editorSettings.bracketPairColorization },
    guides: editorSettings.guides,
    
    // Code folding
    folding: true,
    foldingStrategy: 'indentation',
    foldingHighlight: true,
    showFoldingControls: 'mouseover',
    
    // Find & Replace
    find: {
      addExtraSpaceOnTop: false,
      autoFindInSelection: 'multiline',
      seedSearchStringFromSelection: 'selection',
    },
    
    // Misc
    automaticLayout: true,
    padding: { top: 8, bottom: 8 },
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
    },
    
    // Performance
    largeFileOptimizations: editorSettings.largeFileOptimizations,
    maxTokenizationLineLength: editorSettings.maxTokenizationLineLength,
    
    // Links
    links: true,
  }), [editorSettings]);

  return (
    <div className={`flex flex-col h-full bg-vscode-bg ${className}`}>
      {/* Tab Bar */}
      <div className="flex items-center h-8 bg-vscode-sidebar border-b border-vscode-border overflow-x-auto scrollbar-thin">
        {openFiles.map((file) => {
          const { icon, color } = getFileIcon(file.name);
          return (
            <div
              key={file.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 border-r border-vscode-border cursor-pointer min-w-fit text-xs group
                ${file.id === activeFileId 
                  ? 'bg-vscode-bg text-white border-t-2 border-t-vscode-accent -mt-[1px]' 
                  : 'text-vscode-textMuted hover:text-white hover:bg-vscode-hover'}`}
              onClick={() => setActiveFile(file.id)}
            >
              <span style={{ color }} className="text-[10px] font-bold">{icon}</span>
              <span className="whitespace-nowrap">{file.name}</span>
              {file.isDirty && <span className="w-2 h-2 rounded-full bg-vscode-accent" />}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeFile(file.id);
                }}
                className="ml-1 p-0.5 text-vscode-textMuted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
        {openFiles.length === 0 && (
          <div className="px-3 py-1.5 text-vscode-textMuted text-xs">
            No files open
          </div>
        )}
      </div>

      {/* Breadcrumb */}
      {activeFile && (
        <div className="flex items-center h-6 px-3 bg-vscode-bg border-b border-vscode-border/50 text-[10px] text-vscode-textMuted">
          <span className="hover:text-white cursor-pointer">{activeFile.path.split('/').slice(0, -1).join(' › ')}</span>
          <span className="mx-1">›</span>
          <span className="text-white">{activeFile.name}</span>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 relative">
        {activeFile ? (
          <Editor
            height="100%"
            language={activeFile.language}
            value={activeFile.content}
            theme={editorSettings.theme}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            beforeMount={handleEditorWillMount}
            options={editorOptions}
            loading={
              <div className="h-full flex items-center justify-center bg-vscode-bg">
                <div className="flex items-center gap-2 text-vscode-textMuted">
                  <div className="w-4 h-4 border-2 border-vscode-accent/30 border-t-vscode-accent rounded-full animate-spin" />
                  <span className="text-sm">Loading editor...</span>
                </div>
              </div>
            }
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-vscode-bg text-vscode-textMuted">
            <div className="text-center max-w-md">
              <svg className="w-16 h-16 mx-auto mb-4 text-vscode-accent/30" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <h2 className="text-lg font-medium text-white mb-2">AI Digital Friend Zone</h2>
              <p className="text-sm mb-4">Select a file to edit or create from templates</p>
              <div className="flex flex-wrap justify-center gap-2 text-[10px]">
                <kbd className="px-2 py-1 bg-vscode-sidebar rounded border border-vscode-border">Ctrl+P</kbd>
                <span>Quick Open</span>
                <kbd className="px-2 py-1 bg-vscode-sidebar rounded border border-vscode-border">Ctrl+Shift+P</kbd>
                <span>Commands</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between h-6 px-3 bg-vscode-sidebar border-t border-vscode-border text-[10px] text-vscode-textMuted">
        <div className="flex items-center gap-3">
          {activeFile && (
            <>
              <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
              {selectionInfo && <span className="text-vscode-accent">{selectionInfo}</span>}
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {activeFile && (
            <>
              <span className="hover:text-white cursor-pointer">{activeFile.language}</span>
              <span>UTF-8</span>
              <span>Spaces: {editorSettings.tabSize}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
