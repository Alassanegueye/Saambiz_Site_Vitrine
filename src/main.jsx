import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { surveillerNouvelleVersion } from './utils/nouvelleVersion';

// Onglet ouvert avant un déploiement : recharger plutôt qu'afficher une page vide.
surveillerNouvelleVersion();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter et non HashRouter : l'adresse d'une boutique est
        imprimée sur des cartes de visite et collée sur des devantures.
        saambiz.com/b/chez-fatou se recopie ; saambiz.com/#/b/chez-fatou non.
        L'hébergement doit renvoyer index.html sur toutes les routes. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
