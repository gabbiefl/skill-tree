import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  // O GitHub Pages publica em /skill-tree/, então os arquivos precisam saber esse prefixo.
  base: '/skill-tree/',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts'],
  },
})
