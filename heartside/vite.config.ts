import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    build: {
      rolldownOptions: {
        output: {
          // Keep large vendor libraries out of the entry chunk so they cache independently.
          codeSplitting: {
            groups: [
              { name: 'supabase', test: /node_modules[\\/]@supabase[\\/]/ },
              { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: 'icons', test: /node_modules[\\/]lucide-react[\\/]/ },
            ],
          },
        },
      },
    },
  };
});
