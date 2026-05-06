import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages needs /todo/ prefix; Vercel serves from root
const base = process.env.GITHUB_ACTIONS ? '/todo/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
