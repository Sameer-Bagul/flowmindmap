
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      '4470f2ac-931e-4123-b8a5-cedb40bc0d2f.lovableproject.com',
    ],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [
        '@tiptap/suggestion',
        'ace-builds/src-noconflict/mode-javascript',
        'ace-builds/src-noconflict/mode-python',
        'ace-builds/src-noconflict/mode-typescript',
        'ace-builds/src-noconflict/theme-github',
        'ace-builds/src-noconflict/theme-monokai',
        'ace-builds/src-noconflict/theme-tomorrow_night',
        'ace-builds/src-noconflict/ext-language_tools'
      ]
    }
  },
  worker: {
    format: 'es'
  }
}));
