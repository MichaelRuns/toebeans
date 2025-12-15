import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The repository name for GitHub Pages is 'toebeans'.
const base = '/toebeans/'

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  // Set the base path for the deployed application. 
  // This ensures that all asset links (CSS, JS, images) are correctly prefixed
  // when the app is served from https://michaelruns.github.io/toebeans/
  base: base,
  plugins: [react()],
})