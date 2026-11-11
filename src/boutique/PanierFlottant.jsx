import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';
import { formaterPrix } from './api';
import { usePanier } from './panierContexte';
import { ImageProduit } from './composants';
import { libelleVariantes, lienWhatsappBoutique } from './outils';

/**
 * Le panier, en volet : il s'ouvre depuis le bouton Panier de la barre du
 * haut, ou depuis la bulle ronde qui apparaît en bas à droite dès qu'un
 * article est ajouté (au-dessus de la pastille WhatsApp), avec le nombre
 * d'articles. On relit, on ajuste, on commande — sans compte.
 */
export default function PanierFlottant({ boutique, ouvert, setOuvert, bulle = true }) {
  const { lignes, nombreArticles, sousTotal, changerQuantite, retirer } = usePanier();
  const navigate = useNavigate();

  // Échap ferme ; la page derrière ne défile pas pendant l'ouverture.
  useEffect(() => {
    if (!ouvert) return undefined;
    const touche = (e) => { if (e.key === 'Escape') setOuvert(false); };
    document.addEventListener('keydown', touche);
    // Le défilement est bloqué sur <html> et non sur <body> : un <body> en
    // overflow hidden devient le conteneur de la barre collante, qui
    // remonterait alors d'autant que la page avait défilé.
    const racine = document.documentElement;
    const avant = racine.style.overflow;
    racine.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', touche);
      racine.style.overflow = avant;
    };
  }, [ouvert, setOuvert]);

  if (!boutique.commandeActivee) return null;

  const commander = () => {
    setOuvert(false);
    navigate(`/b/${boutique.slug}/commande`);
  };

  const avecWhatsapp = Boolean(lienWhatsappBoutique(boutique));

  return (
    <>
      {bulle && nombreArticles > 0 && !ouvert && (
        <button type="button" className={`bq-bulle ${avecWhatsapp ? 'bq-bulle--sur-wa' : ''}`}
          onClick={() => setOuvert(true)}
          aria-label={`Ouvrir le panier — ${nombreArticles} article${nombreArticles > 1 ? 's' : ''}`}>
          <ShoppingBag size={25} strokeWidth={2} aria-hidden="true" />
          {/* La clé relance le rebond à chaque ajout. */}
          <span key={nombreArticles} className="bq-bulle__nombre" aria-hidden="true">
            {nombreArticles > 99 ? '99+' : nombreArticles}
          </span>
        </button>
      )}

      {ouvert && (
        <div className="bq-panier-popup__voile" onClick={() => setOuvert(false)} role="presentation">
          <div
            className="bq-panier-popup"
            role="dialog"
            aria-modal="true"
            aria-label="Mon panier"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="bq-panier-popup__entete">
              <h2>Mon panier {nombreArticles > 0 && <span>({nombreArticles})</span>}</h2>
              <button type="button" className="bq-panier-popup__fermer" onClick={() => setOuvert(false)} aria-label="Fermer le panier">
                <X size={20} strokeWidth={2.2} />
              </button>
            </header>

            {lignes.length === 0 ? (
              <div className="bq-panier-popup__vide">
                <ShoppingBag size={36} strokeWidth={1.6} aria-hidden="true" />
                <p>Votre panier est vide.</p>
                <button type="button" className="bq-bouton"
                  onClick={() => { setOuvert(false); navigate(`/b/${boutique.slug}/produits`); }}>
                  Voir nos produits
                </button>
              </div>
            ) : (
              <>
                <ul className="bq-panier-popup__lignes">
                  {lignes.map((l) => (
                    <li key={l.cle} className="bq-panier-popup__ligne">
                      <ImageProduit src={l.image} alt={l.nom} className="bq-panier-popup__image" />
                      <div className="bq-panier-popup__texte">
                        <p className="bq-panier-popup__nom">{l.nom}</p>
                        {l.variantes && (
                          <p className="bq-panier-popup__options">
                            {libelleVariantes(l.variantes)}
                          </p>
                        )}
                        <p className="bq-panier-popup__prix">{formaterPrix(l.prix * l.quantite)}</p>
                        <div className="bq-panier-popup__controles">
                          <div className="bq-quantite bq-quantite--petite" role="group" aria-label={`Quantité pour ${l.nom}`}>
                            <button type="button" onClick={() => changerQuantite(l.cle, l.quantite - 1)} aria-label="Diminuer la quantité">
                              <Minus size={14} strokeWidth={2.6} />
                            </button>
                            <span aria-live="polite">{l.quantite}</span>
                            <button type="button" onClick={() => changerQuantite(l.cle, l.quantite + 1)} aria-label="Augmenter la quantité">
                              <Plus size={14} strokeWidth={2.6} />
                            </button>
                          </div>
                          <button type="button" className="bq-supprimer" onClick={() => retirer(l.cle)} aria-label={`Retirer ${l.nom} du panier`}>
                            <Trash2 size={16} strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="bq-panier-popup__pied">
                  <p className="bq-panier-popup__total">
                    <span>Total</span>
                    <strong>{formaterPrix(sousTotal)}</strong>
                  </p>
                  <p className="bq-panier-popup__note">Livraison calculée à l'étape suivante. Aucun compte nécessaire.</p>
                  <button type="button" className="bq-bouton bq-bouton--grand bq-bouton--bloc" onClick={commander}>
                    Passer la commande
                  </button>
                </footer>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
