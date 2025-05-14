import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Custom port for the development server
    host: true, // Enable access from the network
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclude specific dependencies from optimization
  },
  base: './', // Base path for the project (useful for deployment)
});