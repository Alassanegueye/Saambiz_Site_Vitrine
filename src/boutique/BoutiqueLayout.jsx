import { useEffect, useState } from 'react';
import { Routes, Route, useParams, useLocation, Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { chargerBoutique } from './api';
import { variablesTheme } from './theme';
import { FournisseurPanier } from './panier';
import BarreHaut from './BarreHaut';
import PanierFlottant from './PanierFlottant';
import Pied from './Pied';
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
/**
 * La page d'accueil SaamBiz coupe tout débordement horizontal avec
 * `overflow-x: hidden` sur html et body (styles/global.css). Posé sur les
 * deux, il fait du body un conteneur de défilement qui ne défile jamais :
 * la barre du haut, collante, ne collait plus à rien. Le temps que le site
 * d'une boutique est affiché, on passe à `overflow-x: clip`, qui coupe le
 * débordement sans créer ce conteneur (voir vitrine.css).
 */
function usePageBoutique() {
  useEffect(() => {
    document.documentElement.classList.add('page-boutique');
    return () => document.documentElement.classList.remove('page-boutique');
  }, []);
}

export function CoquilleBoutique({ donnees, apercu = false }) {
  const location = useLocation();
  const [panierOuvert, setPanierOuvert] = useState(false);
  usePageBoutique();
  const { boutique } = donnees;
  const base = `/b/${boutique.slug}`;
  const chemin = location.pathname.replace(/\/+$/, '');
  const estAccueil = apercu || chemin === base;

  return (
    <FournisseurPanier slug={apercu ? `apercu-${boutique.slug}` : boutique.slug}>
      {/* Le thème du vendeur ne vit que dans ces variables CSS, posées sur la
          racine du site : les composants lisent --bq-accent, --bq-papier… */}
      <div
        className={`vitrine vitrine--${boutique.theme.modele}${apercu ? ' vitrine--apercu' : ''}${boutique.commandeActivee ? '' : ' vitrine--sans-commande'}`}
        style={variablesTheme(boutique.theme.accent)}
      >
        {boutique.annonce && (
          <p className="bq-annonce">
            <Megaphone size={15} strokeWidth={2.2} aria-hidden="true" />
            {boutique.annonce}
          </p>
        )}

        {/* Le catalogue a son propre champ de recherche, avec le tri : la
            barre du haut n'en affiche pas un second. */}
        <BarreHaut boutique={boutique} estAccueil={estAccueil}
          recherche={!apercu && chemin !== `${base}/catalogue`}
          ouvrirPanier={() => setPanierOuvert(true)} />

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

        <Pied boutique={boutique} />

        {/* Sur le panier et le passage en caisse, la bulle ferait doublon :
            le client y est déjà. */}
        <PanierFlottant boutique={boutique} ouvert={panierOuvert} setOuvert={setPanierOuvert}
          bulle={!/\/(panier|commande|confirmation)$/.test(chemin)} />
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
