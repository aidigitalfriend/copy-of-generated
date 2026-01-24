/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      colors: {
        vscode: {
          bg: '#1e1e1e',
          sidebar: '#252526',
          panel: '#1e1e1e',
          border: '#3c3c3c',
          accent: '#0078d4',
          accentHover: '#1c8adb',
          text: '#cccccc',
          textMuted: '#858585',
          selection: '#264f78',
          hover: '#2a2d2e',
          active: '#37373d',
          input: '#3c3c3c',
          inputBorder: '#007acc',
          success: '#4ec9b0',
          warning: '#dcdcaa',
          error: '#f14c4c',
          listHover: '#2a2d2e',
          listActive: '#094771',
        },
        slate: {
          850: '#1e293b',
          950: '#0f172a',
        }
      },
      boxShadow: {
        'vscode': '0 0 8px rgba(0, 0, 0, 0.36)',
        'vscode-sm': '0 2px 8px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
