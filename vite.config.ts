import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        priority: resolve(__dirname, 'priority.html'),
      },
    },
  },
  server: {
    watch: {
      ignored: ['**/src/assets/wedding/save-the-date-thumbs/**'],
    },
  },
})
