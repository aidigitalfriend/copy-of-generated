/**
 * Extension Marketplace Panel - Full-featured extension management UI
 */

import React, { useState } from 'react';
import { useStore } from '../store/useStore';

// Types
interface MarketplaceExtension {
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
}

type ExtensionCategory = 'all' | 'AI' | 'Formatters' | 'Linters' | 'Languages' | 'Themes' | 'Tools' | 'SCM' | 'API' | 'Visual' | 'Other';

// Built-in extensions data
const EXTENSIONS: MarketplaceExtension[] = [
  { id: 'prettier', name: 'Prettier - Code Formatter', description: 'Code formatter using Prettier with support for JavaScript, TypeScript, CSS, HTML, JSON', version: '10.4.0', author: 'Prettier', icon: '✨', category: 'Formatters', downloads: 45000000, rating: 4.8, verified: true, tags: ['formatter', 'beautify'], permissions: ['files:write'] },
  { id: 'eslint', name: 'ESLint', description: 'Integrates ESLint JavaScript linting into VS Code', version: '3.0.5', author: 'Microsoft', icon: '🔍', category: 'Linters', downloads: 32000000, rating: 4.7, verified: true, tags: ['linter', 'javascript'], permissions: ['files:read'] },
  { id: 'git-lens', name: 'GitLens — Git supercharged', description: 'Supercharge Git with blame annotations, code lens, and more', version: '15.0.4', author: 'GitKraken', icon: '🔀', category: 'SCM', downloads: 28000000, rating: 4.9, verified: true, tags: ['git', 'blame'], permissions: ['git:read'] },
  { id: 'auto-rename-tag', name: 'Auto Rename Tag', description: 'Automatically rename paired HTML/XML tags', version: '0.1.10', author: 'Jun Han', icon: '🏷️', category: 'Languages', downloads: 15000000, rating: 4.5, verified: true, tags: ['html', 'xml'], permissions: ['editor:edit'] },
  { id: 'bracket-pair', name: 'Bracket Pair Colorizer', description: 'Colorizes matching brackets for better code readability', version: '2.0.2', author: 'CoenraadS', icon: '🌈', category: 'Visual', downloads: 12000000, rating: 4.6, verified: true, tags: ['brackets', 'colors'], permissions: ['editor:decorate'] },
  { id: 'live-server', name: 'Live Server', description: 'Launch a development local server with live reload', version: '5.7.9', author: 'Ritwick Dey', icon: '📡', category: 'Tools', downloads: 42000000, rating: 4.7, verified: true, tags: ['server', 'live-reload'], permissions: ['terminal:execute'] },
  { id: 'path-intellisense', name: 'Path Intellisense', description: 'Autocompletes filenames in your code', version: '2.8.5', author: 'Christian Kohler', icon: '📁', category: 'Languages', downloads: 11000000, rating: 4.4, verified: true, tags: ['autocomplete', 'path'], permissions: ['files:list'] },
  { id: 'material-icons', name: 'Material Icon Theme', description: 'Material Design icons for your files and folders', version: '5.0.0', author: 'Philipp Kief', icon: '🎨', category: 'Themes', downloads: 20000000, rating: 4.9, verified: true, tags: ['icons', 'theme'], permissions: ['ui:icons'] },
  { id: 'github-copilot', name: 'GitHub Copilot', description: 'AI pair programmer that suggests code completions', version: '1.150.0', author: 'GitHub', icon: '🤖', category: 'AI', downloads: 15000000, rating: 4.8, verified: true, tags: ['ai', 'copilot'], permissions: ['editor:complete'] },
  { id: 'tailwind', name: 'Tailwind CSS IntelliSense', description: 'Intelligent Tailwind CSS tooling for VS Code', version: '0.12.0', author: 'Tailwind Labs', icon: '💨', category: 'Languages', downloads: 9000000, rating: 4.8, verified: true, tags: ['tailwind', 'css'], permissions: ['editor:complete'] },
  { id: 'docker', name: 'Docker', description: 'Makes it easy to build, manage, and deploy containerized applications', version: '1.28.0', author: 'Microsoft', icon: '🐳', category: 'Tools', downloads: 25000000, rating: 4.6, verified: true, tags: ['docker', 'containers'], permissions: ['terminal:execute'] },
  { id: 'python', name: 'Python', description: 'Rich Python language support with IntelliSense, linting, debugging', version: '2024.2.1', author: 'Microsoft', icon: '🐍', category: 'Languages', downloads: 95000000, rating: 4.7, verified: true, tags: ['python', 'intellisense'], permissions: ['editor:complete'] },
  { id: 'thunder-client', name: 'Thunder Client', description: 'Lightweight REST API Client for VS Code', version: '2.17.0', author: 'Thunder Client', icon: '⚡', category: 'API', downloads: 7000000, rating: 4.9, verified: true, tags: ['api', 'rest'], permissions: ['network:fetch'] },
  { id: 'spell-checker', name: 'Code Spell Checker', description: 'Spelling checker for source code', version: '3.0.1', author: 'Street Side Software', icon: '📝', category: 'Linters', downloads: 8000000, rating: 4.5, verified: true, tags: ['spell', 'checker'], permissions: ['editor:diagnostics'] },
  { id: 'import-cost', name: 'Import Cost', description: 'Display import/require package size inline', version: '3.3.0', author: 'Wix', icon: '📦', category: 'Tools', downloads: 4000000, rating: 4.3, verified: true, tags: ['import', 'bundle'], permissions: ['editor:decorate'] }
];

