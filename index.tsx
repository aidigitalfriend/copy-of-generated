
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { useStore } from './store/useStore';

// Apply theme immediately on load to prevent flash
const applyInitialTheme = () => {
  const root = document.documentElement;
  
  // Try to get persisted theme from localStorage
  let theme = 'charcoal-aurora';
  try {
    const stored = localStorage.getItem('code-editor-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      theme = parsed?.state?.theme || 'charcoal-aurora';
    }
  } catch (e) {
    // Use default theme
  }
  
  // Apply charcoal-aurora hardstyle theme classes immediately
  root.classList.add('dark', 'theme-charcoal-aurora');
  
  // Set CSS variables for charcoal-aurora hardstyle
  root.style.setProperty('--vscode-bg', '#0a0a0a');
  root.style.setProperty('--vscode-sidebar', '#0c0c0c');
  root.style.setProperty('--vscode-panel', '#0d0d0d');
  root.style.setProperty('--vscode-border', '#1a1a1a');
  root.style.setProperty('--vscode-accent', '#00d4ff');
  root.style.setProperty('--vscode-accent-hover', '#00e5ff');
  root.style.setProperty('--vscode-text', '#c8c8c8');
  root.style.setProperty('--vscode-text-muted', '#666666');
  root.style.setProperty('--vscode-selection', '#003344');
  root.style.setProperty('--vscode-hover', '#141414');
  root.style.setProperty('--vscode-active', '#1a1a1a');
};

// Apply theme before React renders
applyInitialTheme();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
