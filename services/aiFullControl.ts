/**
 * AI Full Control Service
 * 
 * Provides the AI Agent with comprehensive control over:
 * - Terminal operations (execute commands, interactive sessions)
 * - Project directory (create, modify, edit, delete files/folders)
 * - Build and run operations
 * - Deployment integrations (Vercel, etc.)
 * - Git operations (full version control)
 * 
 * This service acts as a unified interface for AI to perform
 * all development operations through the extension system.
 */

import { extensionEvents, extensionAPI } from './extensions';
import { socketService } from './socket';
import { terminalService } from './terminal';
import { gitService } from './git';
import { vercelDeploy, quickDeploy, DeploymentResult } from './deploy';
import { filesApiService } from './filesApi';

// =============================================================================
// Types
// =============================================================================

export interface TerminalCommandResult {
  success: boolean;
  output: string;
  exitCode: number;
  duration: number;
}

export interface FileOperationResult {
  success: boolean;
  path: string;
  operation: 'create' | 'edit' | 'delete' | 'rename' | 'read';
  error?: string;
}

export interface GitOperationResult {
  success: boolean;
  operation: string;
  data?: any;
  error?: string;
}

export interface BuildResult {
  success: boolean;
  output: string;
  errors?: string[];
  warnings?: string[];
  duration: number;
}

export interface DeployResult {
  success: boolean;
  url?: string;
  deploymentId?: string;
  state?: string;
  error?: string;
}

export interface AIFullControlConfig {
  terminalEnabled: boolean;
  fileOperationsEnabled: boolean;
  buildEnabled: boolean;
  deployEnabled: boolean;
  gitEnabled: boolean;
  autoExecuteCommands: boolean;
  maxCommandTimeout: number;
  projectPath?: string;
  vercelToken?: string;
}

export interface AIControlCallbacks {
  onTerminalOutput?: (output: string) => void;
  onFileOperation?: (result: FileOperationResult) => void;
  onBuildProgress?: (status: string) => void;
  onDeployProgress?: (status: string) => void;
  onGitOperation?: (result: GitOperationResult) => void;
  onError?: (error: string) => void;
}

// =============================================================================
// Enhanced System Prompt with Full Control
// =============================================================================

export const AI_FULL_CONTROL_SYSTEM_PROMPT = `You are an expert AI coding assistant in the "AI Digital Friend Zone" IDE with FULL ACCESS and CONTROL over:

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

### Delete a folder:
<folder_delete path="src/deprecated" />

## 🔨 BUILD & RUN OPERATIONS
Control over build, test, and run commands:

### Run build:
<build />

### Run with custom command:
<build command="npm run build:prod" />

### Run tests:
<test />

### Run specific tests:
<test pattern="*.spec.ts" />

### Run the application:
<run command="npm start" />

### Run in development mode:
<dev />

## 🚀 DEPLOYMENT OPERATIONS
Deploy to various platforms:

### Deploy to Vercel:
<deploy platform="vercel" project="my-app" />

### Deploy with environment variables:
<deploy platform="vercel" project="my-app">
  <env name="API_URL" value="https://api.example.com" />
</deploy>

## 📦 GIT OPERATIONS
Full version control access:

### Initialize a repository:
<git_init />

### Check status:
<git_status />

### Stage files:
<git_add path="." />

### Stage specific file:
<git_add path="src/App.tsx" />

### Commit changes:
<git_commit message="feat: add new feature" />

### Create branch:
<git_branch name="feature/new-feature" checkout="true" />

### Switch branch:
<git_checkout branch="main" />

### Push changes:
<git_push remote="origin" branch="main" />

### Pull changes:
<git_pull remote="origin" branch="main" />

### View commit log:
<git_log depth="10" />

### View diff:
<git_diff file="src/App.tsx" />

## 📋 GUIDELINES

1. **Complete Code**: Always provide COMPLETE, working code - never use placeholders
2. **Best Practices**: Follow language/framework best practices
3. **Dependencies**: Install required dependencies before using them
4. **Error Handling**: Add proper error handling
5. **Testing**: Include tests when appropriate
6. **Documentation**: Add comments for complex logic
7. **Git Workflow**: Commit often with meaningful messages
8. **Security**: Never expose secrets or credentials

## 🎯 WORKFLOW EXAMPLES

### Creating a new React component:
1. Create the component file
2. Add tests
3. Update exports
4. Git add and commit

### Setting up a new project:
1. Initialize git
2. Create package.json with dependencies
3. Install dependencies via terminal
4. Create initial file structure
5. Run initial build to verify

### Deploying an application:
1. Run tests
2. Build for production
3. Git commit changes
4. Deploy to platform
5. Verify deployment URL

When the user asks to build something, create ALL necessary files and execute ALL required commands to make it fully functional.`;

