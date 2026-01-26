/**
 * useExtensions Hook
 * 
 * React hook for managing extensions in components.
 * Provides:
 * - Extension installation/uninstallation
 * - Realtime status updates
 * - Event subscription
 * - Notification handling
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { extensionHost, connectStoreToExtensions } from './extensionHost';
import { extensionEvents, extensionManager, builtInExtensions } from './extensions';
import { useStore } from '../store/useStore';

export interface ExtensionInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  icon: string;
  category: string;
  downloads: number;
  rating: number;
  verified: boolean;
  tags: string[];
  permissions: string[];
  installed: boolean;
  enabled: boolean;
  status: 'inactive' | 'activating' | 'active' | 'error' | 'disposed';
  main?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  extensionId?: string;
  timestamp: number;
}

// Default marketplace extensions with executable code
export const MARKETPLACE_EXTENSIONS: ExtensionInfo[] = [
  {
    id: 'prettier',
    name: 'Prettier - Code Formatter',
    description: 'Code formatter using Prettier',
    version: '10.4.0',
    author: 'Prettier',
    icon: '✨',
    category: 'Formatters',
    downloads: 45000000,
    rating: 4.8,
    verified: true,
    tags: ['formatter', 'beautify'],
    permissions: ['editor:format'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      context.registerCommand('prettier.format', async () => {
        await context.api.editor.format();
        context.api.ui.showNotification('Code formatted with Prettier!', 'success');
      }, 'Format Document');
      
      context.onFileSave(async (data) => {
        console.log('File saved, auto-formatting...');
        await context.api.editor.format();
      });
      
      console.log('Prettier extension activated');
    `
  },
  {
    id: 'eslint',
    name: 'ESLint',
    description: 'JavaScript/TypeScript linter',
    version: '3.0.5',
    author: 'Microsoft',
    icon: '🔍',
    category: 'Linters',
    downloads: 32000000,
    rating: 4.7,
    verified: true,
    tags: ['linter', 'javascript'],
    permissions: ['editor:diagnostics'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      context.registerCommand('eslint.lint', async () => {
        const content = await context.api.editor.getContent();
        context.api.ui.showNotification('ESLint: No issues found!', 'success');
      }, 'Lint Document');
      
      context.onTextChange(async (data) => {
        // Real-time linting would happen here
        console.log('Text changed, linting...');
      });
      
      console.log('ESLint extension activated');
    `
  },
  {
    id: 'git-lens',
    name: 'GitLens — Git supercharged',
    description: 'Supercharge Git with blame annotations',
    version: '15.0.4',
    author: 'GitKraken',
    icon: '🔀',
    category: 'SCM',
    downloads: 28000000,
    rating: 4.9,
    verified: true,
    tags: ['git', 'blame'],
    permissions: ['git:read'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      context.registerCommand('gitlens.blame', async () => {
        context.api.ui.showNotification('Git blame: Line by line history', 'info');
      }, 'Show Git Blame');
      
      context.registerCommand('gitlens.history', async () => {
        context.api.ui.showNotification('Showing file history...', 'info');
      }, 'Show File History');
      
      console.log('GitLens extension activated');
    `
  },
  {
    id: 'auto-rename-tag',
    name: 'Auto Rename Tag',
    description: 'Automatically rename paired HTML/XML tags',
    version: '0.1.10',
    author: 'Jun Han',
    icon: '🏷️',
    category: 'Languages',
    downloads: 15000000,
    rating: 4.5,
    verified: true,
    tags: ['html', 'xml'],
    permissions: ['editor:edit'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      context.onTextChange(async (data) => {
        // Auto rename logic would detect tag changes here
        console.log('Checking for tag rename...');
      });
      
      console.log('Auto Rename Tag extension activated');
    `
  },
  {
    id: 'bracket-pair',
    name: 'Bracket Pair Colorizer',
    description: 'Colorizes matching brackets',
    version: '2.0.2',
    author: 'CoenraadS',
    icon: '🌈',
    category: 'Visual',
    downloads: 12000000,
    rating: 4.6,
    verified: true,
    tags: ['brackets', 'colors'],
    permissions: ['editor:decorate'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      const colors = ['#ffd700', '#da70d6', '#87ceeb', '#98fb98'];
      
      context.onTextChange(async (data) => {
        // Bracket colorization would happen here
        console.log('Colorizing brackets...');
      });
      
      console.log('Bracket Pair Colorizer activated');
    `
  },
  {
    id: 'live-server',
    name: 'Live Server',
    description: 'Launch a local server with live reload',
    version: '5.7.9',
    author: 'Ritwick Dey',
    icon: '📡',
    category: 'Tools',
    downloads: 42000000,
    rating: 4.7,
    verified: true,
    tags: ['server', 'live-reload'],
    permissions: ['terminal:execute'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      context.registerCommand('liveServer.start', async () => {
        await context.api.terminal.execute('npx serve . -p 5500');
        context.api.ui.showNotification('Live Server started on port 5500!', 'success');
      }, 'Start Live Server');
      
      context.registerCommand('liveServer.stop', async () => {
        context.api.ui.showNotification('Live Server stopped', 'info');
      }, 'Stop Live Server');
      
      console.log('Live Server extension activated');
    `
  },
  {
    id: 'path-intellisense',
    name: 'Path Intellisense',
    description: 'Autocompletes filenames',
    version: '2.8.5',
    author: 'Christian Kohler',
    icon: '📁',
    category: 'Languages',
    downloads: 11000000,
    rating: 4.4,
    verified: true,
    tags: ['autocomplete', 'path'],
    permissions: ['files:list'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      context.onTextChange(async (data) => {
        // Path completion logic here
        console.log('Checking for path completion...');
      });
      
      console.log('Path Intellisense activated');
    `
  },
  {
    id: 'material-icons',
    name: 'Material Icon Theme',
    description: 'Material Design icons',
    version: '5.0.0',
    author: 'Philipp Kief',
    icon: '🎨',
    category: 'Themes',
    downloads: 20000000,
    rating: 4.9,
    verified: true,
    tags: ['icons', 'theme'],
    permissions: ['ui:icons'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      context.registerCommand('materialIcons.activate', async () => {
        await context.api.storage.set('iconTheme', 'material');
        context.api.ui.showNotification('Material Icons activated!', 'success');
      }, 'Activate Material Icons');
      
      console.log('Material Icon Theme activated');
    `
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'AI pair programmer',
    version: '1.150.0',
    author: 'GitHub',
    icon: '🤖',
    category: 'AI',
    downloads: 15000000,
    rating: 4.8,
    verified: true,
    tags: ['ai', 'copilot'],
    permissions: ['editor:complete'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      context.registerCommand('copilot.suggest', async () => {
        const selection = await context.api.editor.getSelection();
        if (selection && selection.text) {
          context.api.ui.showNotification('Generating AI suggestion...', 'info');
        } else {
          context.api.ui.showNotification('Select code for AI suggestion', 'warning');
        }
      }, 'Get AI Suggestion');
      
      context.onTextChange(async (data) => {
        // AI suggestions would trigger here
        console.log('Copilot: Analyzing code...');
      });
      
      console.log('GitHub Copilot activated');
    `
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS IntelliSense',
    description: 'Intelligent Tailwind CSS tooling',
    version: '0.12.0',
    author: 'Tailwind Labs',
    icon: '💨',
    category: 'Languages',
    downloads: 9000000,
    rating: 4.8,
    verified: true,
    tags: ['tailwind', 'css'],
    permissions: ['editor:complete'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      context.onTextChange(async (data) => {
        // Tailwind class completion would happen here
        console.log('Tailwind: Checking for class completions...');
      });
      
      console.log('Tailwind CSS IntelliSense activated');
    `
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Docker container management',
    version: '1.28.0',
    author: 'Microsoft',
    icon: '🐳',
    category: 'Tools',
    downloads: 25000000,
    rating: 4.6,
    verified: true,
    tags: ['docker', 'containers'],
    permissions: ['terminal:execute'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      context.registerCommand('docker.build', async () => {
        await context.api.terminal.execute('docker build -t myapp .');
        context.api.ui.showNotification('Building Docker image...', 'info');
      }, 'Build Docker Image');
      
      context.registerCommand('docker.run', async () => {
        await context.api.terminal.execute('docker run -p 3000:3000 myapp');
        context.api.ui.showNotification('Running Docker container...', 'info');
      }, 'Run Docker Container');
      
      console.log('Docker extension activated');
    `
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Python language support',
    version: '2024.2.1',
    author: 'Microsoft',
    icon: '🐍',
    category: 'Languages',
    downloads: 95000000,
    rating: 4.7,
    verified: true,
    tags: ['python', 'intellisense'],
    permissions: ['editor:complete'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      context.registerCommand('python.run', async () => {
        await context.api.terminal.execute('python main.py');
        context.api.ui.showNotification('Running Python script...', 'info');
      }, 'Run Python File');
      
      context.registerCommand('python.lint', async () => {
        await context.api.terminal.execute('pylint *.py');
        context.api.ui.showNotification('Linting Python files...', 'info');
      }, 'Lint Python Files');
      
      console.log('Python extension activated');
    `
  },
  {
    id: 'thunder-client',
    name: 'Thunder Client',
    description: 'REST API Client',
    version: '2.17.0',
    author: 'Thunder Client',
    icon: '⚡',
    category: 'API',
    downloads: 7000000,
    rating: 4.9,
    verified: true,
    tags: ['api', 'rest'],
    permissions: ['network:fetch'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      context.registerCommand('thunder.newRequest', async () => {
        context.api.ui.showNotification('Opening new API request...', 'info');
      }, 'New API Request');
      
      console.log('Thunder Client activated');
    `
  },
  {
    id: 'spell-checker',
    name: 'Code Spell Checker',
    description: 'Spelling checker for source code',
    version: '3.0.1',
    author: 'Street Side Software',
    icon: '📝',
    category: 'Linters',
    downloads: 8000000,
    rating: 4.5,
    verified: true,
    tags: ['spell', 'checker'],
    permissions: ['editor:diagnostics'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      context.onTextChange(async (data) => {
        // Spell check would happen here
        console.log('Spell checker: Checking spelling...');
      });
      
      console.log('Code Spell Checker activated');
    `
  },
  {
    id: 'import-cost',
    name: 'Import Cost',
    description: 'Display import/require package size',
    version: '3.3.0',
    author: 'Wix',
    icon: '📦',
    category: 'Tools',
    downloads: 4000000,
    rating: 4.3,
    verified: true,
    tags: ['import', 'bundle'],
    permissions: ['editor:decorate'],
    installed: false,
    enabled: false,
    status: 'inactive',
    main: `
      context.onTextChange(async (data) => {
        // Import cost calculation would happen here
        console.log('Import Cost: Calculating bundle sizes...');
      });
      
      console.log('Import Cost extension activated');
    `
  }
];

export function useExtensions() {
  const [extensions, setExtensions] = useState<ExtensionInfo[]>(MARKETPLACE_EXTENSIONS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const notificationIdRef = useRef(0);

  // Initialize extension system
  useEffect(() => {
    if (isInitialized) return;

    // Connect store to extension host
    connectStoreToExtensions(useStore);

    // Load installed extensions from storage
    const installed = localStorage.getItem('installedExtensions');
    if (installed) {
      const installedIds = JSON.parse(installed) as string[];
      setExtensions(prev => prev.map(ext => ({
        ...ext,
        installed: installedIds.includes(ext.id),
        enabled: installedIds.includes(ext.id)
      })));

      // Auto-activate installed extensions
      installedIds.forEach(id => {
        const ext = MARKETPLACE_EXTENSIONS.find(e => e.id === id);
        if (ext?.main) {
          extensionHost.activateExtension({
            id: ext.id,
            name: ext.name,
            version: ext.version,
            main: ext.main,
            permissions: ext.permissions
          });
        }
      });
    }

    // Listen for extension events
    extensionEvents.on('extension:activated', ({ extensionId }) => {
      setExtensions(prev => prev.map(ext => 
        ext.id === extensionId ? { ...ext, status: 'active' } : ext
      ));
    });

    extensionEvents.on('extension:deactivated', ({ extensionId }) => {
      setExtensions(prev => prev.map(ext => 
        ext.id === extensionId ? { ...ext, status: 'inactive' } : ext
      ));
    });

    extensionEvents.on('extension:error', ({ extensionId, error }) => {
      setExtensions(prev => prev.map(ext => 
        ext.id === extensionId ? { ...ext, status: 'error' } : ext
      ));
      addNotification(`Extension ${extensionId} error: ${error}`, 'error', extensionId);
    });

    // Listen for UI notifications from extensions
    extensionEvents.on('ui:notification', (message: string, type: string) => {
      addNotification(message, type as any);
    });

    setIsInitialized(true);

    return () => {
      extensionEvents.off('extension:activated', () => {});
      extensionEvents.off('extension:deactivated', () => {});
      extensionEvents.off('extension:error', () => {});
      extensionEvents.off('ui:notification', () => {});
    };
  }, [isInitialized]);

  // Add notification
  const addNotification = useCallback((message: string, type: Notification['type'] = 'info', extensionId?: string) => {
    const notification: Notification = {
      id: `notif-${++notificationIdRef.current}`,
      message,
      type,
      extensionId,
      timestamp: Date.now()
    };
    setNotifications(prev => [...prev, notification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  }, []);

  // Install extension
  const installExtension = useCallback(async (extensionId: string) => {
    const ext = extensions.find(e => e.id === extensionId);
    if (!ext) return false;

    setExtensions(prev => prev.map(e => 
      e.id === extensionId ? { ...e, status: 'activating' } : e
    ));

    try {
      // Activate in extension host
      if (ext.main) {
        const success = await extensionHost.activateExtension({
          id: ext.id,
          name: ext.name,
          version: ext.version,
          main: ext.main,
          permissions: ext.permissions
        });

        if (!success) throw new Error('Activation failed');
      }

      // Update state
      setExtensions(prev => prev.map(e => 
        e.id === extensionId ? { ...e, installed: true, enabled: true, status: 'active' } : e
      ));

      // Save to storage
      const installed = extensions.filter(e => e.installed || e.id === extensionId).map(e => e.id);
      localStorage.setItem('installedExtensions', JSON.stringify(installed));

      addNotification(`${ext.name} installed successfully!`, 'success');
      return true;
    } catch (error: any) {
      setExtensions(prev => prev.map(e => 
        e.id === extensionId ? { ...e, status: 'error' } : e
      ));
      addNotification(`Failed to install ${ext.name}: ${error.message}`, 'error');
      return false;
    }
  }, [extensions, addNotification]);

  // Uninstall extension
  const uninstallExtension = useCallback(async (extensionId: string) => {
    const ext = extensions.find(e => e.id === extensionId);
    if (!ext) return false;

    try {
      // Deactivate in extension host
      await extensionHost.deactivateExtension(extensionId);

      // Update state
      setExtensions(prev => prev.map(e => 
        e.id === extensionId ? { ...e, installed: false, enabled: false, status: 'inactive' } : e
      ));

      // Save to storage
      const installed = extensions.filter(e => e.installed && e.id !== extensionId).map(e => e.id);
      localStorage.setItem('installedExtensions', JSON.stringify(installed));

      addNotification(`${ext.name} uninstalled`, 'info');
      return true;
    } catch (error: any) {
      addNotification(`Failed to uninstall ${ext.name}: ${error.message}`, 'error');
      return false;
    }
  }, [extensions, addNotification]);

  // Toggle extension enabled/disabled
  const toggleExtension = useCallback(async (extensionId: string) => {
    const ext = extensions.find(e => e.id === extensionId);
    if (!ext || !ext.installed) return;

    if (ext.enabled) {
      // Disable
      await extensionHost.deactivateExtension(extensionId);
      setExtensions(prev => prev.map(e => 
        e.id === extensionId ? { ...e, enabled: false, status: 'inactive' } : e
      ));
    } else {
      // Enable
      if (ext.main) {
        await extensionHost.activateExtension({
          id: ext.id,
          name: ext.name,
          version: ext.version,
          main: ext.main,
          permissions: ext.permissions
        });
      }
      setExtensions(prev => prev.map(e => 
        e.id === extensionId ? { ...e, enabled: true } : e
      ));
    }
  }, [extensions]);

  // Reload extension (hot reload)
  const reloadExtension = useCallback(async (extensionId: string) => {
    const ext = extensions.find(e => e.id === extensionId);
    if (!ext?.main) return;

    addNotification(`Reloading ${ext.name}...`, 'info');

    const success = await extensionHost.reloadExtension({
      id: ext.id,
      name: ext.name,
      version: ext.version,
      main: ext.main,
      permissions: ext.permissions
    });

    if (success) {
      addNotification(`${ext.name} reloaded!`, 'success');
    } else {
      addNotification(`Failed to reload ${ext.name}`, 'error');
    }
  }, [extensions, addNotification]);

  // Execute extension command
  const executeCommand = useCallback((extensionId: string, commandId: string, args?: any) => {
    extensionHost.executeCommand(extensionId, commandId, args);
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get installed extensions
  const installedExtensions = extensions.filter(e => e.installed);

  // Get active extensions
  const activeExtensions = extensions.filter(e => e.status === 'active');

  return {
    extensions,
    installedExtensions,
    activeExtensions,
    notifications,
    installExtension,
    uninstallExtension,
    toggleExtension,
    reloadExtension,
    executeCommand,
    addNotification,
    dismissNotification,
    clearNotifications
  };
}

export default useExtensions;
