import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, MessageCircle, ShieldCheck, Truck, ChevronLeft } from 'lucide-react';
import { chargerProduit, formaterPrix } from '../api';
import { ImageProduit, Prix, GrilleProduits, TitreSection, EtatVide } from '../composants';
import { usePanier } from '../panierContexte';

/** Fiche d'un produit : galerie, prix, variantes, ajout au panier. */
export default function Produit({ boutique }) {
  const { produitId } = useParams();

  // La clé remonte la fiche quand on passe d'un produit à un autre — depuis
  // « Dans le même rayon », par exemple. Photo affichée, quantité et options
  // choisies repartent alors de zéro d'elles-mêmes ; les remettre à la main
  // après coup laisserait voir un instant la taille choisie sur l'article
  // précédent.
  return <FicheProduit key={produitId} boutique={boutique} produitId={produitId} />;
}

function FicheProduit({ boutique, produitId }) {
  const navigate = useNavigate();
  const { ajouter } = usePanier();

  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [imageActive, setImageActive] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [variantes, setVariantes] = useState({});

  useEffect(() => {
    let annule = false;

    chargerProduit(boutique.slug, produitId)
      .then((d) => { if (!annule) { setDonnees(d); setErreur(null); } })
      .catch((e) => { if (!annule) { setDonnees(null); setErreur(e.message); } })
      .finally(() => { if (!annule) setChargement(false); });

    return () => { annule = true; };
  }, [boutique.slug, produitId]);

  if (chargement) {
    return (
      <div className="bq-section bq-fiche bq-squelette" aria-hidden="true">
        <div className="bq-squelette__media bq-fiche__media" />
        <div>
          <div className="bq-squelette__ligne" />
          <div className="bq-squelette__ligne bq-squelette__ligne--courte" />
          <div className="bq-squelette__ligne" />
        </div>
      </div>
    );
  }

  if (erreur || !donnees) {
    return (
      <div className="bq-section">
        <EtatVide
          titre="Produit introuvable"
          texte={erreur || "Ce produit n'est plus en vente dans cette boutique."}
          action={<Link to={`/b/${boutique.slug}/catalogue`} className="bq-bouton">Voir le catalogue</Link>}
        />
      </div>
    );
  }

  const { produit, similaires } = donnees;

  // L'image principale d'abord, puis la galerie. Le vendeur téléverse la
  // première à la création du produit et les autres plus tard : elles ne
  // vivent pas dans la même table, mais le client n'a pas à le savoir.
  const images = [produit.image, ...produit.images].filter(Boolean);

  /* Les variantes sont libres : le vendeur saisit ce qu'il veut dans un JSON
     ({ tailles: [...], couleurs: [...] }). On rend donc ce qui vient, sans
     supposer les clés — un vendeur de chaussures a des pointures, un vendeur
     de tissus des métrages. */
  const groupesVariantes = Object.entries(produit.attributs || {})
    .filter(([, valeurs]) => Array.isArray(valeurs) && valeurs.length > 0);

  const ajouterAuPanier = () => {
    // Les variantes voyagent à part, pas dans le nom : la ligne de commande
    // enregistrée en base reprend le nom du produit au catalogue, un nom
    // bricolé ici n'y arriverait jamais. Le panier les garde, et le passage
    // en caisse les récapitule dans la note que lit le vendeur.
    ajouter(produit, quantite, Object.keys(variantes).length ? variantes : null);
    navigate(`/b/${boutique.slug}/panier`);
  };

  const varianteManquante = groupesVariantes.some(([cle]) => !variantes[cle]);

  return (
    <div className="bq-section">
      <p className="bq-fil">
        <Link to={`/b/${boutique.slug}/catalogue`} className="bq-lien-discret">
          <ChevronLeft size={15} strokeWidth={2.4} aria-hidden="true" /> Catalogue
        </Link>
        {produit.categorie && <> · <span>{produit.categorie.nom}</span></>}
      </p>

      <div className="bq-fiche">
        <div className="bq-fiche__media">
          <ImageProduit
            src={images[imageActive]}
            alt={produit.nom}
            className="bq-fiche__image"
          />
          {images.length > 1 && (
            <div className="bq-vignettes" role="group" aria-label="Photos du produit">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  className={`bq-vignette ${i === imageActive ? 'est-active' : ''}`}
                  onClick={() => setImageActive(i)}
                  aria-label={`Photo ${i + 1} sur ${images.length}`}
                  aria-pressed={i === imageActive}
                >
                  <ImageProduit src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bq-fiche__infos">
          {produit.marque && <p className="bq-fiche__marque">{produit.marque}</p>}
          <h1 className="bq-fiche__titre">{produit.nom}</h1>

          <Prix produit={produit} grand />

          <p className="bq-fiche__stock">
            {!produit.disponible
              ? <span className="bq-etat bq-etat--rupture">Épuisé pour le moment</span>
              : produit.stockFaible
                ? <span className="bq-etat bq-etat--alerte">Dernières pièces disponibles</span>
                : <span className="bq-etat bq-etat--ok">En stock</span>}
          </p>

          {produit.description && (
            <div className="bq-fiche__desc">
              {produit.description.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}

          {/* Caractéristiques tirées des spécifications de la catégorie
              (« État : Neuf », « Délai de préparation : 1 heure »…). */}
          {produit.caracteristiques?.length > 0 && (
            <dl className="bq-caracteristiques">
              {produit.caracteristiques.map((c) => (
                <div key={c.cle} className="bq-caracteristiques__ligne">
                  <dt>{c.libelle}</dt>
                  <dd>{c.valeur}</dd>
                </div>
              ))}
            </dl>
          )}

          {groupesVariantes.map(([cle, valeurs]) => (
            <div key={cle} className="bq-variantes">
              <p className="bq-variantes__titre">
                {/* « Pointures disponibles » → « Pointures » : côté client,
                    on choisit, la disponibilité va de soi. */}
                {(produit.libelles?.[cle] || cle).replace(/\s+disponibles?$/i, '')}
              </p>
              <div className="bq-puces">
                {valeurs.map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    className={`bq-puce ${variantes[cle] === v ? 'est-active' : ''}`}
                    onClick={() => setVariantes((a) => ({ ...a, [cle]: v }))}
                    aria-pressed={variantes[cle] === v}
                  >
                    {String(v)}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {boutique.commandeActivee && produit.disponible && (
            <div className="bq-achat">
              <div className="bq-quantite" role="group" aria-label="Quantité">
                <button type="button" onClick={() => setQuantite((q) => Math.max(1, q - 1))} aria-label="Retirer un article">
                  <Minus size={16} strokeWidth={2.5} />
                </button>
                <span aria-live="polite">{quantite}</span>
                <button type="button" onClick={() => setQuantite((q) => Math.min(99, q + 1))} aria-label="Ajouter un article">
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>

              <button
                type="button"
                className="bq-bouton bq-bouton--grand bq-bouton--bloc"
                onClick={ajouterAuPanier}
                disabled={varianteManquante}
              >
                {varianteManquante
                  ? 'Choisissez vos options'
                  : `Ajouter — ${formaterPrix(produit.prix * quantite)}`}
              </button>
            </div>
          )}

          {!boutique.commandeActivee && (
            /* La boutique montre son catalogue mais ne prend pas les
               commandes en ligne : on renvoie vers le canal qu'elle utilise
               vraiment plutôt que d'afficher un bouton qui ne marche pas. */
            <div className="bq-achat">
              {boutique.whatsapp ? (
                <a
                  className="bq-bouton bq-bouton--grand bq-bouton--bloc"
                  href={`https://wa.me/${String(boutique.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour, je suis intéressé par « ${produit.nom} » vu sur votre site.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={18} strokeWidth={2.2} aria-hidden="true" /> Commander sur WhatsApp
                </a>
              ) : boutique.telephone ? (
                <a className="bq-bouton bq-bouton--grand bq-bouton--bloc" href={`tel:${boutique.telephone}`}>
                  Appeler la boutique
                </a>
              ) : null}
            </div>
          )}

          <ul className="bq-garanties">
            <li><Truck size={16} strokeWidth={2} aria-hidden="true" /> Livraison ou retrait sur place, au choix</li>
            {boutique.paiementLivraison && (
              <li><ShieldCheck size={16} strokeWidth={2} aria-hidden="true" /> Paiement à la livraison possible</li>
            )}
            {boutique.verifiee && (
              <li><ShieldCheck size={16} strokeWidth={2} aria-hidden="true" /> Vendeur vérifié par SaamBiz</li>
            )}
          </ul>
        </div>
      </div>

      {similaires.length > 0 && (
        <section className="bq-similaires">
          <TitreSection>Dans le même rayon</TitreSection>
          <GrilleProduits produits={similaires} slug={boutique.slug} />
        </section>
      )}
    </div>
  );
}
