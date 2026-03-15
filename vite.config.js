import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/asplikacia-Pocasie/', // <-- TOTO SEM PRIDAJ (názov tvojho repozitára v lomítkach)
})
