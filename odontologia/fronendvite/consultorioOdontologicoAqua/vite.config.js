import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ELECTRON_BUILD=true  → base './' for file:// loading (desktop)
// default              → base '/'  for web hosting (Vercel / dev server)
export default defineConfig({
  plugins: [react()],
  base: process.env.ELECTRON_BUILD ? './' : '/',
})
