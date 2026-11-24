import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { chargerProduits } from '../api';
import { GrilleProduits, SqueletteGrille, EtatVide, EntetePage } from '../composants';

/**
 * « Nos produits » : le catalogue complet d'une boutique, filtré par
 * catégorie, trié, paginé.
 *
 * L'état vit dans l'URL et non dans le composant. Une sélection filtrée se
 * partage alors par simple copie du lien — ce que fait un vendeur toute la
 * journée sur WhatsApp : « voilà mes boubous ». Le bouton Retour du
 * navigateur retrouve aussi l'écran précédent, au lieu de sortir du
 * catalogue d'un coup.
 */

const TRIS = [
  { valeur: 'pertinence', libelle: 'Suggestions' },
  { valeur: 'nouveaute', libelle: 'Nouveautés' },
  { valeur: 'prix_asc', libelle: 'Prix croissant' },
  { valeur: 'prix_desc', libelle: 'Prix décroissant' },
  { valeur: 'populaire', libelle: 'Les plus vus' },
];

/* Douze produits sur l'accueil : trois rangées sur ordinateur, six sur
   téléphone. La suite est sur « Nos produits ». */
const LIMITE_ACCUEIL = 12;
const LIMITE_PAGE = 24;

/**
 * `integre` : affiché sur la page d'accueil, comme section « Nos produits »
 * (titre de section, pas de tri ni de pagination, un bouton vers la page
 * complète quand il y a plus à voir).
 */
