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

/* Le suivi par lien : le client y arrive depuis son email, sans passer par
   une boutique — un même lien peut couvrir des commandes faites chez
   plusieurs vendeurs, il vit donc à la racine du site. */
const SuiviParLien = lazy(() => import('./suivi/SuiviParLien'));

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

      {/* Suivi d'une commande par le lien reçu par email. Sans jeton, on
          affiche directement le formulaire de demande : c'est l'adresse que
          quelqu'un tape de mémoire quand il a perdu son lien. */}
      <Route
        path="/suivi/:jeton"
        element={
          <Suspense fallback={<Chargement />}>
            <SuiviParLien />
          </Suspense>
        }
      />
      <Route
        path="/suivi"
        element={
          <Suspense fallback={<Chargement />}>
            <SuiviParLien />
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
