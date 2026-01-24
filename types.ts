// ============================================
// AI Digital Friend Zone - Type Definitions
// ============================================

// File System Types
export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
  language?: string;
}

export interface OpenFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
}

// Editor Types
export interface EditorTab {
  id: string;
  path: string;
  name: string;
  language: string;
  isActive: boolean;
}

// Terminal Types
export interface TerminalSession {
  id: string;
  name: string;
  isActive: boolean;
}

// AI Types
export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'mistral' | 'groq' | 'xai' | 'cerebras' | 'huggingface' | 'ollama';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  temperature: number;
  maxTokens: number;
}

// Editor Settings - Professional Configuration
export interface EditorSettings {
  // Basic
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  autoSave: boolean;
  
  // Professional Features
  theme: EditorTheme;
  cursorStyle: 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';
  cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
  smoothScrolling: boolean;
  mouseWheelZoom: boolean;
  
  // Multi-cursor & Selection
  multiCursorModifier: 'ctrlCmd' | 'alt';
  columnSelection: boolean;
  
  // Code Intelligence
  quickSuggestions: boolean;
  suggestOnTriggerCharacters: boolean;
  acceptSuggestionOnEnter: 'on' | 'off' | 'smart';
  parameterHints: boolean;
  autoClosingBrackets: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
  autoClosingQuotes: 'always' | 'languageDefined' | 'beforeWhitespace' | 'never';
  autoIndent: 'none' | 'keep' | 'brackets' | 'advanced' | 'full';
  formatOnPaste: boolean;
  formatOnType: boolean;
  
  // Display
  renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
  renderControlCharacters: boolean;
  renderLineHighlight: 'none' | 'gutter' | 'line' | 'all';
  bracketPairColorization: boolean;
  guides: {
    indentation: boolean;
    bracketPairs: boolean;
    highlightActiveBracketPair: boolean;
  };
  
  // Performance (Large Files)
  largeFileOptimizations: boolean;
  maxTokenizationLineLength: number;
  
  // Diff Editor
  enableSplitViewResizing: boolean;
  renderSideBySide: boolean;
}

export type EditorTheme = 
  | 'vs-dark' 
  | 'vs-light' 
  | 'hc-black' 
  | 'monokai' 
  | 'dracula' 
  | 'github-dark' 
  | 'one-dark-pro'
  | 'nord'
  | 'solarized-dark'
  | 'material-dark';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  type: 'image' | 'file' | 'code';
  name: string;
  content: string;
  mimeType?: string;
}

// Template Types
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: TemplateCategory;
  files: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

export type TemplateCategory = 
  | 'frontend' 
  | 'backend' 
  | 'fullstack' 
  | 'static' 
  | 'python' 
  | 'api';

// Extension Types
export interface Extension {
  id: string;
  name: string;
  description: string;
  icon?: string;
  version: string;
  category?: ExtensionCategory;
  enabled?: boolean;
  isBuiltIn?: boolean;
  commands?: ExtensionCommand[];
  actions?: ExtensionAction[];
  settings?: Record<string, any>;
}

export interface ExtensionCommand {
  id: string;
  name: string;
  shortcut?: string;
  handler: () => void | Promise<void>;
}

export interface ExtensionAction {
  id: string;
  label: string;
  icon?: string;
  context: 'editor' | 'file' | 'terminal' | 'global';
  handler: (target?: string) => void | Promise<void>;
}

export type ExtensionCategory = 
  | 'Language'
  | 'Framework'
  | 'Formatters' 
  | 'Snippets'
  | 'Source Control'
  | 'AI' 
  | 'Themes'
  | 'Appearance'
  | 'Tools'
  | 'Testing'
  | 'Database'
  | 'Custom';

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  template: string;
  files: FileNode[];
  createdAt: number;
  updatedAt: number;
}

// Layout Types
export type PanelLayout = 'default' | 'zen' | 'preview-focus' | 'terminal-focus';
export type Theme = 'light' | 'dark' | 'system';

// App State
export interface AppState {
  // Project
  currentProject: Project | null;
  projects: Project[];
  
  // Files
  files: FileNode[];
  openFiles: OpenFile[];
  activeFileId: string | null;
  
  // UI
  theme: Theme;
  layout: PanelLayout;
  sidebarOpen: boolean;
  aiPanelOpen: boolean;
  terminalOpen: boolean;
  
  // AI
  aiConfig: AIConfig;
  chatHistory: ChatMessage[];
  
  // Extensions
  extensions: Extension[];
}
