import { Link } from 'react-router-dom';
import { Star, ImageOff, Plus, Check, ShoppingBag, ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { formaterPrix } from './api';
import { usePanier } from './panierContexte';
import { inviterApplication } from './stores';

/* Petits composants partagés par toutes les pages du site d'une boutique.
   Regroupés dans un fichier : chacun tient en quinze lignes, et quinze
   fichiers de quinze lignes coûtent plus à lire qu'à écrire. */

/* ── Note en étoiles ─────────────────────────────────────────────── */
export function Etoiles({ note, taille = 15 }) {
  if (note == null) return null;
  return (
    <span className="bq-etoiles" aria-label={`Note : ${note} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={taille}
          strokeWidth={2}
          /* Demi-étoile arrondie au plus proche : afficher 4,3 étoiles pleines
             n'a pas de sens visuel, et le chiffre exact est écrit à côté. */
          className={i <= Math.round(note) ? 'bq-etoile bq-etoile--pleine' : 'bq-etoile'}
        />
      ))}
    </span>
  );
}

/* ── Image de produit ────────────────────────────────────────────── */
/* Un vendeur qui saisit son catalogue depuis son téléphone oublie parfois la
   photo, ou téléverse un fichier qui ne se charge pas. Un carré vide au
   milieu d'une grille fait croire à un site cassé : on montre une marque
   explicite à la place. */
export function ImageProduit({ src, alt, className = '' }) {
  const [casse, setCasse] = useState(false);

  if (!src || casse) {
    return (
      <div className={`bq-image bq-image--absente ${className}`} role="img" aria-label={alt}>
        <ImageOff size={26} strokeWidth={1.5} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`bq-image ${className}`}
      loading="lazy"
      decoding="async"
      onError={() => setCasse(true)}
    />
  );
}

/* ── Prix ────────────────────────────────────────────────────────── */
export function Prix({ produit, grand = false }) {
  return (
    <p className={`bq-prix ${grand ? 'bq-prix--grand' : ''}`}>
      <span className="bq-prix__valeur">{formaterPrix(produit.prix)}</span>
      {produit.prixBarre != null && (
        <>
          <s className="bq-prix__barre">{formaterPrix(produit.prixBarre)}</s>
          <span className="bq-pastille bq-pastille--remise">−{produit.remise}%</span>
        </>
      )}
    </p>
  );
}

/* ── Bouton « ajouter au panier » ────────────────────────────────── */
/* La confirmation est locale au bouton et dure une seconde et demie : sur un
   téléphone, une notification en haut de l'écran passe hors du champ de
   vision de quelqu'un qui regarde une grille de produits. */
export function BoutonAjouter({ produit, quantite = 1, bloc = false, slug, children }) {
  const { ajouter } = usePanier();
  const [ajoute, setAjoute] = useState(false);

  // Un produit à options — tailles, couleurs, pointures — ne peut pas être
  // ajouté depuis une grille : le client doit d'abord choisir. Le bouton
  // devient donc un lien vers la fiche, sans quoi la commande partirait avec
  // une taille choisie par personne.
  const aDesOptions = Object.values(produit.attributs || {})
    .some((v) => Array.isArray(v) && v.length > 0);

  if (aDesOptions && slug) {
    return (
      <Link
        to={`/b/${slug}/produit/${produit.id}`}
        className={`bq-bouton bq-bouton--fantome ${bloc ? 'bq-bouton--bloc' : ''}`}
      >
        Choisir
      </Link>
    );
  }

  if (!produit.disponible) {
    return (
      <button type="button" className={`bq-bouton bq-bouton--sourd ${bloc ? 'bq-bouton--bloc' : ''}`} disabled>
        Épuisé
      </button>
    );
  }

  const cliquer = () => {
    ajouter(produit, quantite);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={cliquer}
      className={`bq-bouton ${bloc ? 'bq-bouton--bloc' : ''} ${ajoute ? 'bq-bouton--ok' : ''}`}
    >
      {ajoute
        ? (<><Check size={17} strokeWidth={2.5} aria-hidden="true" /> Ajouté</>)
        : (<><Plus size={17} strokeWidth={2.5} aria-hidden="true" /> {children || 'Ajouter'}</>)}
    </button>
  );
}

/* ── Bouton rond « ajouter au panier » (cartes produits) ──────────── */
export function BoutonPanierRond({ produit, slug }) {
  const { ajouter } = usePanier();
  const [ajoute, setAjoute] = useState(false);
  const aDesOptions = Object.values(produit.attributs || {})
    .some((v) => Array.isArray(v) && v.length > 0);

  // Un produit à options (taille, couleur…) se choisit sur sa fiche.
  if (aDesOptions && slug) {
    return (
      <Link to={`/b/${slug}/produit/${produit.id}`} className="bq-rond" aria-label={`Choisir les options de ${produit.nom}`}>
        <IconePanierPlus />
      </Link>
    );
  }
  if (!produit.disponible) {
    return (
      <button type="button" className="bq-rond bq-rond--sourd" disabled aria-label={`${produit.nom} : épuisé`}>
        <IconePanierPlus />
      </button>
    );
  }
  const cliquer = () => {
    ajouter(produit, 1);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 1300);
  };
  return (
    <button type="button" onClick={cliquer} className={`bq-rond ${ajoute ? 'est-ajoute' : ''}`}
      aria-label={ajoute ? `${produit.nom} ajouté au panier` : `Ajouter ${produit.nom} au panier`}>
      {ajoute ? <Check size={24} strokeWidth={2.6} aria-hidden="true" /> : <IconePanierPlus />}
    </button>
  );
}

function IconePanierPlus() {
  return (
    <span className="bq-rond__icone" aria-hidden="true">
      <ShoppingCart size={24} strokeWidth={2.2} />
      <Plus size={12} strokeWidth={3.4} className="bq-rond__plus" />
    </span>
  );
}

/* ── Cœur (favoris) ──────────────────────────────────────────────── */
/* Les favoris vivent dans l'application : sur le site, le cœur invite à
   la télécharger. */
export function BoutonFavori({ produit }) {
  return (
    <button type="button" className="bq-coeur" onClick={() => inviterApplication('favori')}
      aria-label={`Ajouter ${produit.nom} aux favoris (application SaamBiz)`}>
      <Heart size={22} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}

/* ── Carte produit ───────────────────────────────────────────────── */
/* `format` suit la mise en page choisie par le vendeur :
   - 'carte'   : la carte standard (modèle Classique) ;
   - 'grande'  : image plein cadre, texte en dessous (modèle Galerie) ;
   - 'ligne'   : rangée compacte, image à gauche (modèle Catalogue). */
export function CarteProduit({ produit, slug, format = 'carte' }) {
  const lien = `/b/${slug}/produit/${produit.id}`;

  if (format === 'ligne') {
    return (
      <article className="bq-ligne">
        <Link to={lien} className="bq-ligne__lien">
          <ImageProduit src={produit.image} alt={produit.nom} className="bq-ligne__image" />
          <div className="bq-ligne__texte">
            <h3 className="bq-ligne__nom">{produit.nom}</h3>
            {produit.categorie && <p className="bq-ligne__cat">{produit.categorie.nom}</p>}
            <Prix produit={produit} />
          </div>
        </Link>
        <div className="bq-ligne__action">
          <BoutonAjouter produit={produit} slug={slug} />
        </div>
      </article>
    );
  }

  return (
    <article className={`bq-carte ${format === 'grande' ? 'bq-carte--grande' : ''}`}>
      <div className="bq-carte__media">
        <Link to={lien} className="bq-carte__lien-image" tabIndex={-1} aria-hidden="true">
          <ImageProduit src={produit.image} alt={produit.nom} className="bq-carte__image" />
        </Link>
        <div className="bq-carte__pastilles">
          {produit.nouveaute && produit.remise === 0 && <span className="bq-pastille">Nouveau</span>}
          {!produit.disponible && <span className="bq-pastille bq-pastille--sourde">Épuisé</span>}
          {produit.disponible && produit.stockFaible && (
            <span className="bq-pastille bq-pastille--alerte">Dernières pièces</span>
          )}
        </div>
        {produit.remise > 0 && <span className="bq-carte__remise">−{produit.remise}%</span>}
        <BoutonFavori produit={produit} />
      </div>

      <div className="bq-carte__corps">
        <Link to={lien} className="bq-carte__nom">{produit.nom}</Link>
        <div className="bq-carte__bas">
          <div className="bq-carte__prix">
            {produit.prixBarre != null && <s>{formaterPrix(produit.prixBarre)}</s>}
            <strong>{formaterPrix(produit.prix)}</strong>
          </div>
          <BoutonPanierRond produit={produit} slug={slug} />
        </div>
      </div>
    </article>
  );
}

/* ── Grille de produits ──────────────────────────────────────────── */
export function GrilleProduits({ produits, slug, format = 'carte' }) {
  if (format === 'ligne') {
    return (
      <div className="bq-lignes">
        {produits.map((p) => <CarteProduit key={p.id} produit={p} slug={slug} format="ligne" />)}
      </div>
    );
  }
  return (
    <div className={`bq-grille ${format === 'grande' ? 'bq-grille--large' : ''}`}>
      {produits.map((p) => <CarteProduit key={p.id} produit={p} slug={slug} format={format} />)}
    </div>
  );
}

/* ── Squelettes de chargement ────────────────────────────────────── */
/* Des blocs à la forme du contenu à venir, plutôt qu'un rond qui tourne : la
   page ne saute pas quand les données arrivent, et sur une connexion lente
   le client voit tout de suite ce qui se prépare. */
export function SqueletteGrille({ nombre = 6 }) {
  return (
    <div className="bq-grille" aria-hidden="true">
      {Array.from({ length: nombre }, (_, i) => (
        <div key={i} className="bq-carte bq-squelette">
          <div className="bq-squelette__media" />
          <div className="bq-carte__corps">
            <div className="bq-squelette__ligne" />
            <div className="bq-squelette__ligne bq-squelette__ligne--courte" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── État vide ───────────────────────────────────────────────────── */
export function EtatVide({ titre, texte, action }) {
  return (
    <div className="bq-vide">
      <ShoppingBag size={34} strokeWidth={1.4} aria-hidden="true" />
      <h3>{titre}</h3>
      {texte && <p>{texte}</p>}
      {action}
    </div>
  );
}

/* ── Titre de section ────────────────────────────────────────────── */
export function TitreSection({ children, lien, libelleLien }) {
  return (
    <div className="bq-titre-section">
      <h2>{children}</h2>
      {lien && <Link to={lien} className="bq-lien-discret">{libelleLien || 'Tout voir'}</Link>}
    </div>
  );
}
