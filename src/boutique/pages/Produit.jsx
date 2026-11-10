import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, MessageCircle, ShieldCheck, Truck, Banknote, ChevronRight } from 'lucide-react';
import { chargerProduit, formaterPrix } from '../api';
import { ImageProduit, Prix, GrilleProduits, TitreSection, EtatVide } from '../composants';
import { usePanier } from '../panierContexte';
import { lienTelephone, lienWhatsapp } from '../outils';

/** Fiche d'un produit : galerie, prix, variantes, ajout au panier. */
export default function Produit({ boutique }) {
  const { produitId } = useParams();

  // La clé remonte la fiche quand on passe d'un produit à un autre — depuis
  // « Produits similaires », par exemple. Photo affichée, quantité et options
  // choisies repartent alors de zéro d'elles-mêmes ; les remettre à la main
  // après coup laisserait voir un instant la taille choisie sur l'article
  // précédent.
  return <FicheProduit key={produitId} boutique={boutique} produitId={produitId} />;
}

/**
 * Les photos du produit, sur une piste qui défile au doigt ; des vignettes
 * sur ordinateur, des points sur téléphone. L'image principale d'abord, puis
 * la galerie : elles ne vivent pas dans la même table, mais le client n'a
 * pas à le savoir.
 */
function Galerie({ images, nom }) {
  const piste = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = piste.current;
    if (!el) return undefined;
    const suivre = () => setActive(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    el.addEventListener('scroll', suivre, { passive: true });
    return () => el.removeEventListener('scroll', suivre);
  }, []);

  const montrer = (i) => {
    const el = piste.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  if (images.length === 0) {
    return (
      <div className="bq-galerie">
        <div className="bq-galerie__piste"><ImageProduit src={null} alt={nom} className="bq-galerie__image" /></div>
      </div>
    );
  }

  return (
    <div className="bq-galerie">
      <div className="bq-galerie__piste" ref={piste} aria-label={`Photos de ${nom}`} role="group">
        {images.map((src, i) => (
          <div key={src + i} className="bq-galerie__vue">
            <ImageProduit src={src} alt={images.length > 1 ? `${nom} — photo ${i + 1} sur ${images.length}` : nom}
              className="bq-galerie__image" prioritaire={i === 0} />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <div className="bq-galerie__points" aria-hidden="true">
            {images.map((src, i) => <span key={src + i} className={i === active ? 'est-actif' : ''} />)}
          </div>
          <div className="bq-galerie__vignettes" role="group" aria-label="Choisir une photo">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                className={`bq-vignette ${i === active ? 'est-active' : ''}`}
                onClick={() => montrer(i)}
                aria-label={`Photo ${i + 1} sur ${images.length}`}
                aria-pressed={i === active}
              >
                <ImageProduit src={src} alt="" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FicheProduit({ boutique, produitId }) {
  const navigate = useNavigate();
  const { ajouter } = usePanier();

  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(true);
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
      <div className="bq-section bq-fiche" aria-hidden="true">
        <div className="bq-galerie"><div className="bq-galerie__piste bq-squelette__bloc" /></div>
        <div className="bq-fiche__infos bq-squelette">
          <div className="bq-squelette__ligne bq-squelette__ligne--titre" />
          <div className="bq-squelette__ligne bq-squelette__ligne--courte" />
          <div className="bq-squelette__ligne" />
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
          action={<Link to={`/b/${boutique.slug}/catalogue`} className="bq-bouton">Voir tous les produits</Link>}
        />
      </div>
    );
  }

  const { produit, similaires } = donnees;
  const images = [produit.image, ...(produit.images || [])].filter(Boolean);

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
  const numeroWa = boutique.whatsapp || boutique.telephone;
  const lienProduit = `${window.location.origin}/b/${boutique.slug}/produit/${produit.id}`;
  const question = lienWhatsapp(numeroWa, `Bonjour, j'ai une question sur « ${produit.nom} » : ${lienProduit}`);
  const commanderWa = lienWhatsapp(boutique.whatsapp, `Bonjour, je souhaite commander « ${produit.nom} » vu sur votre site : ${lienProduit}`);

  return (
    <div className="bq-section bq-section--fiche">
      <nav className="bq-fil" aria-label="Fil d'Ariane">
        <Link to={`/b/${boutique.slug}/catalogue`}>Tous les produits</Link>
        {produit.categorie && (
          <>
            <ChevronRight size={14} strokeWidth={2.4} aria-hidden="true" />
            <Link to={`/b/${boutique.slug}/catalogue?categorie=${produit.categorie.id}`}>{produit.categorie.nom}</Link>
          </>
        )}
      </nav>

      <div className="bq-fiche">
        <Galerie images={images} nom={produit.nom} />

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

          {groupesVariantes.map(([cle, valeurs]) => (
            <fieldset key={cle} className="bq-variantes">
              <legend className="bq-variantes__titre">
                {/* « Pointures disponibles » → « Pointure » : côté client, on
                    choisit, la disponibilité va de soi. */}
                {(produit.libelles?.[cle] || cle).replace(/\s+disponibles?$/i, '')}
                {variantes[cle] && <span className="bq-variantes__choix"> : {String(variantes[cle])}</span>}
              </legend>
              <div className="bq-puces">
                {valeurs.map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    className={`bq-puce bq-puce--option ${variantes[cle] === v ? 'est-active' : ''}`}
                    onClick={() => setVariantes((a) => ({ ...a, [cle]: v }))}
                    aria-pressed={variantes[cle] === v}
                  >
                    {String(v)}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}

          {boutique.commandeActivee && produit.disponible && (
            /* Sur téléphone, ce bloc se colle au bas de l'écran tant qu'on lit
               la fiche : le bouton reste sous le pouce. */
            <div className="bq-achat">
              <div className="bq-quantite" role="group" aria-label="Quantité">
                <button type="button" onClick={() => setQuantite((q) => Math.max(1, q - 1))} aria-label="Retirer un article" disabled={quantite <= 1}>
                  <Minus size={16} strokeWidth={2.5} />
                </button>
                <span aria-live="polite">{quantite}</span>
                <button type="button" onClick={() => setQuantite((q) => Math.min(99, q + 1))} aria-label="Ajouter un article">
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>

              <button
                type="button"
                className={`bq-bouton bq-bouton--grand bq-bouton--bloc ${varianteManquante ? '' : 'bq-bouton--avec-prix'}`}
                onClick={ajouterAuPanier}
                disabled={varianteManquante}
              >
                {varianteManquante
                  ? 'Choisissez vos options'
                  : (<><span>Ajouter au panier</span><span className="bq-bouton__prix">{formaterPrix(produit.prix * quantite)}</span></>)}
              </button>
            </div>
          )}

          {!boutique.commandeActivee && (
            /* La boutique montre son catalogue mais ne prend pas les
               commandes en ligne : on renvoie vers le canal qu'elle utilise
               vraiment plutôt que d'afficher un bouton qui ne marche pas. */
            <div className="bq-achat">
              {commanderWa ? (
                <a className="bq-bouton bq-bouton--grand bq-bouton--bloc" href={commanderWa} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} strokeWidth={2.2} aria-hidden="true" /> Commander sur WhatsApp
                </a>
              ) : boutique.telephone ? (
                <a className="bq-bouton bq-bouton--grand bq-bouton--bloc" href={lienTelephone(boutique.telephone)}>
                  Appeler la boutique
                </a>
              ) : null}
            </div>
          )}

          {question && boutique.commandeActivee && (
            <a className="bq-question" href={question} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} strokeWidth={2.2} aria-hidden="true" />
              <span><strong>Une question sur cet article ?</strong> Écrivez à {boutique.nom} sur WhatsApp</span>
            </a>
          )}

          {produit.description && (
            <div className="bq-fiche__bloc">
              <h2>Description</h2>
              <div className="bq-fiche__desc">
                {produit.description.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          )}

          {/* Caractéristiques tirées des spécifications de la catégorie
              (« État : Neuf », « Délai de préparation : 1 heure »…). */}
          {produit.caracteristiques?.length > 0 && (
            <div className="bq-fiche__bloc">
              <h2>Caractéristiques</h2>
              <dl className="bq-caracteristiques">
                {produit.caracteristiques.map((c) => (
                  <div key={c.cle} className="bq-caracteristiques__ligne">
                    <dt>{c.libelle}</dt>
                    <dd>{c.valeur}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <ul className="bq-garanties">
            <li><Truck size={18} strokeWidth={2} aria-hidden="true" /> Livraison ou retrait sur place, au choix</li>
            {boutique.paiementLivraison && (
              <li><Banknote size={18} strokeWidth={2} aria-hidden="true" /> Paiement à la livraison possible</li>
            )}
            {boutique.verifiee && (
              <li><ShieldCheck size={18} strokeWidth={2} aria-hidden="true" /> Vendeur certifié par SaamBiz</li>
            )}
          </ul>
        </div>
      </div>

      {similaires.length > 0 && (
        <section className="bq-similaires">
          <TitreSection>Produits similaires</TitreSection>
          <GrilleProduits produits={similaires} slug={boutique.slug} />
        </section>
      )}
    </div>
  );
}
