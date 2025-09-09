import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this 'server' section to configure the proxy
  server: {
    proxy: {
      // Any request that starts with '/api' will be proxied
      '/api': {
        // The target is your backend server
        target: 'http://localhost:5001',
        // This is important for preventing CORS errors
        changeOrigin: true,
      },
    },
  },
})