import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl' 

// https://vite.dev/config/
export default defineConfig({
  build:{
     outDir: '../API/wwwroot',
     chunkSizeWarningLimit: 1500,
     emptyOutDir:true
  },
  server: {
    port: 3000
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    basicSsl(),
  ],
}
)