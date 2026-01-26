/**
 * AI Agent Extension
 * 
 * Provides AI coding agent capabilities as a proper VS Code-style extension.
 * This extension integrates AI providers (OpenAI, Gemini, Anthropic, etc.)
 * through the extension system rather than direct API key integration.
 * 
 * Features:
 * - Multi-provider support with easy switching
 * - Secure API key management through extension settings
 * - File operations (create, edit, delete)
 * - Terminal command execution
 * - Context-aware code generation
 * - Streaming responses with real-time updates
 */

import { extensionManager, extensionAPI, extensionEvents } from './extensions';
import { Extension, ExtensionCommand, ExtensionAction } from '../types';
import { socketService } from './socket';

// =============================================================================
// Types
// =============================================================================

export type AIProvider = 'openai' | 'gemini' | 'anthropic' | 'mistral' | 'groq' | 'ollama';

export interface AIAgentConfig {
  enabled: boolean;
  provider: AIProvider;
  model: string;
  apiKey: string;
  temperature: number;
  maxTokens: number;
  autoApplyChanges: boolean;
  showConfirmationDialogs: boolean;
  streamingEnabled: boolean;
}

export interface AIProviderInfo {
  id: AIProvider;
  name: string;
  icon: string;
  models: string[];
  requiresApiKey: boolean;
  apiKeyUrl?: string;
  description: string;
}

export interface FileOperation {
  type: 'create' | 'edit' | 'delete' | 'read' | 'rename';
  path: string;
  content?: string;
  oldContent?: string;
  newName?: string;
}

export interface AIAgentCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: Error) => void;
  onFileOperation?: (operation: FileOperation) => void;
  onTerminalCommand?: (command: string) => void;
  onStatusChange?: (status: AIAgentStatus) => void;
}

export type AIAgentStatus = 'idle' | 'thinking' | 'streaming' | 'applying' | 'error';

// =============================================================================
// AI Provider Definitions
// =============================================================================

export const AI_PROVIDERS: AIProviderInfo[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'o1-preview', 'o1-mini'],
    requiresApiKey: true,
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    description: 'Industry-leading AI models from OpenAI',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '✨',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    requiresApiKey: true,
    apiKeyUrl: 'https://makersuite.google.com/app/apikey',
    description: 'Google\'s multimodal AI models',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    icon: '🧠',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
    requiresApiKey: true,
    apiKeyUrl: 'https://console.anthropic.com/',
    description: 'Claude - Safe, helpful AI assistant',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    icon: '🌀',
    models: ['mistral-large-latest', 'mistral-medium-latest', 'codestral-latest'],
    requiresApiKey: true,
    apiKeyUrl: 'https://console.mistral.ai/',
    description: 'European AI excellence',
  },
  {
    id: 'groq',
    name: 'Groq',
    icon: '⚡',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    requiresApiKey: true,
    apiKeyUrl: 'https://console.groq.com/',
    description: 'Lightning-fast inference',
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    icon: '🦙',
    models: ['llama3.2', 'codellama', 'mistral', 'deepseek-coder', 'qwen2.5-coder'],
    requiresApiKey: false,
    description: 'Run models locally with Ollama',
  },
];

// =============================================================================
// System Prompt - Enhanced with Full Control Capabilities
// =============================================================================

