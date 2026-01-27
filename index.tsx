
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
  
  // Apply charcoal-aurora theme classes immediately
  root.classList.add('dark', 'theme-charcoal-aurora');
  
  // Set CSS variables for charcoal-aurora
  root.style.setProperty('--vscode-bg', '#0a0c10');
  root.style.setProperty('--vscode-sidebar', '#0e1117');
  root.style.setProperty('--vscode-panel', '#0e1117');
  root.style.setProperty('--vscode-border', '#1e2530');
  root.style.setProperty('--vscode-accent', '#00d4aa');
  root.style.setProperty('--vscode-accent-hover', '#00f5c4');
  root.style.setProperty('--vscode-text', '#e0e6ed');
  root.style.setProperty('--vscode-text-muted', '#6b7a8f');
  root.style.setProperty('--vscode-selection', '#1a3a4a');
  root.style.setProperty('--vscode-hover', '#151b24');
  root.style.setProperty('--vscode-active', '#1e2530');
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
