import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { chargerProduits } from '../api';
import { GrilleProduits, SqueletteGrille, EtatVide } from '../composants';

/**
 * Le catalogue complet d'une boutique : recherche, filtre par rayon, tri,
 * pagination.
 *
 * L'état vit dans l'URL et non dans le composant. Une recherche filtrée se
 * partage alors par simple copie du lien — ce que fait un vendeur toute la
 * journée sur WhatsApp : « voilà mes boubous à moins de 20 000 ». Le bouton
 * Retour du navigateur retrouve aussi l'écran précédent, au lieu de sortir du
 * catalogue d'un coup.
 */

const TRIS = [
  { valeur: 'pertinence', libelle: 'Suggestions' },
  { valeur: 'nouveaute', libelle: 'Nouveautés' },
  { valeur: 'prix_asc', libelle: 'Prix croissant' },
  { valeur: 'prix_desc', libelle: 'Prix décroissant' },
  { valeur: 'populaire', libelle: 'Les plus vus' },
];

/**
 * `integre` : affiché sur la page d'accueil, sous l'identité de la boutique,
 * comme section « Nos produits » (titre plus discret, pas de lien retour).
 */
export default function Catalogue({ boutique, categories, integre = false, sansPuces = false, produitsLocaux = null }) {
  const [params, setParams] = useSearchParams();
  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [saisie, setSaisie] = useState(params.get('q') || '');
  // Incrémenté par « Réessayer » : c'est ce qui redéclenche la requête après
  // un échec, sans que l'URL n'ait bougé.
  const [tentative, setTentative] = useState(0);

  const q = params.get('q') || '';
  const categorie = params.get('categorie') || '';
  const tri = params.get('tri') || 'pertinence';
  const page = Number(params.get('page')) || 1;

  const format = boutique.theme.modele === 'catalogue' ? 'ligne'
    : boutique.theme.modele === 'galerie' ? 'grande' : 'carte';

  /* La requête en cours, résumée en une chaîne. `chargement` s'en déduit :
     tant que ce qui est affiché ne correspond pas à ce qui est demandé, on
     charge. Un état booléen de plus, mis à jour dans l'effet, ferait un
     rendu supplémentaire à chaque changement de filtre pour dire la même
     chose. */
  const demande = `${q}|${categorie}|${tri}|${page}|${tentative}`;
  const [affichee, setAffichee] = useState(null);
  const chargement = affichee !== demande;

  useEffect(() => {
    // Aperçu du tableau de bord : le catalogue est fourni, rien à charger.
    if (produitsLocaux) return undefined;
    // Le drapeau écarte la réponse d'une requête dépassée : en tapant vite,
    // deux recherches peuvent être en vol, et rien ne garantit qu'elles
    // reviennent dans l'ordre où elles sont parties.
    let annule = false;

    chargerProduits(boutique.slug, { q, categorie, tri, page, limit: 24 })
      .then((d) => { if (!annule) { setDonnees(d); setErreur(null); } })
      .catch((e) => { if (!annule) { setDonnees(null); setErreur(e.message); } })
      .finally(() => { if (!annule) setAffichee(demande); });

    return () => { annule = true; };
  }, [boutique.slug, q, categorie, tri, page, demande, produitsLocaux]);

  /* Un filtre change → on repart à la page 1. Sans cela, passer de « page 4
     de tout le catalogue » à un rayon qui tient sur une page affiche un
     résultat vide, et le client conclut que le rayon l'est aussi. */
  const majParam = (cle, valeur) => {
    const suivants = new URLSearchParams(params);
    if (valeur) suivants.set(cle, valeur); else suivants.delete(cle);
    if (cle !== 'page') suivants.delete('page');
    setParams(suivants, { replace: cle === 'q' });
  };

  /* Recherche : on n'interroge qu'après 400 ms sans frappe. Un appel par
     lettre saturerait une connexion mobile et ferait clignoter la grille. */
  const minuteur = useRef(null);
  const changerSaisie = (valeur) => {
    setSaisie(valeur);
    clearTimeout(minuteur.current);
    minuteur.current = setTimeout(() => majParam('q', valeur.trim()), 400);
  };
  useEffect(() => () => clearTimeout(minuteur.current), []);

  const filtreActif = Boolean(q || categorie || tri !== 'pertinence');

  // Aperçu : filtre fait sur place, sans pagination.
  let vue = { donnees, chargement, erreur };
  if (produitsLocaux) {
    const motif = q.toLowerCase();
    const liste = produitsLocaux.filter((p) => (!categorie || p.categorieId === categorie)
      && (!motif || p.nom.toLowerCase().includes(motif)));
    vue = { donnees: { produits: liste, total: liste.length, page: 1, pages: 1 }, chargement: false, erreur: null };
  }
  const nomCategorie = categories.find((c) => c.id === categorie)?.nom;

  return (
    <div className={`bq-section ${integre ? 'bq-produits' : ''}`} id={integre ? 'produits' : undefined}>
      <header className="bq-catalogue__entete">
        {integre
          ? <h2>{nomCategorie || 'Nos produits'}</h2>
          : <h1>{nomCategorie || 'Tous les produits'}</h1>}
        {vue.donnees && (
          <p className="bq-catalogue__compte">
            {vue.donnees.total} {vue.donnees.total > 1 ? 'produits' : 'produit'}
            {q && <> pour « {q} »</>}
          </p>
        )}
      </header>

      {/* Sur la page de la boutique : pas de recherche ni de tri, la liste
          reste simple ; les rayons suffisent à filtrer. */}
      {!integre && (
      <div className="bq-filtres">
        <div className="bq-champ-recherche">
          <Search size={18} strokeWidth={2} aria-hidden="true" />
          <input
            type="search"
            value={saisie}
            onChange={(e) => changerSaisie(e.target.value)}
            placeholder={`Rechercher chez ${boutique.nom}…`}
            aria-label="Rechercher un produit"
          />
          {saisie && (
            <button type="button" onClick={() => changerSaisie('')} aria-label="Effacer la recherche">
              <X size={16} strokeWidth={2.4} />
            </button>
          )}
        </div>

        <label className="bq-select">
          <SlidersHorizontal size={16} strokeWidth={2} aria-hidden="true" />
          <span className="sr-only">Trier les produits</span>
          <select value={tri} onChange={(e) => majParam('tri', e.target.value)}>
            {TRIS.map((t) => <option key={t.valeur} value={t.valeur}>{t.libelle}</option>)}
          </select>
        </label>
      </div>
      )}

      {!sansPuces && categories.length > 0 && (
        <div className="bq-puces" role="group" aria-label="Filtrer par rayon">
          <button
            type="button"
            className={`bq-puce ${!categorie ? 'est-active' : ''}`}
            onClick={() => majParam('categorie', '')}
          >
            Tout
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`bq-puce ${categorie === c.id ? 'est-active' : ''}`}
              onClick={() => majParam('categorie', c.id)}
            >
              {c.nom} <span>{c.nombre}</span>
            </button>
          ))}
        </div>
      )}

      {vue.chargement && <SqueletteGrille nombre={8} />}

      {!vue.chargement && vue.erreur && (
        <EtatVide
          titre="Le catalogue n'a pas pu être chargé"
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
          titre="Aucun produit ne correspond"
          texte={filtreActif
            ? 'Essayez un autre mot, ou retirez les filtres.'
            : `${boutique.nom} n'a pas encore publié de produit.`}
          action={filtreActif ? (
            <button type="button" className="bq-bouton" onClick={() => setParams({})}>
              Voir tout le catalogue
            </button>
          ) : null}
        />
      )}

      {!vue.chargement && !vue.erreur && vue.donnees?.produits.length > 0 && (
        <>
          <GrilleProduits produits={vue.donnees.produits} slug={boutique.slug} format={format} />

          {vue.donnees.pages > 1 && (
            <nav className="bq-pagination" aria-label="Pages du catalogue">
              <button
                type="button"
                className="bq-bouton bq-bouton--fantome"
                disabled={page <= 1}
                onClick={() => majParam('page', String(page - 1))}
              >
                Précédent
              </button>
              <span>Page {vue.donnees.page} sur {vue.donnees.pages}</span>
              <button
                type="button"
                className="bq-bouton bq-bouton--fantome"
                disabled={page >= vue.donnees.pages}
                onClick={() => majParam('page', String(page + 1))}
              >
                Suivant
              </button>
            </nav>
          )}
        </>
      )}

      {!integre && (
        <p className="bq-retour">
          <Link to={`/b/${boutique.slug}`} className="bq-lien-discret">← Retour à la boutique</Link>
        </p>
      )}
    </div>
  );
}
