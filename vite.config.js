import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
=======

  // ⭐ REQUIRED FIX for amazon-cognito-identity-js
  define: {
    global: {},
  },
>>>>>>> feature/test
})