export default function Catalogue({ boutique, categories, integre = false, produitsLocaux = null }) {
  const [params, setParams] = useSearchParams();
  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState(null);
  // Incrémenté par « Réessayer » : c'est ce qui redéclenche la requête après
  // un échec, sans que l'URL n'ait bougé.
  const [tentative, setTentative] = useState(0);

  const base = `/b/${boutique.slug}`;
  const q = params.get('q') || '';
  const categorie = params.get('categorie') || '';
  const tri = integre ? 'pertinence' : (params.get('tri') || 'pertinence');
  const page = integre ? 1 : (Number(params.get('page')) || 1);
  const limite = integre ? LIMITE_ACCUEIL : LIMITE_PAGE;

  const format = boutique.theme.modele === 'catalogue' ? 'ligne'
    : boutique.theme.modele === 'galerie' ? 'grande' : 'carte';

  /* La requête en cours, résumée en une chaîne. `chargement` s'en déduit :
     tant que ce qui est affiché ne correspond pas à ce qui est demandé, on
     charge. Un état booléen de plus, mis à jour dans l'effet, ferait un
     rendu supplémentaire à chaque changement de filtre pour dire la même
     chose. */
  const demande = `${q}|${categorie}|${tri}|${page}|${limite}|${tentative}`;
  const [affichee, setAffichee] = useState(null);
  const chargement = affichee !== demande;

  useEffect(() => {
    // Aperçu du tableau de bord : le catalogue est fourni, rien à charger.
    if (produitsLocaux) return undefined;
    // Le drapeau écarte la réponse d'une requête dépassée : en changeant
    // vite de filtre, deux requêtes peuvent être en vol, et rien ne garantit
    // qu'elles reviennent dans l'ordre où elles sont parties.
    let annule = false;

    chargerProduits(boutique.slug, { q, categorie, tri, page, limit: limite })
      .then((d) => { if (!annule) { setDonnees(d); setErreur(null); } })
      .catch((e) => { if (!annule) { setDonnees(null); setErreur(e.message); } })
      .finally(() => { if (!annule) setAffichee(demande); });

    return () => { annule = true; };
  }, [boutique.slug, q, categorie, tri, page, limite, demande, produitsLocaux]);

  /* Un filtre change → on repart à la page 1. Sans cela, passer de « page 4
     de tout le catalogue » à une catégorie qui tient sur une page affiche un
     résultat vide, et le client conclut que la catégorie l'est aussi. */
  const haut = useRef(null);
  const majParam = (cle, valeur) => {
    const suivants = new URLSearchParams(params);
    if (valeur) suivants.set(cle, valeur); else suivants.delete(cle);
    if (cle !== 'page') suivants.delete('page');
    setParams(suivants, { replace: cle === 'q' });
    // Page suivante : on remonte au début de la liste, sinon le client
    // reste devant les boutons de pagination et ne voit pas ce qui a changé.
    if (cle === 'page') haut.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filtreActif = Boolean(q || categorie || tri !== 'pertinence');

  // Aperçu : filtre fait sur place, sans pagination.
  let vue = { donnees, chargement, erreur };
  if (produitsLocaux) {
    const motif = q.toLowerCase();
    const liste = produitsLocaux.filter((p) => (!categorie || p.categorieId === categorie)
      && (!motif || p.nom.toLowerCase().includes(motif)));
    vue = {
      donnees: { produits: liste.slice(0, limite), total: liste.length, page: 1, pages: 1 },
      chargement: false,
      erreur: null,
    };
  }
  const nomCategorie = categories.find((c) => c.id === categorie)?.nom;
  const titre = q ? `Résultats pour « ${q} »` : (nomCategorie || 'Nos produits');
  const resteAVoir = integre && vue.donnees && vue.donnees.total > vue.donnees.produits.length;

  const puces = categories.length > 1 && (
    <div className="bq-puces bq-puces--defile" role="group" aria-label="Filtrer par catégorie">
      <button
        type="button"
        className={`bq-puce ${!categorie ? 'est-active' : ''}`}
        aria-pressed={!categorie}
        onClick={() => majParam('categorie', '')}
      >
        Tout
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          className={`bq-puce ${categorie === c.id ? 'est-active' : ''}`}
          aria-pressed={categorie === c.id}
          onClick={() => majParam('categorie', c.id)}
        >
          {c.nom}
        </button>
      ))}
    </div>
  );

  const liste = (
    <>
      {vue.chargement && <SqueletteGrille nombre={8} format={format} />}

      {!vue.chargement && vue.erreur && (
        <EtatVide
          titre="Les produits n'ont pas pu être chargés"
          texte={vue.erreur}
          action={(
            <button type="button" className="bq-bouton" onClick={() => setTentative((n) => n + 1)}>
              Réessayer
            </button>
          )}
        />
      )}

      {!vue.chargement && !vue.erreur && vue.donnees?.produits.length === 0 && (
        <EtatVide
          titre={filtreActif ? 'Aucun produit ne correspond' : 'Pas encore de produit en ligne'}
          texte={filtreActif
            ? 'Choisissez une autre catégorie, ou affichez tous les produits.'
            : `${boutique.nom} prépare son catalogue. Écrivez-lui sur WhatsApp pour savoir ce qui arrive.`}
          action={filtreActif ? (
            <button type="button" className="bq-bouton" onClick={() => setParams({})}>
              Voir tous les produits
            </button>
          ) : null}
        />
      )}

      {!vue.chargement && !vue.erreur && vue.donnees?.produits.length > 0 && (
        <>
          <GrilleProduits produits={vue.donnees.produits} slug={boutique.slug} format={format} />

          {resteAVoir && (
            <div className="bq-voir-tout">
              <Link to={`${base}/produits${categorie ? `?categorie=${categorie}` : ''}`}
                className="bq-bouton bq-bouton--doux bq-bouton--grand">
                Voir tous nos produits
              </Link>
            </div>
          )}

          {!integre && vue.donnees.pages > 1 && (
            <nav className="bq-pagination" aria-label="Pages du catalogue">
              <button
                type="button"
                className="bq-bouton bq-bouton--doux"
                disabled={page <= 1}
                onClick={() => majParam('page', String(page - 1))}
              >
                <ChevronLeft size={17} strokeWidth={2.4} aria-hidden="true" /> Précédent
              </button>
              <span>Page {vue.donnees.page} sur {vue.donnees.pages}</span>
              <button
                type="button"
                className="bq-bouton bq-bouton--doux"
                disabled={page >= vue.donnees.pages}
                onClick={() => majParam('page', String(page + 1))}
              >
                Suivant <ChevronRight size={17} strokeWidth={2.4} aria-hidden="true" />
              </button>
            </nav>
          )}
        </>
      )}
    </>
  );

  /* Sur l'accueil : un titre de section, les catégories, la liste. */
  if (integre) {
    return (
      <div className="bq-section bq-catalogue bq-catalogue--integre" id="produits" ref={haut}>
        <div className="bq-titre-section">
          <h2>{titre}</h2>
        </div>
        {puces}
        {liste}
      </div>
    );
  }

  /* La page « Nos produits » : son en-tête, puis les catégories et le tri
     sur une même ligne. */
  return (
    <>
      <EntetePage
        boutique={boutique}
        titre={titre}
        fil={nomCategorie
          ? [{ libelle: 'Nos produits', lien: `${base}/produits` }, { libelle: nomCategorie }]
          : [{ libelle: 'Nos produits' }]}
      />
      <div className="bq-section bq-catalogue" ref={haut}>
        <div className="bq-filtres">
          {puces || <span />}
          <label className="bq-select">
            <ArrowUpDown size={16} strokeWidth={2.2} aria-hidden="true" />
            <span className="sr-only">Trier les produits</span>
            <select value={tri} onChange={(e) => majParam('tri', e.target.value)}>
              {TRIS.map((t) => <option key={t.valeur} value={t.valeur}>{t.libelle}</option>)}
            </select>
          </label>
        </div>
        {liste}
      </div>
    </>
  );
}
