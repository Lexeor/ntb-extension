import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      // /proxy/weather/* → https://api.openweathermap.org/*
      '/proxy/weather': {
        target: 'https://api.openweathermap.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/weather/, ''),
      },
      // /proxy/football/* → https://api.football-data.org/*
      '/proxy/football': {
        target: 'https://api.football-data.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/football/, ''),
      },
    },
  },
})
