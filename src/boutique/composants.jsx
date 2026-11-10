import { Link } from 'react-router-dom';
import { Star, ImageOff, Plus, Check, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { formaterPrix, formaterMontant } from './api';
import { usePanier } from './panierContexte';
import { aDesOptions, formaterNote } from './outils';

/* Petits composants partagés par toutes les pages du site d'une boutique.
   Regroupés dans un fichier : chacun tient en quinze lignes, et quinze
   fichiers de quinze lignes coûtent plus à lire qu'à écrire. */

/* ── Note en étoiles ─────────────────────────────────────────────── */
export function Etoiles({ note, taille = 15 }) {
  if (note == null) return null;
  return (
    <span className="bq-etoiles" role="img" aria-label={`Note : ${formaterNote(note)} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={taille}
          strokeWidth={2}
          aria-hidden="true"
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
   explicite à la place. L'image apparaît en fondu une fois chargée, pour ne
   pas se dessiner ligne à ligne sur une connexion lente. */
export function ImageProduit({ src, alt, className = '', prioritaire = false }) {
  const [casse, setCasse] = useState(false);
  const [chargee, setChargee] = useState(false);

  if (!src || casse) {
    return (
      <div className={`bq-image bq-image--absente ${className}`} role="img" aria-label={alt}>
        <ImageOff size={24} strokeWidth={1.5} aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`bq-image ${chargee ? 'est-chargee' : ''} ${className}`}
      loading={prioritaire ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setChargee(true)}
      onError={() => setCasse(true)}
    />
  );
}

/* ── Montant ─────────────────────────────────────────────────────── */
/* Le nombre porte l'information, la devise ne fait que la rappeler : elle
   est écrite plus petit, pour que « 14 900 » se lise d'un coup d'œil. */
export function Montant({ valeur, className = '' }) {
  return (
    <span className={`bq-montant ${className}`}>
      {formaterMontant(valeur)}<span className="bq-montant__devise"> FCFA</span>
    </span>
  );
}

/* ── Prix ────────────────────────────────────────────────────────── */
export function Prix({ produit, grand = false }) {
  return (
    <p className={`bq-prix ${grand ? 'bq-prix--grand' : ''}`}>
      <Montant valeur={produit.prix} className="bq-prix__valeur" />
      {produit.prixBarre != null && (
        <>
          <s className="bq-prix__barre">
            <span className="sr-only">Au lieu de </span>{formaterPrix(produit.prixBarre)}
          </s>
          <span className="bq-pastille bq-pastille--remise">−{produit.remise} %</span>
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

  // Un produit à options ne peut pas être ajouté depuis une liste : le
  // bouton devient un lien vers la fiche, sans quoi la commande partirait
  // avec une taille choisie par personne.
  if (aDesOptions(produit) && slug) {
    return (
      <Link
        to={`/b/${slug}/produit/${produit.id}`}
        className={`bq-bouton bq-bouton--doux ${bloc ? 'bq-bouton--bloc' : ''}`}
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

/* ── Bouton rond « ajouter au panier » (tuiles) ───────────────────── */
export function BoutonPanierRond({ produit, slug }) {
  const { ajouter } = usePanier();
  const [ajoute, setAjoute] = useState(false);

  if (aDesOptions(produit) && slug) {
    return (
      <Link to={`/b/${slug}/produit/${produit.id}`} className="bq-rond" aria-label={`Choisir les options de ${produit.nom}`}>
        <Plus size={20} strokeWidth={2.6} aria-hidden="true" />
      </Link>
    );
  }
  if (!produit.disponible) return null;

  const cliquer = () => {
    ajouter(produit, 1);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 1300);
  };
  return (
    <button type="button" onClick={cliquer} className={`bq-rond ${ajoute ? 'est-ajoute' : ''}`}
      aria-label={ajoute ? `${produit.nom} ajouté au panier` : `Ajouter ${produit.nom} au panier`}>
      {ajoute
        ? <Check size={20} strokeWidth={2.8} aria-hidden="true" />
        : <Plus size={20} strokeWidth={2.6} aria-hidden="true" />}
    </button>
  );
}

/* ── Pastilles d'une tuile ───────────────────────────────────────── */
/* Une seule information à la fois, la plus utile au client : une remise
   avant une nouveauté, un épuisement avant tout le reste. */
function PastilleTuile({ produit }) {
  if (!produit.disponible) return <span className="bq-pastille bq-pastille--sourde">Épuisé</span>;
  if (produit.remise > 0) return <span className="bq-pastille bq-pastille--remise">−{produit.remise} %</span>;
  if (produit.stockFaible) return <span className="bq-pastille bq-pastille--alerte">Dernières pièces</span>;
  if (produit.nouveaute) return <span className="bq-pastille">Nouveau</span>;
  return null;
}

/* ── Carte produit ───────────────────────────────────────────────── */
/* `format` suit la mise en page choisie par le vendeur :
   - 'carte'   : photo carrée, produit entier (modèle Classique) ;
   - 'grande'  : photo haute qui remplit le cadre (modèle Galerie) ;
   - 'ligne'   : rangée compacte, photo à gauche (modèle Catalogue).
   Une carte simple : la photo, le nom, puis le prix et le bouton d'ajout. */
export function CarteProduit({ produit, slug, format = 'carte' }) {
  const lien = `/b/${slug}/produit/${produit.id}`;

  if (format === 'ligne') {
    return (
      <article className={`bq-ligne ${!produit.disponible ? 'est-epuise' : ''}`}>
        <Link to={lien} className="bq-ligne__lien">
          <span className="bq-ligne__media">
            <ImageProduit src={produit.image} alt={produit.nom} className="bq-ligne__image" />
          </span>
          <span className="bq-ligne__texte">
            <span className="bq-ligne__nom">{produit.nom}</span>
            {produit.categorie && <span className="bq-ligne__cat">{produit.categorie.nom}</span>}
            <Prix produit={produit} />
          </span>
        </Link>
        <div className="bq-ligne__action">
          <BoutonAjouter produit={produit} slug={slug} />
        </div>
      </article>
    );
  }

  return (
    <article className={`bq-tuile ${format === 'grande' ? 'bq-tuile--grande' : ''} ${!produit.disponible ? 'est-epuise' : ''}`}>
      <div className="bq-tuile__media">
        <Link to={lien} className="bq-tuile__lien-image" tabIndex={-1} aria-hidden="true">
          <ImageProduit src={produit.image} alt={produit.nom} className="bq-tuile__image" />
        </Link>
        <div className="bq-tuile__pastille"><PastilleTuile produit={produit} /></div>
      </div>

      <div className="bq-tuile__corps">
        <Link to={lien} className="bq-tuile__nom">{produit.nom}</Link>
        <div className="bq-tuile__bas">
          <p className="bq-tuile__prix">
            <Montant valeur={produit.prix} />
            {produit.prixBarre != null && (
              <s><span className="sr-only">Au lieu de </span>{formaterPrix(produit.prixBarre)}</s>
            )}
          </p>
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
    <div className={`bq-grille ${format === 'grande' ? 'bq-grille--grande' : ''}`}>
      {produits.map((p) => <CarteProduit key={p.id} produit={p} slug={slug} format={format} />)}
    </div>
  );
}

/* ── Squelettes de chargement ────────────────────────────────────── */
/* Des blocs à la forme du contenu à venir, plutôt qu'un rond qui tourne : la
   page ne saute pas quand les données arrivent, et sur une connexion lente
   le client voit tout de suite ce qui se prépare. */
export function SqueletteGrille({ nombre = 6, format = 'carte' }) {
  return (
    <div className={`bq-grille ${format === 'grande' ? 'bq-grille--grande' : ''}`} aria-hidden="true">
      {Array.from({ length: nombre }, (_, i) => (
        <div key={i} className={`bq-tuile bq-squelette ${format === 'grande' ? 'bq-tuile--grande' : ''}`}>
          <div className="bq-tuile__media bq-squelette__bloc" />
          <div className="bq-tuile__corps">
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
      <span className="bq-vide__icone"><ShoppingBag size={28} strokeWidth={1.6} aria-hidden="true" /></span>
      <h3>{titre}</h3>
      {texte && <p>{texte}</p>}
      {action}
    </div>
  );
}

/* ── Titre de section ────────────────────────────────────────────── */
export function TitreSection({ children, lien, libelleLien, as: Balise = 'h2' }) {
  return (
    <div className="bq-titre-section">
      <Balise>{children}</Balise>
      {lien && <Link to={lien} className="bq-lien">{libelleLien || 'Tout voir'}</Link>}
    </div>
  );
}
