import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'components': path.resolve(__dirname, 'src/components'),
      'core-ui': path.resolve(__dirname, 'src/core-ui'),
      'hooks': path.resolve(__dirname, 'src/hooks'),
      'pages': path.resolve(__dirname, 'src/pages'),
      'routes': path.resolve(__dirname, 'src/routes'),
      'services': path.resolve(__dirname, 'src/services'),
      'store': path.resolve(__dirname, 'src/store'),
      'utils': path.resolve(__dirname, 'src/utils'),
      'interfaces': path.resolve(__dirname, 'src/interfaces'),
      'constants': path.resolve(__dirname, 'src/constants'),
      'context': path.resolve(__dirname, 'src/context'),
      'api': path.resolve(__dirname, 'src/api'),
      'data': path.resolve(__dirname, 'src/data'),
      'config': path.resolve(__dirname, 'src/config'),
      'validations': path.resolve(__dirname, 'src/validations'),
      'layout-container': path.resolve(__dirname, 'src/components/layouts/layout-container'),
      'assets': path.resolve(__dirname, 'src/assets'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    },
    port: 5174,
  },
})
