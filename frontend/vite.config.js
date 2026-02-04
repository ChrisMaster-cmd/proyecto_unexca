import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- Esta es la clave

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- Esto activa los estilos en el navegador
  ],
})