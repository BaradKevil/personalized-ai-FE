import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const currentDir = import.meta.dirname || path.resolve()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@designcodeio/threeui/style.css': path.resolve(currentDir, 'src/shaders/threeui.css'),
      '@designcodeio/threeui': path.resolve(currentDir, 'src/shaders/kibori-landing-page/KiboriLandingPage.tsx'),
    },
  },
})

