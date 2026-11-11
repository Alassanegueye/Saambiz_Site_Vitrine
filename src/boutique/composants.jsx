import { Link } from 'react-router-dom';
import { Star, ImageOff, Plus, Minus, ShoppingBag, ChevronRight, Globe, Ghost } from 'lucide-react';
import { Fragment, useState } from 'react';
import { formaterPrix, formaterMontant } from './api';
import { usePanier } from './panierContexte';
import { aDesOptions, finDePromo, formaterNote, lienSortant } from './outils';
// lucide ne fournit plus d'icônes de marque : voir icones.jsx.
import { Facebook, Instagram, TikTok } from './icones';
import IconeVitrine from './IconeVitrine';

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

/* ── Quantité dans le panier ──────────────────────────────────────── */
/* Une fois le produit au panier, son bouton d'ajout devient « − n + » : le
   client règle la quantité sans quitter la liste. À 1, « − » le retire et le
   bouton redevient « + ». */
function QuantitePanier({ ligne, produit, petite = false }) {
  const { changerQuantite } = usePanier();
  const q = ligne.quantite;
  return (
    <div className={`bq-pas ${petite ? 'bq-pas--petit' : ''}`} role="group" aria-label={`Quantité de ${produit.nom} dans le panier`}>
      <button type="button" onClick={() => changerQuantite(ligne.cle, q - 1)}
        aria-label={q <= 1 ? `Retirer ${produit.nom} du panier` : `Un ${produit.nom} de moins`}>
        <Minus size={petite ? 16 : 17} strokeWidth={2.6} aria-hidden="true" />
      </button>
      <span aria-live="polite">{q}</span>
      <button type="button" onClick={() => changerQuantite(ligne.cle, q + 1)} disabled={q >= 99}
        aria-label={`Un ${produit.nom} de plus`}>
        <Plus size={petite ? 16 : 17} strokeWidth={2.6} aria-hidden="true" />
      </button>
    </div>
  );
}

/** La ligne du panier d'un produit sans options (sa clé est son id). */
function useLigneProduit(produit) {
  const { lignes } = usePanier();
  return lignes.find((l) => l.cle === produit.id) || null;
}

/* ── Bouton « ajouter au panier » ────────────────────────────────── */
export function BoutonAjouter({ produit, quantite = 1, bloc = false, slug, children }) {
  const { ajouter } = usePanier();
  const ligne = useLigneProduit(produit);

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

  if (ligne) return <QuantitePanier ligne={ligne} produit={produit} />;

  return (
    <button
      type="button"
      onClick={() => ajouter(produit, quantite)}
      className={`bq-bouton ${bloc ? 'bq-bouton--bloc' : ''}`}
    >
      <Plus size={17} strokeWidth={2.5} aria-hidden="true" /> {children || 'Ajouter'}
    </button>
  );
}

/* ── Bouton rond « ajouter au panier » (tuiles) ───────────────────── */
export function BoutonPanierRond({ produit, slug }) {
  const { ajouter } = usePanier();
  const ligne = useLigneProduit(produit);

  if (aDesOptions(produit) && slug) {
    return (
      <Link to={`/b/${slug}/produit/${produit.id}`} className="bq-rond" aria-label={`Choisir les options de ${produit.nom}`}>
        <Plus size={20} strokeWidth={2.6} aria-hidden="true" />
      </Link>
    );
  }
  if (!produit.disponible) return null;
  if (ligne) return <QuantitePanier ligne={ligne} produit={produit} petite />;

  return (
    <button type="button" onClick={() => ajouter(produit, 1)} className="bq-rond"
      aria-label={`Ajouter ${produit.nom} au panier`}>
      <Plus size={20} strokeWidth={2.6} aria-hidden="true" />
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
        {produit.prixBarre != null && finDePromo(produit.finPromo) && (
          <p className="bq-tuile__fin">{finDePromo(produit.finPromo)}</p>
        )}
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
export function EtatVide({ titre, texte, action, icone: Icone = ShoppingBag }) {
  return (
    <div className="bq-vide">
      <span className="bq-vide__icone"><Icone size={28} strokeWidth={1.6} aria-hidden="true" /></span>
      <h3>{titre}</h3>
      {texte && <p>{texte}</p>}
      {action && <div className="bq-vide__actions">{action}</div>}
    </div>
  );
}

/* ── En-tête d'une page ──────────────────────────────────────────── */
/* Le fil d'Ariane et le titre de la page, sur la teinte de la boutique :
   la même bande que l'identité de l'accueil, en plus mince. Le dernier
   maillon du fil est la page elle-même, sans lien. */
export function EntetePage({ boutique, titre, fil = [], children }) {
  const base = `/b/${boutique.slug}`;
  return (
    <header className="bq-bandeau">
      <div className="bq-bandeau__interieur">
        <nav className="bq-fil" aria-label="Fil d'Ariane">
          <Link to={base}>Accueil</Link>
          {fil.map((e) => (
            <Fragment key={e.libelle}>
              <ChevronRight size={14} strokeWidth={2.4} aria-hidden="true" />
              {e.lien ? <Link to={e.lien}>{e.libelle}</Link> : <span aria-current="page">{e.libelle}</span>}
            </Fragment>
          ))}
        </nav>
        <h1 className="bq-bandeau__titre">{titre}</h1>
        {children}
      </div>
    </header>
  );
}

/* ── Réseaux sociaux ─────────────────────────────────────────────── */
export function Reseaux({ reseaux, className = '' }) {
  const r = reseaux || {};
  // `lienSortant` écarte tout ce qui n'est pas http(s) : ces adresses sont
  // saisies par le vendeur et partent dans un href public.
  const liens = [
    { href: lienSortant(r.instagram), nom: 'Instagram', icone: <Instagram size={18} /> },
    { href: lienSortant(r.facebook), nom: 'Facebook', icone: <Facebook size={18} /> },
    { href: lienSortant(r.tiktok), nom: 'TikTok', icone: <TikTok size={18} /> },
    { href: lienSortant(r.snapchat), nom: 'Snapchat', icone: <Ghost size={18} strokeWidth={2} /> },
    { href: lienSortant(r.site), nom: 'Site web', icone: <Globe size={18} strokeWidth={2} /> },
  ].filter((l) => l.href);
  if (!liens.length) return null;
  return (
    <div className={`bq-reseaux ${className}`}>
      {liens.map((l) => (
        <a key={l.nom} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.nom} title={l.nom}>
          {l.icone}
        </a>
      ))}
    </div>
  );
}

/* ── Avantages ───────────────────────────────────────────────────── */
/* Ce que le vendeur met en avant (livraison, paiement, conseils…), avec
   l'icône qu'il a choisie pour chacun. */
export function Avantages({ avantages }) {
  return (
    <section className="bq-section" data-apercu="avantages">
      <ul className="bq-avantages">
        {avantages.map((a, i) => (
          <li key={i}>
            <span className="bq-avantages__icone"><IconeVitrine cle={a.icone} size={22} strokeWidth={1.9} /></span>
            <span className="bq-avantages__texte">
              <strong>{a.titre}</strong>
              {a.texte && <span>{a.texte}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
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
