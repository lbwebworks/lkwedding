import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { statSync } from 'node:fs'

// Modified time (ms since epoch) of a data file, read at build time. The pages
// compare this against the timestamp they saved to localStorage so that when a
// data file is edited (and rebuilt), a reload loads the fresh file data rather
// than stale saved state — while a coordinator's later local edits still win.
const dataMtime = (relativePath: string): number => {
  try {
    return Math.floor(statSync(resolve(__dirname, relativePath)).mtimeMs)
  } catch {
    return 0
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  define: {
    __ROSTER_DATA_MTIME__: JSON.stringify(dataMtime('src/data/rosterData.ts')),
    __SITE_DATA_MTIME__: JSON.stringify(dataMtime('src/data/siteData.ts')),
    __SEATPLAN_DATA_MTIME__: JSON.stringify(dataMtime('src/data/seatPlanData.ts')),
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        roster: resolve(__dirname, 'roster.html'),
        seatplan: resolve(__dirname, 'seatplan.html'),
      },
    },
  },
  server: {
    watch: {
      ignored: ['**/src/assets/wedding/save-the-date-thumbs/**'],
    },
  },
})