// Format downloads
const formatDownloads = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
};

// Star rating
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`text-[10px] ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
    ))}
    <span className="text-[10px] text-gray-400 ml-1">{rating.toFixed(1)}</span>
  </div>
);

// Extension Card Component
const ExtensionCard: React.FC<{
  extension: MarketplaceExtension;
  installed: boolean;
  enabled: boolean;
  onInstall: () => void;
  onUninstall: () => void;
  onToggle: () => void;
  onDetails: () => void;
}> = ({ extension, installed, enabled, onInstall, onUninstall, onToggle, onDetails }) => {
  const [installing, setInstalling] = useState(false);
  
  const handleInstall = async () => {
    setInstalling(true);
    await onInstall();
    setInstalling(false);
  };
  
  return (
    <div 
      className="group p-3 bg-[#252526] hover:bg-[#2a2d2e] rounded-lg border border-transparent hover:border-[#007acc]/30 transition-all cursor-pointer"
      onClick={onDetails}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="w-12 h-12 flex items-center justify-center bg-[#1e1e1e] rounded-lg text-2xl flex-shrink-0">
          {extension.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white text-sm truncate">{extension.name}</h3>
                {extension.verified && (
                  <span className="text-blue-400 text-xs" title="Verified Publisher">✓</span>
                )}
              </div>
              <p className="text-xs text-gray-400 truncate">{extension.author}</p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
              {installed ? (
                <>
                  <button
                    onClick={onToggle}
                    className={`px-2 py-1 text-[10px] rounded transition-colors ${
                      enabled 
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                        : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                    }`}
                  >
                    {enabled ? 'Enabled' : 'Disabled'}
                  </button>
                  <button
                    onClick={onUninstall}
                    className="px-2 py-1 text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"
                  >
                    Uninstall
                  </button>
                </>
              ) : (
                <button
                  onClick={handleInstall}
                  disabled={installing}
                  className="px-3 py-1 text-[10px] bg-[#007acc] text-white hover:bg-[#0088e0] rounded transition-colors disabled:opacity-50"
                >
                  {installing ? 'Installing...' : 'Install'}
                </button>
              )}
            </div>
          </div>
          
          {/* Description */}
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{extension.description}</p>
          
          {/* Meta */}
          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
            <StarRating rating={extension.rating} />
            <span>↓ {formatDownloads(extension.downloads)}</span>
            <span className="px-1.5 py-0.5 bg-[#1e1e1e] rounded text-gray-400">{extension.category}</span>
            <span className="text-gray-600">v{extension.version}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extension Details Modal
const ExtensionDetailsModal: React.FC<{
  extension: MarketplaceExtension | null;
  installed: boolean;
  enabled: boolean;
  onClose: () => void;
  onInstall: () => void;
  onUninstall: () => void;
  onToggle: () => void;
}> = ({ extension, installed, enabled, onClose, onInstall, onUninstall, onToggle }) => {
  if (!extension) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1e1e1e] rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-[#3c3c3c]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#3c3c3c]">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 flex items-center justify-center bg-[#252526] rounded-xl text-3xl">
              {extension.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-white">{extension.name}</h2>
                {extension.verified && (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">Verified</span>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1">{extension.author} • v{extension.version}</p>
              <div className="flex items-center gap-4 mt-2">
                <StarRating rating={extension.rating} />
                <span className="text-xs text-gray-500">↓ {formatDownloads(extension.downloads)} downloads</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {installed ? (
                <>
                  <button
                    onClick={onToggle}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      enabled 
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                        : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                    }`}
                  >
                    {enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={onUninstall}
                    className="px-4 py-2 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                  >
                    Uninstall
                  </button>
                </>
              ) : (
                <button
                  onClick={onInstall}
                  className="px-6 py-2 text-sm bg-[#007acc] text-white hover:bg-[#0088e0] rounded-lg transition-colors"
                >
                  Install
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <p className="text-gray-300 text-sm leading-relaxed">{extension.description}</p>
          
          {/* Tags */}
          {extension.tags && extension.tags.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {extension.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-[#252526] text-gray-400 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Permissions */}
          {extension.permissions && extension.permissions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Permissions Required</h4>
              <div className="bg-[#252526] rounded-lg p-3">
                {extension.permissions.map(perm => (
                  <div key={perm} className="flex items-center gap-2 py-1">
                    <span className="text-yellow-400 text-xs">⚠</span>
                    <span className="text-gray-400 text-xs">{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Category */}
          <div className="mt-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Category</h4>
            <span className="px-3 py-1.5 bg-[#252526] text-gray-300 text-sm rounded">
              {extension.category}
            </span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-[#3c3c3c] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Panel
export const ExtensionMarketplacePanel: React.FC = () => {
  const { theme } = useStore();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'installed' | 'recommendations'>('marketplace');
  const [selectedCategory, setSelectedCategory] = useState<ExtensionCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExtension, setSelectedExtension] = useState<MarketplaceExtension | null>(null);
  const [installedIds, setInstalledIds] = useState<Set<string>>(new Set(['prettier', 'eslint']));
  const [enabledIds, setEnabledIds] = useState<Set<string>>(new Set(['prettier', 'eslint']));
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'name'>('downloads');
  
  const categories: ExtensionCategory[] = ['all', 'AI', 'Formatters', 'Linters', 'Languages', 'Themes', 'Tools', 'SCM', 'API', 'Visual', 'Other'];
  
  // Filter and sort
  const filteredExtensions = EXTENSIONS.filter(ext => {
    if (selectedCategory !== 'all' && ext.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return ext.name.toLowerCase().includes(q) || ext.description.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'downloads') return b.downloads - a.downloads;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });
  
  const displayExtensions = activeTab === 'installed' 
    ? filteredExtensions.filter(e => installedIds.has(e.id))
    : activeTab === 'recommendations'
      ? EXTENSIONS.filter(e => ['github-copilot', 'tailwind', 'git-lens', 'docker'].includes(e.id) && !installedIds.has(e.id))
      : filteredExtensions;

  const install = (id: string) => {
    setInstalledIds(prev => new Set([...prev, id]));
    setEnabledIds(prev => new Set([...prev, id]));
  };
  
  const uninstall = (id: string) => {
    setInstalledIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    setEnabledIds(prev => { const s = new Set(prev); s.delete(id); return s; });
  };
  
  const toggle = (id: string) => {
    setEnabledIds(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
      {/* Header */}
      <div className="p-4 border-b border-[#3c3c3c]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📦</span>
            <h2 className="font-semibold">Extensions</h2>
          </div>
          <span className="text-xs text-gray-500">{installedIds.size} installed</span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search extensions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#3c3c3c] border border-[#3c3c3c] focus:border-[#007acc] rounded-lg text-sm text-white placeholder-gray-500 outline-none"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-[#3c3c3c]">
        {(['marketplace', 'installed', 'recommendations'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-xs font-medium ${activeTab === tab ? 'text-white border-b-2 border-[#007acc] bg-[#007acc]/10' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {tab === 'marketplace' ? '🏪 Marketplace' : tab === 'installed' ? '✓ Installed' : '⭐ Recommended'}
          </button>
        ))}
      </div>
      
      {/* Category Filter */}
      {activeTab === 'marketplace' && (
        <div className="p-2 border-b border-[#3c3c3c] overflow-x-auto">
          <div className="flex gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-[10px] rounded-full whitespace-nowrap ${selectedCategory === cat ? 'bg-[#007acc] text-white' : 'bg-[#3c3c3c] text-gray-400'}`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Sort */}
      {activeTab === 'marketplace' && (
        <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-[#3c3c3c]">
          <span>{displayExtensions.length} extensions</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="bg-[#3c3c3c] text-gray-300 px-2 py-1 rounded text-[10px] outline-none">
            <option value="downloads">Most Downloads</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Name</option>
          </select>
        </div>
      )}
      
      {/* Extension List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {displayExtensions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">{activeTab === 'installed' ? 'No extensions installed' : 'No extensions found'}</div>
        ) : (
          displayExtensions.map(ext => (
            <div key={ext.id} className="p-3 bg-[#252526] hover:bg-[#2a2d2e] rounded-lg cursor-pointer" onClick={() => setSelectedExtension(ext)}>
              <div className="flex gap-3">
                <div className="w-12 h-12 flex items-center justify-center bg-[#1e1e1e] rounded-lg text-2xl">{ext.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white text-sm truncate">{ext.name}</h3>
                        {ext.verified && <span className="text-blue-400 text-xs">✓</span>}
                      </div>
                      <p className="text-xs text-gray-400">{ext.author}</p>
                    </div>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      {installedIds.has(ext.id) ? (
                        <>
                          <button onClick={() => toggle(ext.id)} className={`px-2 py-1 text-[10px] rounded ${enabledIds.has(ext.id) ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {enabledIds.has(ext.id) ? 'Enabled' : 'Disabled'}
                          </button>
                          <button onClick={() => uninstall(ext.id)} className="px-2 py-1 text-[10px] bg-red-500/20 text-red-400 rounded">Uninstall</button>
                        </>
                      ) : (
                        <button onClick={() => install(ext.id)} className="px-3 py-1 text-[10px] bg-[#007acc] text-white rounded">Install</button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ext.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                    <StarRating rating={ext.rating} />
                    <span>↓ {formatDownloads(ext.downloads)}</span>
                    <span className="px-1.5 py-0.5 bg-[#1e1e1e] rounded">{ext.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Details Modal */}
      {selectedExtension && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setSelectedExtension(null)}>
          <div className="bg-[#1e1e1e] rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-[#3c3c3c]" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[#3c3c3c]">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex items-center justify-center bg-[#252526] rounded-xl text-3xl">{selectedExtension.icon}</div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white">{selectedExtension.name}</h2>
                  <p className="text-sm text-gray-400 mt-1">{selectedExtension.author} • v{selectedExtension.version}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <StarRating rating={selectedExtension.rating} />
                    <span className="text-xs text-gray-500">↓ {formatDownloads(selectedExtension.downloads)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {installedIds.has(selectedExtension.id) ? (
                    <>
                      <button onClick={() => toggle(selectedExtension.id)} className={`px-4 py-2 text-sm rounded-lg ${enabledIds.has(selectedExtension.id) ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {enabledIds.has(selectedExtension.id) ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={() => { uninstall(selectedExtension.id); setSelectedExtension(null); }} className="px-4 py-2 text-sm bg-red-500/20 text-red-400 rounded-lg">Uninstall</button>
                    </>
                  ) : (
                    <button onClick={() => install(selectedExtension.id)} className="px-6 py-2 text-sm bg-[#007acc] text-white rounded-lg">Install</button>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <p className="text-gray-300 text-sm">{selectedExtension.description}</p>
              {selectedExtension.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs text-gray-500 uppercase mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExtension.tags.map(tag => <span key={tag} className="px-2 py-1 bg-[#252526] text-gray-400 text-xs rounded">{tag}</span>)}
                  </div>
                </div>
              )}
              {selectedExtension.permissions.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs text-gray-500 uppercase mb-2">Permissions</h4>
                  <div className="bg-[#252526] rounded-lg p-3">
                    {selectedExtension.permissions.map(perm => <div key={perm} className="flex items-center gap-2 py-1"><span className="text-yellow-400 text-xs">⚠</span><span className="text-gray-400 text-xs">{perm}</span></div>)}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-[#3c3c3c] flex justify-end">
              <button onClick={() => setSelectedExtension(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtensionMarketplacePanel;
