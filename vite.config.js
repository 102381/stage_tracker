import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// The source lives in src/. The build is written to the repository root, which is what GitHub Pages serves.
export default defineConfig({
  root: 'src',
  base: './',
  plugins: [vue()],
  build: {
    outDir: '..',
    emptyOutDir: false,
    modulePreload: { polyfill: false }
  }
})
