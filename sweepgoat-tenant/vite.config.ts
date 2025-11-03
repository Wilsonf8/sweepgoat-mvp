import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
    host: '0.0.0.0', // Allow access from custom domains
    strictPort: true,
    allowedHosts: [
      'localhost',
      '.localhost', // Allow all subdomains like test.localhost
      'sweepgoat.local',
      '.sweepgoat.local', // Allow all subdomains
      'sweepgoat.com',
      '.sweepgoat.com', // Allow all subdomains in production
    ],
  },
})
