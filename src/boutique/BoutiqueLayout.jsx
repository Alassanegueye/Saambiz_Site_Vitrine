import { useEffect, useState } from 'react';
import { Routes, Route, useParams, useLocation, Link } from 'react-router-dom';
import { chargerBoutique } from './api';
import { variablesTheme } from './theme';
import { FournisseurPanier } from './panier';
import BarreHaut from './BarreHaut';
import PanierFlottant from './PanierFlottant';
import Pied from './Pied';
import AppelApplication from './AppelApplication';
import InviteApplication from './InviteApplication';
import './vitrine.css';

import Accueil from './pages/Accueil';
import Catalogue from './pages/Catalogue';
import Produit from './pages/Produit';
import Panier from './pages/Panier';
import Commande from './pages/Commande';
import Confirmation from './pages/Confirmation';
import Suivi from './pages/Suivi';

/**
 * Le site d'une boutique, de bout en bout.
 *
 * Une seule requête au chargement rapporte la boutique, son thème, ses
 * catégories, ses produits mis en avant et ses avis : la page d'accueil se
 * peint en un aller-retour. Les pages internes se contentent ensuite de
 * charger ce qui leur manque.
 */

/** Le nom de la boutique dans l'onglet, pas celui de SaamBiz. */
function useTitrePage(boutique, pathname) {
  useEffect(() => {
    if (!boutique) return;

    const suffixe = boutique.nom;
    const parPage = {
      '/catalogue': `Boutique — ${suffixe}`,
      '/panier': `Mon panier — ${suffixe}`,
      '/commande': `Commander — ${suffixe}`,
      '/suivi': `Suivre ma commande — ${suffixe}`,
    };
    const cle = Object.keys(parPage).find((k) => pathname.endsWith(k));
    document.title = cle ? parPage[cle] : `${suffixe}${boutique.slogan ? ` — ${boutique.slogan}` : ''}`;

    // La description est lue par WhatsApp et Facebook quand le vendeur colle
    // son lien : sans elle, l'aperçu reprend celui de SaamBiz et le client
    // croit avoir reçu un lien vers la marketplace.
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        'content',
        boutique.description || boutique.slogan
          || `Découvrez le catalogue de ${boutique.nom} et commandez en ligne.`
      );
    }
  }, [boutique, pathname]);
}

/** Le haut de page à chaque navigation — le navigateur garde sinon le scroll. */
function useRemonter(pathname) {
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
}

function Attente() {
  return (
    <div className="vitrine-attente" role="status" aria-live="polite">
      <span className="vitrine-attente__rond" aria-hidden="true" />
      <span className="sr-only">Chargement de la boutique…</span>
    </div>
  );
}

/**
 * Boutique inexistante, fermée, ou hors ligne. On ne distingue pas les cas :
 * pour le visiteur ils se ressemblent, et pour le vendeur d'à côté il n'y a
 * rien à apprendre de l'état d'une boutique concurrente.
 */
function Introuvable({ message }) {
  return (
    <div className="bq-introuvable">
      <h1>Boutique introuvable</h1>
      <p>{message || "Cette boutique n'existe pas ou n'est plus en ligne."}</p>
      <p className="bq-introuvable__aide">
        Vérifiez l'adresse, ou demandez son lien au commerçant.
      </p>
      <Link to="/" className="bq-bouton bq-bouton--sombre">Découvrir SaamBiz</Link>
    </div>
  );
}

/**
 * Tout le site autour des pages : thème, barre du haut, pied, panier.
 * Partagé avec l'aperçu du tableau de bord (`apercu`), qui n'affiche que
 * l'accueil.
 */
export function CoquilleBoutique({ donnees, apercu = false }) {
  const location = useLocation();
  const [panierOuvert, setPanierOuvert] = useState(false);
  const { boutique } = donnees;
  const base = `/b/${boutique.slug}`;
  const estAccueil = apercu || location.pathname.replace(/\/+$/, '') === base;

  return (
    <FournisseurPanier slug={apercu ? `apercu-${boutique.slug}` : boutique.slug}>
      {/* Le thème du vendeur ne vit que dans ces variables CSS, posées sur la
          racine du site : les composants lisent --bq-accent, --bq-sur-accent… */}
      <div
        className={`vitrine vitrine--${boutique.theme.modele}${apercu ? ' vitrine--apercu' : ''}`}
        style={variablesTheme(boutique.theme.accent)}
      >
        {!estAccueil && <BarreHaut boutique={boutique} />}

        <main className="bq-main">
          {apercu ? <Accueil donnees={donnees} apercu /> : (
            <Routes>
              <Route index element={<Accueil donnees={donnees} />} />
              <Route path="catalogue" element={<Catalogue boutique={boutique} categories={donnees.categories} />} />
              <Route path="produit/:produitId" element={<Produit boutique={boutique} />} />
              <Route path="panier" element={<Panier boutique={boutique} />} />
              <Route path="commande" element={<Commande boutique={boutique} />} />
              <Route path="confirmation" element={<Confirmation boutique={boutique} />} />
              <Route path="suivi" element={<Suivi boutique={boutique} />} />
              <Route path="suivi/:reference" element={<Suivi boutique={boutique} />} />
              {/* Une sous-page inconnue ramène à la boutique, pas à une erreur :
                  le client a probablement suivi un lien tronqué. */}
              <Route path="*" element={<Accueil donnees={donnees} />} />
            </Routes>
          )}
        </main>

        {/* L'appel à installer l'application, en bas de chaque page — sauf la
            confirmation, qui a le sien. */}
        {!location.pathname.endsWith('/confirmation') && (
          <AppelApplication boutique={boutique} />
        )}

        <Pied boutique={boutique} />

        <PanierFlottant boutique={boutique} ouvert={panierOuvert} setOuvert={setPanierOuvert} />
        <InviteApplication boutique={boutique} />
      </div>
    </FournisseurPanier>
  );
}

function Boutique({ slug }) {
  const location = useLocation();

  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    // Le drapeau coupe les réponses qui arrivent après le démontage.
    let annule = false;

    chargerBoutique(slug)
      .then((d) => { if (!annule) { setDonnees(d); setErreur(null); } })
      .catch((e) => { if (!annule) { setDonnees(null); setErreur(e.message); } })
      .finally(() => { if (!annule) setChargement(false); });

    return () => { annule = true; };
  }, [slug]);

  useTitrePage(donnees?.boutique, location.pathname);
  useRemonter(location.pathname);

  if (chargement) return <Attente />;
  if (erreur || !donnees) return <Introuvable message={erreur} />;

  return <CoquilleBoutique donnees={donnees} />;
}

export default function BoutiqueLayout() {
  const { slug } = useParams();

  // La clé remonte tout le site quand on passe d'une boutique à une autre :
  // panier, données chargées et état des pages repartent de zéro. Sans elle,
  // React réutiliserait les composants et afficherait un instant le catalogue
  // de la boutique précédente sous le nom de la nouvelle.
  return <Boutique key={slug} slug={slug} />;
}
