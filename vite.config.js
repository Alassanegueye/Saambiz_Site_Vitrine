import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5199,
    strictPort: true,
    // En développement, l'API est servie par le même hôte que le site : le
    // navigateur ne voit qu'une seule origine, donc aucune origine à ajouter
    // à CORS_ORIGIN côté backend. En production, VITE_API_BASE_URL pointe sur
    // l'API réelle et ce proxy n'existe pas.
    proxy: {
      '/saambiz': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        // Le site des boutiques et la page d'accueil de SaamBiz ne sont
        // jamais consultés ensemble : un client arrive sur /b/<boutique> par
        // un lien WhatsApp, il n'a aucune raison de télécharger la page de
        // présentation de la marketplace — ni l'inverse. Le découpage garde
        // chaque première visite légère, ce qui compte sur un forfait mobile.
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor'
          if (id.includes('node_modules/react-router')) return 'router'
          if (id.includes('node_modules/framer-motion')) return 'motion'
          if (id.includes('node_modules/lucide-react')) return 'icones'
        },
      },
    },
  },
})
