/**
 * Prebuilt Templates Gallery Component
 * Displays full application templates with preview functionality
 */

import React, { useState, useCallback } from 'react';
import { PREBUILT_TEMPLATES, PrebuiltTemplate, PREBUILT_CATEGORIES } from '../data/prebuiltTemplates';
import { FileNode, ProjectTemplate } from '../types';
import { useStore } from '../store/useStore';

interface PrebuiltTemplatesGalleryProps {
  onSelectTemplate: (template: ProjectTemplate, files: FileNode[]) => void;
  onClose?: () => void;
}

const PrebuiltTemplatesGallery: React.FC<PrebuiltTemplatesGalleryProps> = ({ 
  onSelectTemplate,
  onClose 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<PrebuiltTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState<'preview' | 'code'>('preview');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = PREBUILT_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           template.category === selectedCategory ||
                           template.techStack.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  // Helper function to get language from filename
  const getLanguageFromFilename = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescriptreact',
      'js': 'javascript',
      'jsx': 'javascriptreact',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'sql': 'sql',
      'yaml': 'yaml',
      'yml': 'yaml',
    };
    return langMap[ext || ''] || 'plaintext';
  };

  // Convert template files to FileNode structure
  const convertToFileNodes = useCallback((files: Record<string, string>): FileNode[] => {
    const root: FileNode[] = [];
    
    Object.entries(files).forEach(([path, content]) => {
      const parts = path.split('/');
      let currentLevel = root;
      
      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        const existingNode = currentLevel.find(n => n.name === part);
        
        if (existingNode) {
          if (existingNode.children) {
            currentLevel = existingNode.children;
          }
        } else {
          const newNode: FileNode = {
            name: part,
            type: isFile ? 'file' : 'folder',
            path: parts.slice(0, index + 1).join('/'),
            ...(isFile ? {
              content,
              language: getLanguageFromFilename(part)
            } : {
              children: []
            })
          };
          currentLevel.push(newNode);
          if (!isFile && newNode.children) {
            currentLevel = newNode.children;
          }
        }
      });
    });

    return root;
  }, []);

  const handleSelectTemplate = useCallback((template: PrebuiltTemplate) => {
    const files = convertToFileNodes(template.files);
    onSelectTemplate(template, files);
    if (onClose) onClose();
  }, [convertToFileNodes, onSelectTemplate, onClose]);

  const handlePreview = (template: PrebuiltTemplate) => {
    setSelectedTemplate(template);
    setPreviewMode('preview');
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-white">
      {/* Header */}
      <div className="p-4 border-b border-[#333]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <h2 className="text-lg font-semibold">Prebuilt Templates</h2>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 hover:bg-[#333] rounded"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2d2d2d] border border-[#444] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#0078d4] pl-9"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="p-3 border-b border-[#333] overflow-x-auto">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-[#0078d4] text-white'
                : 'bg-[#333] text-gray-300 hover:bg-[#444]'
            }`}
          >
            All Templates
          </button>
          {PREBUILT_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-[#0078d4] text-white'
                  : 'bg-[#333] text-gray-300 hover:bg-[#444]'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid or Preview */}
      <div className="flex-1 overflow-auto p-4">
        {selectedTemplate ? (
          /* Template Preview Mode */
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
              >
                ← Back to templates
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode('preview')}
                  className={`px-3 py-1.5 rounded text-xs ${
                    previewMode === 'preview' ? 'bg-[#0078d4]' : 'bg-[#333]'
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setPreviewMode('code')}
                  className={`px-3 py-1.5 rounded text-xs ${
                    previewMode === 'code' ? 'bg-[#0078d4]' : 'bg-[#333]'
                  }`}
                >
                  Code
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[#2d2d2d] rounded-lg overflow-hidden border border-[#444]">
              {previewMode === 'preview' ? (
                <iframe
                  srcDoc={selectedTemplate.files['index.html']}
                  className="w-full h-full bg-white"
                  title="Template Preview"
                  sandbox="allow-scripts"
                />
              ) : (
                <pre className="p-4 text-sm overflow-auto h-full">
                  <code className="text-green-400">
                    {selectedTemplate.files['index.html']}
                  </code>
                </pre>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{selectedTemplate.name}</h3>
                <p className="text-sm text-gray-400">{selectedTemplate.description}</p>
              </div>
              <button
                onClick={() => handleSelectTemplate(selectedTemplate)}
                className="bg-[#0078d4] hover:bg-[#0066b8] px-6 py-2 rounded-lg font-medium transition"
              >
                Use This Template
              </button>
            </div>
          </div>
        ) : (
          /* Templates Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="bg-[#2d2d2d] rounded-xl overflow-hidden border border-[#444] hover:border-[#0078d4] transition group"
              >
                {/* Preview Thumbnail */}
                <div 
                  className="h-40 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center cursor-pointer relative"
                  onClick={() => handlePreview(template)}
                >
                  <span className="text-6xl">{template.icon}</span>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="bg-white/20 px-4 py-2 rounded-lg text-sm">👁️ Preview</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{template.name}</h3>
                    <span className="text-xs bg-[#444] px-2 py-1 rounded">{template.category}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{template.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.features.slice(0, 3).map((feature, i) => (
                      <span key={i} className="text-xs bg-[#333] px-2 py-0.5 rounded text-gray-300">
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="text-xs text-gray-500">+{template.features.length - 3} more</span>
                    )}
                  </div>

                  {/* Tech Stack */}
                  <div className="flex items-center gap-2 mb-4">
                    {template.techStack.map((tech, i) => (
                      <span key={i} className="text-xs text-[#0078d4]">
                        {tech}{i < template.techStack.length - 1 ? ' •' : ''}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(template)}
                      className="flex-1 py-2 border border-[#555] rounded-lg text-sm hover:bg-[#333] transition"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleSelectTemplate(template)}
                      className="flex-1 py-2 bg-[#0078d4] hover:bg-[#0066b8] rounded-lg text-sm font-medium transition"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTemplates.length === 0 && !selectedTemplate && (
          <div className="text-center py-12 text-gray-400">
            <span className="text-4xl block mb-4">🔍</span>
            <p>No templates found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrebuiltTemplatesGallery;
