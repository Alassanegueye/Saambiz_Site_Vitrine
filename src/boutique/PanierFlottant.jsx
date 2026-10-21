import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { formaterPrix } from './api';
import { usePanier } from './panierContexte';
import { ImageProduit } from './composants';

/**
 * Le panier, en bulle flottante comme un chatbot, en bas à droite. Il
 * n'apparaît que lorsqu'il contient un produit : une pastille donne le
 * nombre d'articles, et l'étiquette à côté donne le nom du dernier produit
 * ajouté. Un
 * appui ouvre le panier : on relit, on ajuste, on commande — sans compte.
 */
export default function PanierFlottant({ boutique, ouvert, setOuvert }) {
  const { lignes, nombreArticles, sousTotal, changerQuantite, retirer } = usePanier();
  const navigate = useNavigate();

  // Échap ferme ; la page derrière ne défile pas pendant l'ouverture.
  useEffect(() => {
    if (!ouvert) return undefined;
    const touche = (e) => { if (e.key === 'Escape') setOuvert(false); };
    document.addEventListener('keydown', touche);
    const avant = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', touche);
      document.body.style.overflow = avant;
    };
  }, [ouvert, setOuvert]);

  if (!boutique.commandeActivee) return null;

  const commander = () => {
    setOuvert(false);
    navigate(`/b/${boutique.slug}/commande`);
  };

  const dernier = lignes[lignes.length - 1];
  const autres = lignes.length - 1;

  return (
    <>
      {nombreArticles > 0 && !ouvert && (
        <div className="bq-bulle">
          {/* La clé relance l'apparition de l'étiquette à chaque ajout. */}
          <button key={`${dernier?.cle}-${nombreArticles}`} type="button" className="bq-bulle__etiquette"
            onClick={() => setOuvert(true)} tabIndex={-1} aria-hidden="true">
            <span className="bq-bulle__nom">{dernier?.nom}</span>
            {autres > 0 && <span className="bq-bulle__plus">+ {autres} autre{autres > 1 ? 's' : ''}</span>}
          </button>
          <button type="button" className="bq-bulle__bouton" onClick={() => setOuvert(true)}
            aria-label={`Ouvrir le panier — ${nombreArticles} article${nombreArticles > 1 ? 's' : ''}, dont ${dernier?.nom}`}>
            <ShoppingBag size={26} strokeWidth={2} aria-hidden="true" />
            <span key={nombreArticles} className="bq-bulle__nombre">{nombreArticles}</span>
          </button>
        </div>
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
                <button type="button" className="bq-bouton" onClick={() => setOuvert(false)}>Voir les produits</button>
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
                            {Object.entries(l.variantes).map(([k, v]) => `${k} : ${v}`).join(' · ')}
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
                    Commander <ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" />
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