// =============================================================================
// AI Full Control Service Class
// =============================================================================

class AIFullControlService {
  private config: AIFullControlConfig;
  private callbacks: AIControlCallbacks = {};
  private activeProcesses: Map<string, string> = new Map(); // name -> terminalId
  private commandHistory: Array<{ command: string; result: TerminalCommandResult }> = [];

  constructor() {
    this.config = this.loadConfig();
    this.setupEventListeners();
  }

  // ==========================================================================
  // Configuration
  // ==========================================================================

  private loadConfig(): AIFullControlConfig {
    const saved = localStorage.getItem('aiFullControl:config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall through to defaults
      }
    }

    return {
      terminalEnabled: true,
      fileOperationsEnabled: true,
      buildEnabled: true,
      deployEnabled: true,
      gitEnabled: true,
      autoExecuteCommands: false,
      maxCommandTimeout: 60000,
    };
  }

  private saveConfig(): void {
    localStorage.setItem('aiFullControl:config', JSON.stringify(this.config));
  }

  public getConfig(): AIFullControlConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<AIFullControlConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
    extensionEvents.emit('aiFullControl:configChanged', this.config);
  }

  public setCallbacks(callbacks: AIControlCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  private setupEventListeners(): void {
    // Listen for terminal output from socket
    socketService.onTerminalOutput((data) => {
      this.callbacks.onTerminalOutput?.(data.data);
    });
  }

  // ==========================================================================
  // Terminal Operations
  // ==========================================================================

  /**
   * Execute a terminal command and return the result
   */
  async executeCommand(command: string, cwd?: string): Promise<TerminalCommandResult> {
    if (!this.config.terminalEnabled) {
      return {
        success: false,
        output: 'Terminal operations are disabled',
        exitCode: -1,
        duration: 0,
      };
    }

    const startTime = Date.now();
    
    try {
      // Create a terminal session
      const session = await terminalService.createSession({
        type: 'remote',
        cwd: cwd || this.config.projectPath,
      });

      // Execute command and capture output
      const result = await terminalService.executeCommand(session.id, command);
      
      const terminalResult: TerminalCommandResult = {
        success: result.exitCode === 0,
        output: result.output,
        exitCode: result.exitCode,
        duration: Date.now() - startTime,
      };

      // Close session
      await terminalService.closeSession(session.id);

      // Add to history
      this.commandHistory.push({ command, result: terminalResult });

      this.callbacks.onTerminalOutput?.(result.output);
      extensionEvents.emit('aiFullControl:commandExecuted', { command, result: terminalResult });

      return terminalResult;
    } catch (error: any) {
      return {
        success: false,
        output: error.message,
        exitCode: -1,
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Execute multiple commands sequentially
   */
  async executeCommands(commands: string[]): Promise<TerminalCommandResult[]> {
    const results: TerminalCommandResult[] = [];
    
    for (const command of commands) {
      const result = await this.executeCommand(command);
      results.push(result);
      
      // Stop if a command fails
      if (!result.success) {
        break;
      }
    }

    return results;
  }

  /**
   * Start a long-running process
   */
  async startProcess(name: string, command: string): Promise<{ success: boolean; terminalId?: string }> {
    if (this.activeProcesses.has(name)) {
      return { success: false };
    }

    try {
      const session = await terminalService.createSession({
        name: `AI: ${name}`,
        type: 'remote',
        cwd: this.config.projectPath,
      });

      terminalService.write(session.id, `${command}\n`);
      this.activeProcesses.set(name, session.id);

      extensionEvents.emit('aiFullControl:processStarted', { name, terminalId: session.id });

      return { success: true, terminalId: session.id };
    } catch (error) {
      return { success: false };
    }
  }

  /**
   * Stop a running process
   */
  async stopProcess(name: string): Promise<boolean> {
    const terminalId = this.activeProcesses.get(name);
    if (!terminalId) {
      return false;
    }

    await terminalService.closeSession(terminalId);
    this.activeProcesses.delete(name);

    extensionEvents.emit('aiFullControl:processStopped', { name });

    return true;
  }

  /**
   * Get all active processes
   */
  getActiveProcesses(): Map<string, string> {
    return new Map(this.activeProcesses);
  }

  // ==========================================================================
  // File Operations
  // ==========================================================================

  /**
   * Create a new file
   */
  async createFile(path: string, content: string): Promise<FileOperationResult> {
    if (!this.config.fileOperationsEnabled) {
      return {
        success: false,
        path,
        operation: 'create',
        error: 'File operations are disabled',
      };
    }

    try {
      extensionEvents.emit('file:write', path, content);
      this.callbacks.onFileOperation?.({
        success: true,
        path,
        operation: 'create',
      });
      return { success: true, path, operation: 'create' };
    } catch (error: any) {
      return {
        success: false,
        path,
        operation: 'create',
        error: error.message,
      };
    }
  }

  /**
   * Edit an existing file
   */
  async editFile(path: string, content: string): Promise<FileOperationResult> {
    if (!this.config.fileOperationsEnabled) {
      return {
        success: false,
        path,
        operation: 'edit',
        error: 'File operations are disabled',
      };
    }

    try {
      extensionEvents.emit('file:write', path, content);
      this.callbacks.onFileOperation?.({
        success: true,
        path,
        operation: 'edit',
      });
      return { success: true, path, operation: 'edit' };
    } catch (error: any) {
      return {
        success: false,
        path,
        operation: 'edit',
        error: error.message,
      };
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(path: string): Promise<FileOperationResult> {
    if (!this.config.fileOperationsEnabled) {
      return {
        success: false,
        path,
        operation: 'delete',
        error: 'File operations are disabled',
      };
    }

    try {
      extensionEvents.emit('file:delete', path);
      this.callbacks.onFileOperation?.({
        success: true,
        path,
        operation: 'delete',
      });
      return { success: true, path, operation: 'delete' };
    } catch (error: any) {
      return {
        success: false,
        path,
        operation: 'delete',
        error: error.message,
      };
    }
  }

  /**
   * Rename a file
   */
  async renameFile(oldPath: string, newPath: string): Promise<FileOperationResult> {
    if (!this.config.fileOperationsEnabled) {
      return {
        success: false,
        path: oldPath,
        operation: 'rename',
        error: 'File operations are disabled',
      };
    }

    try {
      extensionEvents.emit('file:rename', oldPath, newPath);
      this.callbacks.onFileOperation?.({
        success: true,
        path: oldPath,
        operation: 'rename',
      });
      return { success: true, path: oldPath, operation: 'rename' };
    } catch (error: any) {
      return {
        success: false,
        path: oldPath,
        operation: 'rename',
        error: error.message,
      };
    }
  }

  /**
   * Create a folder
   */
  async createFolder(path: string): Promise<FileOperationResult> {
    if (!this.config.fileOperationsEnabled) {
      return {
        success: false,
        path,
        operation: 'create',
        error: 'File operations are disabled',
      };
    }

    try {
      extensionEvents.emit('folder:create', path);
      return { success: true, path, operation: 'create' };
    } catch (error: any) {
      return {
        success: false,
        path,
        operation: 'create',
        error: error.message,
      };
    }
  }

  // ==========================================================================
  // Build & Run Operations
  // ==========================================================================

  /**
   * Run build command
   */
  async runBuild(command?: string): Promise<BuildResult> {
    if (!this.config.buildEnabled) {
      return {
        success: false,
        output: 'Build operations are disabled',
        duration: 0,
      };
    }

    this.callbacks.onBuildProgress?.('Starting build...');

    const buildCommand = command || 'npm run build';
    const startTime = Date.now();
    const result = await this.executeCommand(buildCommand);

    const buildResult: BuildResult = {
      success: result.success,
      output: result.output,
      duration: Date.now() - startTime,
      errors: result.success ? undefined : [result.output],
    };

    this.callbacks.onBuildProgress?.(result.success ? 'Build completed!' : 'Build failed');
    extensionEvents.emit('aiFullControl:buildCompleted', buildResult);

    return buildResult;
  }

  /**
   * Run tests
   */
  async runTests(pattern?: string): Promise<BuildResult> {
    const testCommand = pattern ? `npm test -- ${pattern}` : 'npm test';
    const result = await this.executeCommand(testCommand);

    return {
      success: result.success,
      output: result.output,
      duration: result.duration,
    };
  }

  /**
   * Run development server
   */
  async runDev(): Promise<{ success: boolean; terminalId?: string }> {
    return this.startProcess('dev', 'npm run dev');
  }

  /**
   * Run application
   */
  async runApp(command?: string): Promise<{ success: boolean; terminalId?: string }> {
    return this.startProcess('app', command || 'npm start');
  }

  // ==========================================================================
  // Deployment Operations
  // ==========================================================================

  /**
   * Deploy to Vercel
   */
  async deployToVercel(
    projectName: string,
    files: Record<string, string>,
    options?: { waitForReady?: boolean }
  ): Promise<DeployResult> {
    if (!this.config.deployEnabled) {
      return {
        success: false,
        error: 'Deployment operations are disabled',
      };
    }

    const token = this.config.vercelToken || localStorage.getItem('vercelToken');
    if (!token) {
      return {
        success: false,
        error: 'Vercel token not configured',
      };
    }

    try {
      this.callbacks.onDeployProgress?.('Preparing deployment...');

      const deployment = await quickDeploy(files, projectName, token, {
        waitForReady: options?.waitForReady ?? true,
        onProgress: (status) => this.callbacks.onDeployProgress?.(status),
      });

      this.callbacks.onDeployProgress?.('Deployment successful!');
      extensionEvents.emit('aiFullControl:deployCompleted', deployment);

      return {
        success: true,
        url: deployment.readyUrl || `https://${deployment.url}`,
        deploymentId: deployment.id,
        state: deployment.state,
      };
    } catch (error: any) {
      this.callbacks.onDeployProgress?.('Deployment failed');
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // ==========================================================================
  // Git Operations
  // ==========================================================================

  /**
   * Initialize git repository
   */
  async gitInit(): Promise<GitOperationResult> {
    if (!this.config.gitEnabled) {
      return { success: false, operation: 'init', error: 'Git operations are disabled' };
    }

    try {
      await gitService.init();
      this.callbacks.onGitOperation?.({ success: true, operation: 'init' });
      return { success: true, operation: 'init' };
    } catch (error: any) {
      return { success: false, operation: 'init', error: error.message };
    }
  }

  /**
   * Get git status
   */
  async gitStatus(): Promise<GitOperationResult> {
    if (!this.config.gitEnabled) {
      return { success: false, operation: 'status', error: 'Git operations are disabled' };
    }

    try {
      const status = await gitService.status();
      this.callbacks.onGitOperation?.({ success: true, operation: 'status', data: status });
      return { success: true, operation: 'status', data: status };
    } catch (error: any) {
      return { success: false, operation: 'status', error: error.message };
    }
  }

  /**
   * Stage files
   */
  async gitAdd(path?: string): Promise<GitOperationResult> {
    if (!this.config.gitEnabled) {
      return { success: false, operation: 'add', error: 'Git operations are disabled' };
    }

    try {
      if (path === '.' || !path) {
        await gitService.addAll();
      } else {
        await gitService.add(path);
      }
      this.callbacks.onGitOperation?.({ success: true, operation: 'add' });
      return { success: true, operation: 'add' };
    } catch (error: any) {
      return { success: false, operation: 'add', error: error.message };
    }
  }

  /**
   * Commit changes
   */
  async gitCommit(message: string): Promise<GitOperationResult> {
    if (!this.config.gitEnabled) {
      return { success: false, operation: 'commit', error: 'Git operations are disabled' };
    }

    try {
      const sha = await gitService.commit(message);
      this.callbacks.onGitOperation?.({ success: true, operation: 'commit', data: { sha } });
      return { success: true, operation: 'commit', data: { sha } };
    } catch (error: any) {
      return { success: false, operation: 'commit', error: error.message };
    }
  }

  /**
   * Create or switch branch
   */
  async gitBranch(name: string, checkout?: boolean): Promise<GitOperationResult> {
    if (!this.config.gitEnabled) {
      return { success: false, operation: 'branch', error: 'Git operations are disabled' };
    }

    try {
      await gitService.checkout(name, true);
      this.callbacks.onGitOperation?.({ success: true, operation: 'branch', data: { name } });
      return { success: true, operation: 'branch', data: { name } };
    } catch (error: any) {
      return { success: false, operation: 'branch', error: error.message };
    }
  }

  /**
   * Checkout branch
   */
  async gitCheckout(branch: string): Promise<GitOperationResult> {
    if (!this.config.gitEnabled) {
      return { success: false, operation: 'checkout', error: 'Git operations are disabled' };
    }

    try {
      await gitService.checkout(branch);
      this.callbacks.onGitOperation?.({ success: true, operation: 'checkout', data: { branch } });
      return { success: true, operation: 'checkout', data: { branch } };
    } catch (error: any) {
      return { success: false, operation: 'checkout', error: error.message };
    }
  }

  /**
   * Push changes
   */
  async gitPush(remote?: string, branch?: string, credentials?: { username: string; password: string }): Promise<GitOperationResult> {
    if (!this.config.gitEnabled) {
      return { success: false, operation: 'push', error: 'Git operations are disabled' };
    }

    try {
      await gitService.push(remote || 'origin', branch || 'main', credentials);
      this.callbacks.onGitOperation?.({ success: true, operation: 'push' });
      return { success: true, operation: 'push' };
    } catch (error: any) {
      return { success: false, operation: 'push', error: error.message };
    }
  }

  /**
   * Pull changes
   */
  async gitPull(remote?: string, branch?: string, credentials?: { username: string; password: string }): Promise<GitOperationResult> {
    if (!this.config.gitEnabled) {
      return { success: false, operation: 'pull', error: 'Git operations are disabled' };
    }

    try {
      await gitService.pull(remote || 'origin', branch || 'main', credentials);
      this.callbacks.onGitOperation?.({ success: true, operation: 'pull' });
      return { success: true, operation: 'pull' };
    } catch (error: any) {
      return { success: false, operation: 'pull', error: error.message };
    }
  }

  /**
   * Get commit log
   */
  async gitLog(depth?: number): Promise<GitOperationResult> {
    if (!this.config.gitEnabled) {
      return { success: false, operation: 'log', error: 'Git operations are disabled' };
    }

    try {
      const log = await gitService.log(depth || 20);
      this.callbacks.onGitOperation?.({ success: true, operation: 'log', data: log });
      return { success: true, operation: 'log', data: log };
    } catch (error: any) {
      return { success: false, operation: 'log', error: error.message };
    }
  }

  /**
   * Get file diff
   */
  async gitDiff(filepath: string): Promise<GitOperationResult> {
    if (!this.config.gitEnabled) {
      return { success: false, operation: 'diff', error: 'Git operations are disabled' };
    }

    try {
      const diff = await gitService.diff(filepath);
      this.callbacks.onGitOperation?.({ success: true, operation: 'diff', data: diff });
      return { success: true, operation: 'diff', data: diff };
    } catch (error: any) {
      return { success: false, operation: 'diff', error: error.message };
    }
  }

  /**
   * Get branches
   */
  async gitBranches(): Promise<GitOperationResult> {
    if (!this.config.gitEnabled) {
      return { success: false, operation: 'branches', error: 'Git operations are disabled' };
    }

    try {
      const branches = await gitService.branches();
      this.callbacks.onGitOperation?.({ success: true, operation: 'branches', data: branches });
      return { success: true, operation: 'branches', data: branches };
    } catch (error: any) {
      return { success: false, operation: 'branches', error: error.message };
    }
  }

  // ==========================================================================
  // Response Parsing
  // ==========================================================================

  /**
   * Parse AI response for full control operations
   */
  parseOperations(response: string): {
    terminalCommands: Array<{ type: 'run' | 'sequence' | 'start' | 'stop'; command?: string; name?: string; commands?: string[] }>;
    fileOperations: Array<{ type: 'create' | 'edit' | 'delete' | 'rename'; path: string; content?: string; from?: string; to?: string }>;
    folderOperations: Array<{ type: 'create' | 'delete'; path: string }>;
    buildOperations: Array<{ type: 'build' | 'test' | 'run' | 'dev'; command?: string; pattern?: string }>;
    deployOperations: Array<{ platform: string; project: string; envVars?: Record<string, string> }>;
    gitOperations: Array<{ type: string; args: Record<string, any> }>;
  } {
    const terminalCommands: any[] = [];
    const fileOperations: any[] = [];
    const folderOperations: any[] = [];
    const buildOperations: any[] = [];
    const deployOperations: any[] = [];
    const gitOperations: any[] = [];

    // Parse terminal_run
    const terminalRunRegex = /<terminal_run>([\s\S]*?)<\/terminal_run>/g;
    let match;
    while ((match = terminalRunRegex.exec(response)) !== null) {
      terminalCommands.push({ type: 'run', command: match[1].trim() });
    }

    // Parse terminal_sequence
    const terminalSeqRegex = /<terminal_sequence>([\s\S]*?)<\/terminal_sequence>/g;
    while ((match = terminalSeqRegex.exec(response)) !== null) {
      const commands = match[1].trim().split('\n').filter(c => c.trim());
      terminalCommands.push({ type: 'sequence', commands });
    }

    // Parse terminal_start
    const terminalStartRegex = /<terminal_start\s+name="([^"]+)">([\s\S]*?)<\/terminal_start>/g;
    while ((match = terminalStartRegex.exec(response)) !== null) {
      terminalCommands.push({ type: 'start', name: match[1], command: match[2].trim() });
    }

    // Parse terminal_stop
    const terminalStopRegex = /<terminal_stop\s+name="([^"]+)"\s*\/>/g;
    while ((match = terminalStopRegex.exec(response)) !== null) {
      terminalCommands.push({ type: 'stop', name: match[1] });
    }

    // Parse file_create
    const fileCreateRegex = /<file_create\s+path="([^"]+)">([\s\S]*?)<\/file_create>/g;
    while ((match = fileCreateRegex.exec(response)) !== null) {
      fileOperations.push({ type: 'create', path: match[1], content: match[2].trim() });
    }

    // Parse file_edit
    const fileEditRegex = /<file_edit\s+path="([^"]+)">([\s\S]*?)<\/file_edit>/g;
    while ((match = fileEditRegex.exec(response)) !== null) {
      fileOperations.push({ type: 'edit', path: match[1], content: match[2].trim() });
    }

    // Parse file_delete
    const fileDeleteRegex = /<file_delete\s+path="([^"]+)"\s*\/>/g;
    while ((match = fileDeleteRegex.exec(response)) !== null) {
      fileOperations.push({ type: 'delete', path: match[1] });
    }

    // Parse file_rename
    const fileRenameRegex = /<file_rename\s+from="([^"]+)"\s+to="([^"]+)"\s*\/>/g;
    while ((match = fileRenameRegex.exec(response)) !== null) {
      fileOperations.push({ type: 'rename', from: match[1], to: match[2] });
    }

    // Parse folder_create
    const folderCreateRegex = /<folder_create\s+path="([^"]+)"\s*\/>/g;
    while ((match = folderCreateRegex.exec(response)) !== null) {
      folderOperations.push({ type: 'create', path: match[1] });
    }

    // Parse folder_delete
    const folderDeleteRegex = /<folder_delete\s+path="([^"]+)"\s*\/>/g;
    while ((match = folderDeleteRegex.exec(response)) !== null) {
      folderOperations.push({ type: 'delete', path: match[1] });
    }

    // Parse build
    const buildRegex = /<build(?:\s+command="([^"]+)")?\s*\/>/g;
    while ((match = buildRegex.exec(response)) !== null) {
      buildOperations.push({ type: 'build', command: match[1] });
    }

    // Parse test
    const testRegex = /<test(?:\s+pattern="([^"]+)")?\s*\/>/g;
    while ((match = testRegex.exec(response)) !== null) {
      buildOperations.push({ type: 'test', pattern: match[1] });
    }

    // Parse run
    const runRegex = /<run(?:\s+command="([^"]+)")?\s*\/>/g;
    while ((match = runRegex.exec(response)) !== null) {
      buildOperations.push({ type: 'run', command: match[1] });
    }

    // Parse dev
    const devRegex = /<dev\s*\/>/g;
    while ((match = devRegex.exec(response)) !== null) {
      buildOperations.push({ type: 'dev' });
    }

    // Parse deploy
    const deployRegex = /<deploy\s+platform="([^"]+)"\s+project="([^"]+)"(?:\s*\/>|>([\s\S]*?)<\/deploy>)/g;
    while ((match = deployRegex.exec(response)) !== null) {
      const envVars: Record<string, string> = {};
      if (match[3]) {
        const envRegex = /<env\s+name="([^"]+)"\s+value="([^"]+)"\s*\/>/g;
        let envMatch;
        while ((envMatch = envRegex.exec(match[3])) !== null) {
          envVars[envMatch[1]] = envMatch[2];
        }
      }
      deployOperations.push({ platform: match[1], project: match[2], envVars });
    }

    // Parse git operations
    const gitInitRegex = /<git_init\s*\/>/g;
    while ((match = gitInitRegex.exec(response)) !== null) {
      gitOperations.push({ type: 'init', args: {} });
    }

    const gitStatusRegex = /<git_status\s*\/>/g;
    while ((match = gitStatusRegex.exec(response)) !== null) {
      gitOperations.push({ type: 'status', args: {} });
    }

    const gitAddRegex = /<git_add\s+path="([^"]+)"\s*\/>/g;
    while ((match = gitAddRegex.exec(response)) !== null) {
      gitOperations.push({ type: 'add', args: { path: match[1] } });
    }

    const gitCommitRegex = /<git_commit\s+message="([^"]+)"\s*\/>/g;
    while ((match = gitCommitRegex.exec(response)) !== null) {
      gitOperations.push({ type: 'commit', args: { message: match[1] } });
    }

    const gitBranchRegex = /<git_branch\s+name="([^"]+)"(?:\s+checkout="([^"]+)")?\s*\/>/g;
    while ((match = gitBranchRegex.exec(response)) !== null) {
      gitOperations.push({ type: 'branch', args: { name: match[1], checkout: match[2] === 'true' } });
    }

    const gitCheckoutRegex = /<git_checkout\s+branch="([^"]+)"\s*\/>/g;
    while ((match = gitCheckoutRegex.exec(response)) !== null) {
      gitOperations.push({ type: 'checkout', args: { branch: match[1] } });
    }

    const gitPushRegex = /<git_push(?:\s+remote="([^"]+)")?(?:\s+branch="([^"]+)")?\s*\/>/g;
    while ((match = gitPushRegex.exec(response)) !== null) {
      gitOperations.push({ type: 'push', args: { remote: match[1], branch: match[2] } });
    }

    const gitPullRegex = /<git_pull(?:\s+remote="([^"]+)")?(?:\s+branch="([^"]+)")?\s*\/>/g;
    while ((match = gitPullRegex.exec(response)) !== null) {
      gitOperations.push({ type: 'pull', args: { remote: match[1], branch: match[2] } });
    }

    const gitLogRegex = /<git_log(?:\s+depth="([^"]+)")?\s*\/>/g;
    while ((match = gitLogRegex.exec(response)) !== null) {
      gitOperations.push({ type: 'log', args: { depth: match[1] ? parseInt(match[1]) : undefined } });
    }

    const gitDiffRegex = /<git_diff\s+file="([^"]+)"\s*\/>/g;
    while ((match = gitDiffRegex.exec(response)) !== null) {
      gitOperations.push({ type: 'diff', args: { file: match[1] } });
    }

    return {
      terminalCommands,
      fileOperations,
      folderOperations,
      buildOperations,
      deployOperations,
      gitOperations,
    };
  }

  /**
   * Execute parsed operations
   */
  async executeOperations(operations: ReturnType<typeof this.parseOperations>): Promise<{
    terminalResults: TerminalCommandResult[];
    fileResults: FileOperationResult[];
    buildResults: BuildResult[];
    deployResults: DeployResult[];
    gitResults: GitOperationResult[];
  }> {
    const terminalResults: TerminalCommandResult[] = [];
    const fileResults: FileOperationResult[] = [];
    const buildResults: BuildResult[] = [];
    const deployResults: DeployResult[] = [];
    const gitResults: GitOperationResult[] = [];

    // Execute folder operations first
    for (const op of operations.folderOperations) {
      if (op.type === 'create') {
        await this.createFolder(op.path);
      }
    }

    // Execute file operations
    for (const op of operations.fileOperations) {
      let result: FileOperationResult;
      switch (op.type) {
        case 'create':
          result = await this.createFile(op.path, op.content || '');
          break;
        case 'edit':
          result = await this.editFile(op.path, op.content || '');
          break;
        case 'delete':
          result = await this.deleteFile(op.path);
          break;
        case 'rename':
          result = await this.renameFile(op.from || '', op.to || '');
          break;
        default:
          continue;
      }
      fileResults.push(result);
    }

    // Execute terminal commands
    for (const cmd of operations.terminalCommands) {
      switch (cmd.type) {
        case 'run':
          if (cmd.command) {
            terminalResults.push(await this.executeCommand(cmd.command));
          }
          break;
        case 'sequence':
          if (cmd.commands) {
            terminalResults.push(...await this.executeCommands(cmd.commands));
          }
          break;
        case 'start':
          if (cmd.name && cmd.command) {
            await this.startProcess(cmd.name, cmd.command);
          }
          break;
        case 'stop':
          if (cmd.name) {
            await this.stopProcess(cmd.name);
          }
          break;
      }
    }

    // Execute build operations
    for (const op of operations.buildOperations) {
      switch (op.type) {
        case 'build':
          buildResults.push(await this.runBuild(op.command));
          break;
        case 'test':
          buildResults.push(await this.runTests(op.pattern));
          break;
        case 'dev':
          await this.runDev();
          break;
        case 'run':
          await this.runApp(op.command);
          break;
      }
    }

    // Execute git operations
    for (const op of operations.gitOperations) {
      let result: GitOperationResult;
      switch (op.type) {
        case 'init':
          result = await this.gitInit();
          break;
        case 'status':
          result = await this.gitStatus();
          break;
        case 'add':
          result = await this.gitAdd(op.args.path);
          break;
        case 'commit':
          result = await this.gitCommit(op.args.message);
          break;
        case 'branch':
          result = await this.gitBranch(op.args.name, op.args.checkout);
          break;
        case 'checkout':
          result = await this.gitCheckout(op.args.branch);
          break;
        case 'push':
          result = await this.gitPush(op.args.remote, op.args.branch);
          break;
        case 'pull':
          result = await this.gitPull(op.args.remote, op.args.branch);
          break;
        case 'log':
          result = await this.gitLog(op.args.depth);
          break;
        case 'diff':
          result = await this.gitDiff(op.args.file);
          break;
        default:
          continue;
      }
      gitResults.push(result);
    }

    // Execute deploy operations
    for (const op of operations.deployOperations) {
      if (op.platform === 'vercel') {
        // Get files from store or API
        const files: Record<string, string> = {};
        // This would need to be connected to actual file content
        deployResults.push(await this.deployToVercel(op.project, files));
      }
    }

    return {
      terminalResults,
      fileResults,
      buildResults,
      deployResults,
      gitResults,
    };
  }

  /**
   * Clean response by removing operation tags
   */
  cleanResponse(response: string): string {
    return response
      .replace(/<terminal_run>[\s\S]*?<\/terminal_run>/g, '\n💻 Running command...\n')
      .replace(/<terminal_sequence>[\s\S]*?<\/terminal_sequence>/g, '\n💻 Running commands...\n')
      .replace(/<terminal_start\s+name="[^"]+">[^<]*<\/terminal_start>/g, '\n🚀 Starting process...\n')
      .replace(/<terminal_stop\s+name="[^"]+"\s*\/>/g, '\n⏹️ Stopping process...\n')
      .replace(/<file_create\s+path="[^"]+">[\s\S]*?<\/file_create>/g, '\n📄 Creating file...\n')
      .replace(/<file_edit\s+path="[^"]+">[\s\S]*?<\/file_edit>/g, '\n📝 Editing file...\n')
      .replace(/<file_delete\s+path="[^"]+"\s*\/>/g, '\n🗑️ Deleting file...\n')
      .replace(/<file_rename\s+from="[^"]+"\s+to="[^"]+"\s*\/>/g, '\n📋 Renaming file...\n')
      .replace(/<folder_create\s+path="[^"]+"\s*\/>/g, '\n📁 Creating folder...\n')
      .replace(/<folder_delete\s+path="[^"]+"\s*\/>/g, '\n🗑️ Deleting folder...\n')
      .replace(/<build[^>]*\/>/g, '\n🔨 Building...\n')
      .replace(/<test[^>]*\/>/g, '\n🧪 Running tests...\n')
      .replace(/<run[^>]*\/>/g, '\n▶️ Running...\n')
      .replace(/<dev\s*\/>/g, '\n🔧 Starting dev server...\n')
      .replace(/<deploy[^>]*(?:\/>|>[\s\S]*?<\/deploy>)/g, '\n🚀 Deploying...\n')
      .replace(/<git_\w+[^>]*\/>/g, '\n📦 Git operation...\n')
      .trim();
  }

  /**
   * Get command history
   */
  getCommandHistory(): Array<{ command: string; result: TerminalCommandResult }> {
    return [...this.commandHistory];
  }

  /**
   * Clear command history
   */
  clearCommandHistory(): void {
    this.commandHistory = [];
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

export const aiFullControl = new AIFullControlService();

// Also export class for testing
export { AIFullControlService };
