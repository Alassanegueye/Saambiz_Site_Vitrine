import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

/* Le site des boutiques est chargé à la demande.
   Un client arrive sur /b/<boutique> par un lien WhatsApp ou un QR code collé
   sur une devanture : il n'a aucune raison de télécharger au passage la page
   de présentation de la marketplace, ni l'inverse. Sur un forfait mobile
   sénégalais, ces kilo-octets se paient. */
const BoutiqueLayout = lazy(() => import('./boutique/BoutiqueLayout'));
const Apercu = lazy(() => import('./boutique/Apercu'));

/* Écran d'attente le temps que le module de la boutique arrive. Volontairement
   nu : afficher un logo SaamBiz ici ferait clignoter une marque que le client
   du vendeur ne connaît pas encore. */
function Chargement() {
  return (
    <div className="vitrine-attente" role="status" aria-live="polite">
      <span className="vitrine-attente__rond" aria-hidden="true" />
      <span className="sr-only">Chargement…</span>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Le site de SaamBiz */}
      <Route path="/" element={<LandingPage />} />

      {/* Le site d'une boutique. Le préfixe /b/ isole les vitrines des pages
          de SaamBiz : sans lui, une boutique nommée « contact » ou « aide »
          masquerait une page du site principal, et la liste des noms à
          interdire grandirait à chaque page ajoutée. */}
      <Route
        path="/b/:slug/*"
        element={
          <Suspense fallback={<Chargement />}>
            <BoutiqueLayout />
          </Suspense>
        }
      />

      {/* Aperçu du site dans le tableau de bord du vendeur (iframe). */}
      <Route
        path="/apercu"
        element={
          <Suspense fallback={<Chargement />}>
            <Apercu />
          </Suspense>
        }
      />

      {/* Tout le reste retombe sur la page d'accueil : mieux vaut présenter
          SaamBiz qu'afficher une page d'erreur à quelqu'un qui a mal recopié
          une adresse trouvée sur une devanture. */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
