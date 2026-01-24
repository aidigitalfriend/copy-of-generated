import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { extensionManager, initializeExtensions } from '../services/extensions';

export const ExtensionsPanel: React.FC = () => {
  const { extensions, toggleExtension, resetExtensions, syncExtensions, theme } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'installed' | 'available'>('installed');

  useEffect(() => {
    // Sync extensions on mount to add any new ones
    if (extensions.length < 20) {
      resetExtensions();
    } else {
      syncExtensions();
    }
    initializeExtensions();
  }, []);

  // Filter extensions based on search
  const filteredExtensions = extensions.filter(ext =>
    ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ext.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate installed and not installed
  const installedExtensions = filteredExtensions.filter(ext => ext.enabled === true);
  const availableExtensions = filteredExtensions.filter(ext => ext.enabled !== true);

  const handleInstall = (extId: string) => {
    toggleExtension(extId);
    extensionManager.enable(extId);
  };

  const handleUninstall = (extId: string) => {
    toggleExtension(extId);
    extensionManager.disable(extId);
  };

  const displayedExtensions = activeTab === 'installed' ? installedExtensions : availableExtensions;

  return (
    <div className="flex flex-col h-full bg-vscode-sidebar font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-vscode-border bg-vscode-bg">
        <div className="flex items-center gap-2">
          <span className="text-lg">◎</span>
          <span className="font-semibold text-white">Extensions</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 bg-vscode-success/10 text-vscode-success font-medium rounded">
          {installedExtensions.length} Active
        </span>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-vscode-border">
        <div className="relative">
          <input
            type="text"
            placeholder="Search extensions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-vscode-bg border border-vscode-border text-white text-sm focus:outline-none focus:border-vscode-accent placeholder-vscode-textMuted font-mono"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-vscode-textMuted">▶</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-vscode-border">
        <button
          onClick={() => setActiveTab('installed')}
          className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'installed' 
              ? 'text-white border-b border-vscode-accent bg-vscode-accent/10' 
              : 'text-vscode-textMuted hover:text-white'
          }`}
        >
          Installed ({installedExtensions.length})
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
            activeTab === 'available' 
              ? 'text-white border-b border-vscode-accent bg-vscode-accent/10' 
              : 'text-vscode-textMuted hover:text-white'
          }`}
        >
          Available ({availableExtensions.length})
        </button>
      </div>

      {/* Extension List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {displayedExtensions.length > 0 ? (
          displayedExtensions.map(ext => (
            <div
              key={ext.id}
              className="flex items-center gap-3 p-2 bg-vscode-bg hover:bg-white/5 transition rounded"
            >
              {/* Icon */}
              <div className="w-8 h-8 bg-vscode-sidebar flex items-center justify-center text-lg shrink-0 rounded">
                {ext.icon || '◎'}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold truncate text-white">
                  {ext.name}
                </h4>
                <p className="text-xs truncate text-vscode-textMuted">
                  {ext.description}
                </p>
                <span className="text-xs text-vscode-textMuted/60 font-medium">
                  v{ext.version}
                </span>
              </div>
              
              {/* Install/Uninstall Button */}
              {activeTab === 'installed' ? (
                <button
                  onClick={() => handleUninstall(ext.id)}
                  className="px-2 py-1 text-[10px] font-medium text-vscode-error hover:bg-vscode-error/10 transition rounded"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => handleInstall(ext.id)}
                  className="px-2 py-1 text-[10px] font-medium text-vscode-success hover:bg-vscode-success/10 transition rounded"
                >
                  Install
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-vscode-textMuted border border-dashed border-vscode-border/50 rounded">
            <div className="text-4xl mb-3">
              {activeTab === 'installed' ? '▢' : '◉'}
            </div>
            <p className="text-xs font-medium">
              {activeTab === 'installed' 
                ? 'No extensions installed' 
                : 'All extensions installed!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
