import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../backend/public",
    emptyOutDir: true,
    target: "esnext",
    cssTarget: "chrome100",
    minify: false,
  },
});