const AGENTIC_SYSTEM_PROMPT = `You are an expert AI coding assistant in the "AI Digital Friend Zone" IDE with FULL ACCESS and CONTROL over:

## 🔧 TERMINAL CONTROL
You have complete terminal access to execute any command. Use these tags:

### Execute a single command:
<terminal_run>
npm install express
</terminal_run>

### Execute multiple commands sequentially:
<terminal_sequence>
npm install
npm run build
npm test
</terminal_sequence>

### Start a long-running process (server, watch, etc.):
<terminal_start name="dev-server">
npm run dev
</terminal_start>

### Stop a running process:
<terminal_stop name="dev-server" />

## 📁 PROJECT DIRECTORY CONTROL
Full file system access for the project:

### Create a new file:
<file_create path="src/components/Button.tsx">
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};
</file_create>

### Edit an existing file:
<file_edit path="src/App.tsx">
// Full new content of the file
import React from 'react';
export default function App() { return <div>Hello</div>; }
</file_edit>

### Delete a file:
<file_delete path="src/oldFile.ts" />

### Rename/move a file:
<file_rename from="src/old.ts" to="src/new.ts" />

### Create a folder:
<folder_create path="src/components/ui" />

## 🔨 BUILD & RUN OPERATIONS
Control over build, test, and run commands:

### Run build:
<build />

### Run with custom command:
<build command="npm run build:prod" />

### Run tests:
<test />

### Run the application:
<run command="npm start" />

### Run in development mode:
<dev />

## 🚀 DEPLOYMENT OPERATIONS
Deploy to various platforms:

### Deploy to Vercel:
<deploy platform="vercel" project="my-app" />

## 📦 GIT OPERATIONS
Full version control access:

### Initialize a repository:
<git_init />

### Stage files:
<git_add path="." />

### Commit changes:
<git_commit message="feat: add new feature" />

### Create and switch branch:
<git_branch name="feature/new-feature" checkout="true" />

### Push changes:
<git_push remote="origin" branch="main" />

### Pull changes:
<git_pull remote="origin" branch="main" />

### View commit log:
<git_log depth="10" />

### View diff:
<git_diff file="src/App.tsx" />

## 📋 GUIDELINES

1. **Complete Code**: Always provide COMPLETE, working code - never use placeholders like "..."
2. **All Imports**: Include all necessary imports
3. **Best Practices**: Follow language/framework best practices
4. **Error Handling**: Add proper error handling
5. **Dependencies**: Install required dependencies before using them
6. **File Order**: Create files in logical order (config first, then main files)
7. **Testing**: Include tests when appropriate
8. **Documentation**: Add comments for complex logic
9. **Git Workflow**: Commit often with meaningful messages

When the user asks to build something, create ALL necessary files and execute ALL required commands to make it fully functional.`;

// =============================================================================
// AI Agent Extension Class
// =============================================================================

class AIAgentExtensionService {
  private config: AIAgentConfig;
  private status: AIAgentStatus = 'idle';
  private isStreaming = false;
  private currentResponse = '';
  private statusCallbacks: Set<(status: AIAgentStatus) => void> = new Set();
  private configCallbacks: Set<(config: AIAgentConfig) => void> = new Set();

  constructor() {
    // Load config from localStorage or use defaults
    this.config = this.loadConfig();
    
    // Register the extension
    this.registerExtension();
  }

  // ==========================================================================
  // Configuration Management
  // ==========================================================================

  private loadConfig(): AIAgentConfig {
    const saved = localStorage.getItem('aiAgentExtension:config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall through to defaults
      }
    }
    
    return {
      enabled: true,
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: '',
      temperature: 0.7,
      maxTokens: 4096,
      autoApplyChanges: false,
      showConfirmationDialogs: true,
      streamingEnabled: true,
    };
  }

  private saveConfig(): void {
    localStorage.setItem('aiAgentExtension:config', JSON.stringify(this.config));
    this.notifyConfigChange();
  }

  public getConfig(): AIAgentConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<AIAgentConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  public setApiKey(provider: AIProvider, apiKey: string): void {
    // Store API keys separately per provider
    localStorage.setItem(`aiAgentExtension:apiKey:${provider}`, apiKey);
    if (provider === this.config.provider) {
      this.config.apiKey = apiKey;
      this.notifyConfigChange();
    }
  }

  public getApiKey(provider: AIProvider): string {
    return localStorage.getItem(`aiAgentExtension:apiKey:${provider}`) || '';
  }

  public setProvider(provider: AIProvider): void {
    const apiKey = this.getApiKey(provider);
    this.config.provider = provider;
    this.config.apiKey = apiKey;
    // Set default model for provider
    const providerInfo = AI_PROVIDERS.find(p => p.id === provider);
    if (providerInfo && providerInfo.models.length > 0) {
      this.config.model = providerInfo.models[0];
    }
    this.saveConfig();
  }

  public setModel(model: string): void {
    this.config.model = model;
    this.saveConfig();
  }

  // ==========================================================================
  // Status Management
  // ==========================================================================

  private setStatus(status: AIAgentStatus): void {
    this.status = status;
    this.statusCallbacks.forEach(cb => cb(status));
    extensionEvents.emit('aiAgent:statusChange', status);
  }

  public getStatus(): AIAgentStatus {
    return this.status;
  }

  public onStatusChange(callback: (status: AIAgentStatus) => void): () => void {
    this.statusCallbacks.add(callback);
    return () => this.statusCallbacks.delete(callback);
  }

  public onConfigChange(callback: (config: AIAgentConfig) => void): () => void {
    this.configCallbacks.add(callback);
    return () => this.configCallbacks.delete(callback);
  }

  private notifyConfigChange(): void {
    this.configCallbacks.forEach(cb => cb(this.config));
    extensionEvents.emit('aiAgent:configChange', this.config);
  }

  // ==========================================================================
  // Provider Information
  // ==========================================================================

  public getProviders(): AIProviderInfo[] {
    return AI_PROVIDERS;
  }

  public getCurrentProvider(): AIProviderInfo | undefined {
    return AI_PROVIDERS.find(p => p.id === this.config.provider);
  }

  public isConfigured(): boolean {
    const provider = this.getCurrentProvider();
    if (!provider) return false;
    if (!provider.requiresApiKey) return true;
    return !!this.config.apiKey;
  }

  // ==========================================================================
  // Response Parsing
  // ==========================================================================

  public parseOperations(response: string): FileOperation[] {
    const operations: FileOperation[] = [];
    
    // Parse file_create tags
    const createRegex = /<file_create\s+path="([^"]+)">([\s\S]*?)<\/file_create>/g;
    let match;
    while ((match = createRegex.exec(response)) !== null) {
      operations.push({
        type: 'create',
        path: match[1],
        content: match[2].trim(),
      });
    }
    
    // Parse file_edit tags
    const editRegex = /<file_edit\s+path="([^"]+)">([\s\S]*?)<\/file_edit>/g;
    while ((match = editRegex.exec(response)) !== null) {
      operations.push({
        type: 'edit',
        path: match[1],
        content: match[2].trim(),
      });
    }
    
    // Parse file_delete tags
    const deleteRegex = /<file_delete\s+path="([^"]+)"\s*\/>/g;
    while ((match = deleteRegex.exec(response)) !== null) {
      operations.push({
        type: 'delete',
        path: match[1],
      });
    }
    
    return operations;
  }

  public parseTerminalCommands(response: string): string[] {
    const commands: string[] = [];
    const terminalRegex = /<terminal_run>([\s\S]*?)<\/terminal_run>/g;
    let match;
    while ((match = terminalRegex.exec(response)) !== null) {
      commands.push(match[1].trim());
    }
    return commands;
  }

  public cleanResponse(response: string): string {
    return response
      .replace(/<file_create\s+path="[^"]+">[\s\S]*?<\/file_create>/g, '')
      .replace(/<file_edit\s+path="[^"]+">[\s\S]*?<\/file_edit>/g, '')
      .replace(/<file_delete\s+path="[^"]+"\s*\/>/g, '')
      .replace(/<terminal_run>[\s\S]*?<\/terminal_run>/g, '')
      .trim();
  }

  // ==========================================================================
  // Chat / Streaming
  // ==========================================================================

  public async streamChat(
    messages: Array<{ role: string; content: string; images?: string[] }>,
    callbacks: AIAgentCallbacks
  ): Promise<void> {
    if (!this.isConfigured()) {
      callbacks.onError(new Error('AI Agent not configured. Please set up API key in extension settings.'));
      return;
    }

    if (this.isStreaming) {
      callbacks.onError(new Error('Already streaming'));
      return;
    }

    this.isStreaming = true;
    this.currentResponse = '';
    this.setStatus('thinking');

    // Add system prompt
    const messagesWithSystem = [
      { role: 'system', content: AGENTIC_SYSTEM_PROMPT },
      ...messages,
    ];

    try {
      // Try WebSocket streaming first
      if (this.config.streamingEnabled && socketService.isConnected()) {
        this.setStatus('streaming');
        socketService.streamAIChat(
          messagesWithSystem,
          this.config.provider,
          this.config.model,
          {
            onChunk: (content) => {
              this.currentResponse += content;
              callbacks.onToken(content);
            },
            onDone: () => {
              this.handleStreamComplete(callbacks);
            },
            onError: (error) => {
              this.handleStreamError(error, callbacks);
            },
          }
        );
      } else {
        // Fall back to REST API
        const result = await this.sendMessageREST(messagesWithSystem);
        this.currentResponse = result.response;
        
        // Emit tokens for display
        callbacks.onToken(result.response);
        this.handleStreamComplete(callbacks);
      }
    } catch (error: any) {
      this.handleStreamError(error.message || 'Unknown error', callbacks);
    }
  }

  private async sendMessageREST(
    messages: Array<{ role: string; content: string }>
  ): Promise<{ response: string }> {
    const API_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      ? 'https://api.maula.dev/api/v1'
      : 'http://localhost:4000/api/v1';

    const response = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        provider: this.config.provider,
        model: this.config.model,
        temperature: this.config.temperature,
        apiKey: this.config.apiKey, // Send API key if needed
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }

    const data = await response.json();
    return { response: data.response || '' };
  }

  private handleStreamComplete(callbacks: AIAgentCallbacks): void {
    this.isStreaming = false;
    this.setStatus('applying');

    // Parse file operations
    const operations = this.parseOperations(this.currentResponse);
    operations.forEach(op => callbacks.onFileOperation?.(op));

    // Parse terminal commands
    const commands = this.parseTerminalCommands(this.currentResponse);
    commands.forEach(cmd => callbacks.onTerminalCommand?.(cmd));

    // Return clean response
    const cleanedResponse = this.cleanResponse(this.currentResponse);
    callbacks.onComplete(cleanedResponse || this.currentResponse);

    this.setStatus('idle');
  }

  private handleStreamError(error: string, callbacks: AIAgentCallbacks): void {
    this.isStreaming = false;
    this.setStatus('error');
    callbacks.onError(new Error(error));
    
    // Reset to idle after a delay
    setTimeout(() => this.setStatus('idle'), 3000);
  }

  public cancelStream(): void {
    this.isStreaming = false;
    this.currentResponse = '';
    this.setStatus('idle');
  }

  public isCurrentlyStreaming(): boolean {
    return this.isStreaming;
  }

  // ==========================================================================
  // Extension Registration
  // ==========================================================================

  private registerExtension(): void {
    const extension: Extension = {
      id: 'ai-agent',
      name: 'AI Coding Agent',
      description: 'Intelligent AI assistant for code generation, editing, and project scaffolding',
      icon: '🤖',
      version: '2.0.0',
      category: 'AI',
      enabled: true,
      isBuiltIn: true,
      settings: {
        provider: this.config.provider,
        model: this.config.model,
        streaming: this.config.streamingEnabled,
      },
      commands: [
        {
          id: 'aiAgent.configure',
          name: 'Configure AI Agent',
          shortcut: 'Ctrl+Shift+A',
          handler: () => {
            extensionEvents.emit('aiAgent:openSettings');
          },
        },
        {
          id: 'aiAgent.chat',
          name: 'Open AI Chat',
          shortcut: 'Ctrl+Shift+I',
          handler: () => {
            extensionEvents.emit('aiAgent:openChat');
          },
        },
        {
          id: 'aiAgent.generateCode',
          name: 'Generate Code from Selection',
          handler: () => {
            extensionEvents.emit('aiAgent:generateFromSelection');
          },
        },
        {
          id: 'aiAgent.explainCode',
          name: 'Explain Selected Code',
          handler: () => {
            extensionEvents.emit('aiAgent:explainSelection');
          },
        },
        {
          id: 'aiAgent.refactorCode',
          name: 'Refactor Selected Code',
          handler: () => {
            extensionEvents.emit('aiAgent:refactorSelection');
          },
        },
        {
          id: 'aiAgent.fixErrors',
          name: 'Fix Errors in Code',
          handler: () => {
            extensionEvents.emit('aiAgent:fixErrors');
          },
        },
        {
          id: 'aiAgent.writeTests',
          name: 'Write Tests for Code',
          handler: () => {
            extensionEvents.emit('aiAgent:writeTests');
          },
        },
      ],
      actions: [
        {
          id: 'explain',
          label: 'Explain with AI',
          icon: '💡',
          context: 'editor',
          handler: () => extensionManager.executeCommand('aiAgent.explainCode'),
        },
        {
          id: 'refactor',
          label: 'Refactor with AI',
          icon: '🔧',
          context: 'editor',
          handler: () => extensionManager.executeCommand('aiAgent.refactorCode'),
        },
        {
          id: 'fix',
          label: 'Fix with AI',
          icon: '🩹',
          context: 'editor',
          handler: () => extensionManager.executeCommand('aiAgent.fixErrors'),
        },
        {
          id: 'test',
          label: 'Generate Tests',
          icon: '🧪',
          context: 'editor',
          handler: () => extensionManager.executeCommand('aiAgent.writeTests'),
        },
      ],
    };

    extensionManager.register(extension);
    console.log('🤖 AI Agent Extension registered');
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const aiAgentExtension = new AIAgentExtensionService();

// Also export for direct instantiation if needed
export { AIAgentExtensionService };
