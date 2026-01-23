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
      {/* Compact Header */}
      <div className="p-3 border-b border-[#333]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <h2 className="text-sm font-semibold">Prebuilt Templates</h2>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 hover:bg-[#333] rounded text-xs"
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
            className="w-full bg-[#2d2d2d] border border-[#444] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#0078d4] pl-7"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
        </div>
      </div>

      {/* Category Pills - Horizontal Scroll */}
      <div className="px-3 py-2 border-b border-[#333] overflow-x-auto scrollbar-none">
        <div className="flex gap-1.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition ${
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
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition flex items-center gap-1 ${
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

      {/* Templates List or Preview */}
      <div className="flex-1 overflow-auto p-2">
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
          /* Templates List - Single Column Slim Design */
          <div className="flex flex-col gap-2">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="bg-[#2d2d2d] rounded-lg overflow-hidden border border-[#444] hover:border-[#0078d4] transition group"
              >
                {/* Compact Card Layout */}
                <div className="p-3">
                  {/* Header Row */}
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-2xl flex-shrink-0">{template.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{template.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{template.description}</p>
                    </div>
                  </div>
                  
                  {/* Tech Stack - Inline */}
                  <div className="flex flex-wrap items-center gap-1 mb-2">
                    {template.techStack.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[10px] text-[#0078d4] bg-[#0078d4]/10 px-1.5 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                    {template.techStack.length > 3 && (
                      <span className="text-[10px] text-gray-500">+{template.techStack.length - 3}</span>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handlePreview(template)}
                      className="flex-1 py-1.5 border border-[#555] rounded text-xs hover:bg-[#333] transition"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleSelectTemplate(template)}
                      className="flex-1 py-1.5 bg-[#0078d4] hover:bg-[#0066b8] rounded text-xs font-medium transition"
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
