/**
 * AI Full Control Panel Component
 * 
 * Advanced AI Assistant Panel with full control over:
 * - Terminal operations
 * - Project directory
 * - Build/Run/Deploy
 * - Git integrations
 * 
 * Similar to integrated backend API keys panel but with
 * extension-based AI integration for full IDE control.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStore } from '../store/useStore';
import { ChatMessage } from '../types';
import { voiceInput, voiceOutput, speechSupport } from '../services/speech';
import { aiAgentService, FileOperation } from '../services/aiAgent';
import { aiAgentExtension, AI_PROVIDERS, AIProvider } from '../services/aiAgentExtension';
import { aiFullControl, AI_FULL_CONTROL_SYSTEM_PROMPT } from '../services/aiFullControl';
import { socketService } from '../services/socket';
import { extensionEvents } from '../services/extensions';

interface AIFullControlPanelProps {
  voiceEnabled?: boolean;
  onFileOperation?: (operation: FileOperation) => void;
  onTerminalCommand?: (command: string) => void;
}

// Constants
const FILE_CONTENT_TRUNCATION_LIMIT = 2000;

export const AIFullControlPanel: React.FC<AIFullControlPanelProps> = ({
  voiceEnabled: externalVoiceEnabled = false,
  onFileOperation,
  onTerminalCommand,
}) => {
  const {
    chatHistory,
    addMessage,
    clearChat,
    aiConfig,
    isAiLoading,
    setAiLoading,
    openFiles,
    activeFileId,
    theme,
    createFile,
    createFolder,
    deleteNode,
    renameNode,
    files,
    openFile,
    currentProject,
  } = useStore();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  const [createdFiles, setCreatedFiles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'settings' | 'activity'>('chat');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(aiAgentExtension.getConfig().provider);
  const [selectedModel, setSelectedModel] = useState(aiAgentExtension.getConfig().model);
  const [apiKey, setApiKey] = useState('');
  const [executionLog, setExecutionLog] = useState<Array<{ type: string; message: string; timestamp: Date }>>([]);
  
  // Permission levels
  const [permissions, setPermissions] = useState({
    terminal: true,
    fileOperations: true,
    build: true,
    deploy: true,
    git: true,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeFile = openFiles.find(f => f.id === activeFileId);

  // Theme classes
  const bgClass = theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50';
  const borderClass = theme === 'dark' ? 'border-slate-700' : 'border-gray-200';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedTextClass = theme === 'dark' ? 'text-slate-400' : 'text-gray-500';
  const inputBgClass = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300';
  const panelBgClass = theme === 'dark' ? 'bg-slate-800' : 'bg-white';

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, streamingContent]);

  // Connect to socket on mount
  useEffect(() => {
    const connect = async () => {
      setConnectionStatus('connecting');
      try {
        await socketService.connect();
        setConnectionStatus('connected');
      } catch (err) {
        console.error('Socket connection failed:', err);
        setConnectionStatus('disconnected');
      }
    };

    connect();
  }, []);

  // Update full control config based on permissions
  useEffect(() => {
    aiFullControl.updateConfig({
      terminalEnabled: permissions.terminal,
      fileOperationsEnabled: permissions.fileOperations,
      buildEnabled: permissions.build,
      deployEnabled: permissions.deploy,
      gitEnabled: permissions.git,
    });
  }, [permissions]);

  // Set up callbacks for execution logging
  useEffect(() => {
    aiFullControl.setCallbacks({
      onTerminalOutput: (output) => {
        addExecutionLog('terminal', `Terminal output: ${output.substring(0, 100)}...`);
      },
      onFileOperation: (result) => {
        addExecutionLog('file', `${result.operation}: ${result.path} - ${result.success ? 'Success' : result.error}`);
      },
      onBuildProgress: (status) => {
        addExecutionLog('build', status);
      },
      onDeployProgress: (status) => {
        addExecutionLog('deploy', status);
      },
      onGitOperation: (result) => {
        addExecutionLog('git', `${result.operation} - ${result.success ? 'Success' : result.error}`);
      },
    });
  }, []);

  const addExecutionLog = (type: string, message: string) => {
    setExecutionLog(prev => [...prev.slice(-50), { type, message, timestamp: new Date() }]);
  };

  // Handle file operation from AI
  const handleFileOperation = useCallback((operation: FileOperation) => {
    console.log('[AI Full Control] File operation:', operation);
    addExecutionLog('file', `${operation.type}: ${operation.path}`);

    if (onFileOperation) {
      onFileOperation(operation);
    } else {
      // Default handler - create/edit files in store
      if (operation.type === 'create' || operation.type === 'edit') {
        const pathParts = operation.path.split('/');
        const fileName = pathParts.pop() || operation.path;
        const parentPath = pathParts.length > 0 ? pathParts.join('/') : '';

        // Create parent folders if they don't exist
        if (parentPath) {
          const folderParts = parentPath.split('/');
          let currentPath = '';
          for (const folder of folderParts) {
            const folderPath = currentPath ? `${currentPath}/${folder}` : folder;
            const folderExists = files.some(f => f.path === folderPath && f.type === 'folder');
            if (!folderExists) {
              createFolder(currentPath, folder);
            }
            currentPath = folderPath;
          }
        }

        // Determine language from extension
        const ext = fileName.split('.').pop() || '';
        const languageMap: Record<string, string> = {
          'ts': 'typescript', 'tsx': 'typescript', 'js': 'javascript', 'jsx': 'javascript',
          'py': 'python', 'html': 'html', 'css': 'css', 'json': 'json',
          'md': 'markdown', 'yml': 'yaml', 'yaml': 'yaml', 'sh': 'bash', 'env': 'plaintext',
        };
        const language = languageMap[ext] || 'plaintext';

        createFile(parentPath, fileName, operation.content);
        setCreatedFiles(prev => [...prev, operation.path]);

        const fileId = crypto.randomUUID();
        openFile({
          id: fileId,
          name: fileName,
          path: operation.path,
          content: operation.content || '',
          language,
          isDirty: false,
        });
      } else if (operation.type === 'delete') {
        deleteNode(operation.path);
      } else if (operation.type === 'rename' && operation.newName) {
        renameNode(operation.path, operation.newName);
      }
    }
  }, [onFileOperation, createFile, createFolder, deleteNode, renameNode, openFile, files]);

  // Handle terminal command from AI
  const handleTerminalCommand = useCallback(async (command: string) => {
    console.log('[AI Full Control] Terminal command:', command);
    addExecutionLog('terminal', `Executing: ${command}`);

    if (onTerminalCommand) {
      onTerminalCommand(command);
    }

    // Also execute via full control service if enabled
    if (permissions.terminal) {
      try {
        const result = await aiFullControl.executeCommand(command);
        addExecutionLog('terminal', `Exit code: ${result.exitCode}`);
      } catch (error: any) {
        addExecutionLog('error', error.message);
      }
    }
  }, [onTerminalCommand, permissions.terminal]);

  // Voice input handler
  const handleVoiceInput = async () => {
    if (!speechSupport.recognition) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      voiceInput.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    voiceInput.start({
      onResult: (result) => {
        setInput(prev => result.isFinal ? result.transcript : prev);
      },
      onError: () => setIsListening(false),
      onEnd: () => setIsListening(false),
    }, { continuous: true, interimResults: true });
  };

  // Send message with streaming
  const handleSend = async () => {
    if (!input.trim() || isAiLoading || isStreaming) return;

    const attachments: ChatMessage['attachments'] = [];
    if (activeFile) {
      attachments.push({
        type: 'code',
        name: activeFile.name,
        content: activeFile.content,
      });
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    addMessage(userMessage);
    setInput('');
    setAiLoading(true);
    setIsStreaming(true);
    setStreamingContent('');

    try {
      let fullMessage = input;
      if (activeFile) {
        fullMessage += `\n\n[Current file: ${activeFile.name}]\n\`\`\`${activeFile.language}\n${activeFile.content}\n\`\`\``;
      }

      if (files.length > 0) {
        const projectContext = files.map(f => {
          if (f.type === 'file' && f.content) {
            const truncatedContent = f.content.length > FILE_CONTENT_TRUNCATION_LIMIT
              ? f.content.substring(0, FILE_CONTENT_TRUNCATION_LIMIT) + '\n... (truncated)'
              : f.content;
            return `[File: ${f.path}]\n\`\`\`\n${truncatedContent}\n\`\`\``;
          }
          return f.type === 'folder' ? `[Folder: ${f.path}]` : `[File: ${f.path}]`;
        }).join('\n\n');
        fullMessage += `\n\n--- EXISTING PROJECT FILES ---\n${projectContext}\n--- END PROJECT FILES ---`;
      }

      // Add permission context using helper function
      const permissionItems = [
        { name: 'Terminal', enabled: permissions.terminal },
        { name: 'File Operations', enabled: permissions.fileOperations },
        { name: 'Build/Run', enabled: permissions.build },
        { name: 'Deploy', enabled: permissions.deploy },
        { name: 'Git', enabled: permissions.git },
      ];
      const permissionLines = permissionItems
        .map(p => `${p.name}: ${p.enabled ? 'ENABLED' : 'DISABLED'}`)
        .join('\n');
      const permissionContext = `\n\n--- AI PERMISSIONS ---\n${permissionLines}\n--- END PERMISSIONS ---`;
      
      fullMessage += permissionContext;

      const messagesForAI = [
        ...chatHistory.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user' as const, content: fullMessage },
      ];

      if (socketService.isConnected()) {
        await new Promise<void>((resolve, reject) => {
          let fullResponse = '';

          const cleanForDisplay = (text: string): string => {
            return aiFullControl.cleanResponse(text);
          };

          aiAgentService.streamChat(
            messagesForAI,
            {
              onToken: (token) => {
                fullResponse += token;
                setStreamingContent(cleanForDisplay(fullResponse));
              },
              onComplete: async (response) => {
                setStreamingContent('');
                setIsStreaming(false);

                // Parse and execute full control operations
                const operations = aiFullControl.parseOperations(response);
                
                // Log operations
                addExecutionLog('info', `Parsed ${operations.fileOperations.length} file ops, ${operations.terminalCommands.length} terminal ops, ${operations.gitOperations.length} git ops`);

                // Execute file operations via handler
                operations.fileOperations.forEach(op => {
                  if (op.type === 'create' || op.type === 'edit') {
                    handleFileOperation({
                      type: op.type,
                      path: op.path,
                      content: op.content,
                    });
                  } else if (op.type === 'delete') {
                    handleFileOperation({
                      type: 'delete',
                      path: op.path,
                    });
                  }
                });

                // Execute terminal commands
                for (const cmd of operations.terminalCommands) {
                  if (cmd.type === 'run' && cmd.command) {
                    await handleTerminalCommand(cmd.command);
                  } else if (cmd.type === 'sequence' && cmd.commands) {
                    for (const c of cmd.commands) {
                      await handleTerminalCommand(c);
                    }
                  }
                }

                // Execute git operations
                for (const gitOp of operations.gitOperations) {
                  addExecutionLog('git', `Executing: ${gitOp.type}`);
                  switch (gitOp.type) {
                    case 'init':
                      await aiFullControl.gitInit();
                      break;
                    case 'add':
                      await aiFullControl.gitAdd(gitOp.args.path);
                      break;
                    case 'commit':
                      await aiFullControl.gitCommit(gitOp.args.message);
                      break;
                    case 'push':
                      await aiFullControl.gitPush(gitOp.args.remote, gitOp.args.branch);
                      break;
                  }
                }

                // Execute build operations
                for (const buildOp of operations.buildOperations) {
                  addExecutionLog('build', `Executing: ${buildOp.type}`);
                  switch (buildOp.type) {
                    case 'build':
                      await aiFullControl.runBuild(buildOp.command);
                      break;
                    case 'test':
                      await aiFullControl.runTests(buildOp.pattern);
                      break;
                    case 'dev':
                      await aiFullControl.runDev();
                      break;
                  }
                }

                const assistantMessage: ChatMessage = {
                  id: crypto.randomUUID(),
                  role: 'assistant',
                  content: cleanForDisplay(response) || response,
                  timestamp: Date.now(),
                };
                addMessage(assistantMessage);

                resolve();
              },
              onError: (error) => reject(error),
              onFileOperation: handleFileOperation,
              onTerminalCommand: handleTerminalCommand,
            },
            selectedProvider,
            selectedModel
          );
        });
      } else {
        const result = await aiAgentService.sendMessage(messagesForAI, selectedProvider, selectedModel);
        result.operations.forEach(handleFileOperation);
        result.commands.forEach(handleTerminalCommand);

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: result.response,
          timestamp: Date.now(),
        };
        addMessage(assistantMessage);
      }
    } catch (error) {
      console.error('AI error:', error);
      setStreamingContent('');
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `❌ Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        timestamp: Date.now(),
      };
      addMessage(errorMessage);
    } finally {
      setAiLoading(false);
      setIsStreaming(false);
      setCreatedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      aiAgentExtension.setApiKey(selectedProvider, apiKey);
      setShowApiKeyInput(false);
      setApiKey('');
    }
  };

  const handleProviderChange = (provider: AIProvider) => {
    setSelectedProvider(provider);
    aiAgentExtension.setProvider(provider);
    const providerInfo = AI_PROVIDERS.find(p => p.id === provider);
    if (providerInfo && providerInfo.models.length > 0) {
      setSelectedModel(providerInfo.models[0]);
    }
  };

  const currentProviderInfo = AI_PROVIDERS.find(p => p.id === selectedProvider);
  const hasApiKey = !!aiAgentExtension.getApiKey(selectedProvider);

  // Quick actions
  const quickActions = [
    { label: '✨ Generate', prompt: 'Generate code for: ' },
    { label: '🏗️ Build App', prompt: 'Build a complete app: ' },
    { label: '🔧 Fix Error', prompt: 'Fix this error: ' },
    { label: '📝 Explain', prompt: 'Explain this code: ' },
    { label: '🚀 Deploy', prompt: 'Deploy this project' },
    { label: '📦 Git Commit', prompt: 'Commit all changes with message: ' },
    { label: '🧪 Run Tests', prompt: 'Run all tests' },
    { label: '🔨 Build', prompt: 'Build the project' },
  ];

  // Render markdown content
  const renderContent = (content: string) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children }) {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match;

          if (isInline) {
            return (
              <code className={`${theme === 'dark' ? 'bg-slate-600' : 'bg-gray-200'} px-1 py-0.5 rounded text-sm`}>
                {children}
              </code>
            );
          }

          return (
            <div className={`relative mt-2 rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <div className={`flex items-center justify-between px-3 py-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'} text-xs`}>
                <span className={mutedTextClass}>{match[1]}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(String(children))}
                  className={`${mutedTextClass} hover:text-white transition-colors`}
                >
                  📋 Copy
                </button>
              </div>
              <pre className="p-3 overflow-x-auto text-sm">
                <code className={className}>{children}</code>
              </pre>
            </div>
          );
        },
        p({ children }) {
          return <p className="mb-2 leading-relaxed">{children}</p>;
        },
        ul({ children }) {
          return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div className={`flex flex-col h-full ${bgClass}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${borderClass}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className={`font-semibold ${textClass}`}>AI Full Control</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            connectionStatus === 'connected'
              ? 'bg-green-500/20 text-green-400'
              : connectionStatus === 'connecting'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-red-500/20 text-red-400'
          }`}>
            {connectionStatus === 'connected' ? '● Live' : connectionStatus === 'connecting' ? '○ Connecting...' : '○ Offline'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${activeTab === 'chat' ? 'bg-indigo-600 text-white' : mutedTextClass + ' hover:bg-slate-700'}`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : mutedTextClass + ' hover:bg-slate-700'}`}
          >
            ⚙️ Settings
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${activeTab === 'activity' ? 'bg-indigo-600 text-white' : mutedTextClass + ' hover:bg-slate-700'}`}
          >
            📊 Activity
          </button>
          <button
            onClick={clearChat}
            className={`p-2 rounded-lg transition-colors ${mutedTextClass} hover:bg-slate-700 hover:text-white ml-2`}
            title="Clear Chat"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'chat' && (
        <>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.length === 0 && !streamingContent ? (
              <div className={`text-center py-12 ${mutedTextClass}`}>
                <div className="text-5xl mb-4">🤖</div>
                <p className="text-base font-medium">AI Full Control Ready</p>
                <p className="text-sm mt-2 opacity-70">Full access to terminal, files, build, deploy, and git</p>
                
                {/* Provider Status */}
                <div className={`mt-4 p-3 rounded-lg ${panelBgClass} border ${borderClass} max-w-sm mx-auto`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{currentProviderInfo?.icon} {currentProviderInfo?.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${hasApiKey ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {hasApiKey ? '✓ Configured' : 'No API Key'}
                    </span>
                  </div>
                  {!hasApiKey && (
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Configure API Key →
                    </button>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {quickActions.slice(0, 4).map((action) => (
                    <button
                      key={action.label}
                      onClick={() => setInput(action.prompt)}
                      className={`px-3 py-1.5 text-xs rounded-full ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {chatHistory.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm
                      ${message.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                      {message.role === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3
                      ${message.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : theme === 'dark' ? 'bg-slate-700 text-slate-100 rounded-bl-sm' : 'bg-gray-200 text-gray-800 rounded-bl-sm'}`}>
                      <div className="text-sm">
                        {message.role === 'user' ? (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        ) : (
                          renderContent(message.content)
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Streaming response */}
                {streamingContent && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm">
                      🤖
                    </div>
                    <div className={`max-w-[85%] ${theme === 'dark' ? 'bg-slate-700 text-slate-100' : 'bg-gray-200 text-gray-800'} rounded-2xl rounded-bl-sm px-4 py-3`}>
                      <div className="text-sm">
                        {renderContent(streamingContent)}
                        <span className="inline-block w-2 h-4 ml-1 bg-emerald-500 animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Created files indicator */}
                {createdFiles.length > 0 && (
                  <div className={`mx-4 p-3 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-emerald-500">📁</span>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        Files Created ({createdFiles.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {createdFiles.map((file, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-1 rounded-md ${theme === 'dark' ? 'bg-slate-700 text-emerald-300' : 'bg-white text-emerald-700 border border-emerald-200'}`}
                        >
                          {file}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {isAiLoading && !streamingContent && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm">
                  🤖
                </div>
                <div className={`${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200'} rounded-2xl rounded-bl-sm px-4 py-3`}>
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-slate-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
                    <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-slate-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
                    <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-slate-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Bar */}
          <div className={`px-4 py-2 border-t ${borderClass} overflow-x-auto`}>
            <div className="flex gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => setInput(action.prompt)}
                  className={`px-2 py-1 text-xs rounded-lg whitespace-nowrap ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Context indicator */}
          {activeFile && (
            <div className={`px-4 py-2 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-100 border-gray-200'} border-t`}>
              <div className={`flex items-center gap-3 text-xs ${mutedTextClass}`}>
                <span className="flex items-center gap-1">
                  <span>📎</span>
                  <span className="text-indigo-500 font-medium">{activeFile.name}</span>
                </span>
              </div>
            </div>
          )}

          {/* Input */}
          <div className={`p-4 border-t ${borderClass}`}>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "🎤 Listening..." : "Ask AI to build, edit, deploy, or do anything..."}
                  rows={3}
                  disabled={isStreaming}
                  className={`w-full px-4 py-3 ${inputBgClass} border ${borderClass} rounded-xl ${textClass} text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${isListening ? 'border-red-500 animate-pulse' : ''} disabled:opacity-50`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isAiLoading || isStreaming}
                  className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                  title="Send"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
                <button
                  onClick={handleVoiceInput}
                  className={`p-3 rounded-xl transition-colors ${isListening ? 'bg-red-600 text-white animate-pulse' : theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700'}`}
                  title={isListening ? "Stop Listening" : "Voice Input"}
                >
                  🎤
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Provider Selection */}
          <div>
            <h3 className={`text-sm font-medium ${textClass} mb-3`}>AI Provider</h3>
            <div className="grid grid-cols-2 gap-2">
              {AI_PROVIDERS.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => handleProviderChange(provider.id)}
                  className={`p-3 rounded-lg text-left transition-all border-2 ${
                    selectedProvider === provider.id
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : `${borderClass} ${panelBgClass} hover:border-indigo-500/50`
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{provider.icon}</span>
                    <span className={`text-sm font-medium ${textClass}`}>{provider.name}</span>
                  </div>
                  <p className={`text-xs ${mutedTextClass} line-clamp-1`}>{provider.description}</p>
                  {aiAgentExtension.getApiKey(provider.id) && (
                    <span className="text-xs text-green-400 mt-1 block">✓ Configured</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* API Key Configuration */}
          {currentProviderInfo?.requiresApiKey && (
            <div className={`p-4 rounded-lg ${panelBgClass} border ${borderClass}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-medium ${textClass}`}>{currentProviderInfo.name} API Key</h3>
                {currentProviderInfo.apiKeyUrl && (
                  <a
                    href={currentProviderInfo.apiKeyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Get API Key →
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API key..."
                  className={`flex-1 px-3 py-2 ${inputBgClass} border ${borderClass} rounded-lg text-sm ${textClass}`}
                />
                <button
                  onClick={handleSaveApiKey}
                  disabled={!apiKey.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
              {hasApiKey && (
                <p className="text-xs text-green-400 mt-2">✓ API key configured</p>
              )}
            </div>
          )}

          {/* Model Selection */}
          {currentProviderInfo && (
            <div>
              <h3 className={`text-sm font-medium ${textClass} mb-2`}>Model</h3>
              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  aiAgentExtension.setModel(e.target.value);
                }}
                className={`w-full px-3 py-2 ${inputBgClass} border ${borderClass} rounded-lg text-sm ${textClass}`}
              >
                {currentProviderInfo.models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          )}

          {/* Permissions */}
          <div>
            <h3 className={`text-sm font-medium ${textClass} mb-3`}>AI Permissions</h3>
            <div className="space-y-3">
              {[
                { key: 'terminal', label: 'Terminal Access', icon: '💻', desc: 'Execute terminal commands' },
                { key: 'fileOperations', label: 'File Operations', icon: '📁', desc: 'Create, edit, delete files' },
                { key: 'build', label: 'Build & Run', icon: '🔨', desc: 'Build, test, and run code' },
                { key: 'deploy', label: 'Deploy', icon: '🚀', desc: 'Deploy to platforms' },
                { key: 'git', label: 'Git Operations', icon: '📦', desc: 'Git version control' },
              ].map(perm => (
                <div key={perm.key} className={`flex items-center justify-between p-3 rounded-lg ${panelBgClass} border ${borderClass}`}>
                  <div className="flex items-center gap-3">
                    <span>{perm.icon}</span>
                    <div>
                      <p className={`text-sm font-medium ${textClass}`}>{perm.label}</p>
                      <p className={`text-xs ${mutedTextClass}`}>{perm.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPermissions(p => ({ ...p, [perm.key]: !p[perm.key as keyof typeof permissions] }))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      permissions[perm.key as keyof typeof permissions] ? 'bg-indigo-600' : 'bg-slate-600'
                    }`}
                  >
                    <span className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                      permissions[perm.key as keyof typeof permissions] ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${textClass}`}>Execution Log</h3>
            <button
              onClick={() => setExecutionLog([])}
              className={`text-xs ${mutedTextClass} hover:text-red-400`}
            >
              Clear
            </button>
          </div>
          {executionLog.length === 0 ? (
            <div className={`text-center py-8 ${mutedTextClass}`}>
              <span className="text-3xl block mb-2">📊</span>
              <p className="text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {executionLog.map((log, idx) => (
                <div key={idx} className={`p-2 rounded-lg ${panelBgClass} border ${borderClass}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">
                      {log.type === 'terminal' && '💻'}
                      {log.type === 'file' && '📄'}
                      {log.type === 'build' && '🔨'}
                      {log.type === 'deploy' && '🚀'}
                      {log.type === 'git' && '📦'}
                      {log.type === 'info' && 'ℹ️'}
                      {log.type === 'error' && '❌'}
                    </span>
                    <span className={`text-xs ${mutedTextClass}`}>
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className={`text-xs ${textClass} font-mono truncate`}>{log.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIFullControlPanel;
