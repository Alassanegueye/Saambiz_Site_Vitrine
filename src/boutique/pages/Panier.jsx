import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import { formaterPrix } from '../api';
import { usePanier } from '../panierContexte';
import { ImageProduit, EtatVide, EntetePage } from '../composants';
import { libelleVariantes } from '../outils';

/** Le panier : relecture, ajustement des quantités, passage en caisse. */
export default function Panier({ boutique }) {
  const { lignes, changerQuantite, retirer, sousTotal, nombreArticles } = usePanier();
  const navigate = useNavigate();
  const base = `/b/${boutique.slug}`;

  if (!lignes.length) {
    return (
      <div className="bq-section">
        <EtatVide
          titre="Votre panier est vide"
          texte={`Parcourez le catalogue de ${boutique.nom} et ajoutez ce qui vous plaît.`}
          action={<Link to={`${base}/produits`} className="bq-bouton bq-bouton--grand">Voir nos produits</Link>}
        />
      </div>
    );
  }

  return (
    <>
      <EntetePage boutique={boutique} titre="Mon panier" fil={[{ libelle: 'Mon panier' }]}>
        <p className="bq-bandeau__texte">{nombreArticles} article{nombreArticles > 1 ? 's' : ''}</p>
      </EntetePage>
      <div className="bq-section">

        <div className="bq-panier">
          <ul className="bq-panier__lignes">
            {lignes.map((l) => (
              <li key={l.cle} className="bq-panier__ligne">
                <ImageProduit src={l.image} alt={l.nom} className="bq-panier__image" />

                <div className="bq-panier__texte">
                  <Link to={`${base}/produit/${l.id}`} className="bq-panier__nom">{l.nom}</Link>

                  {l.variantes && (
                    <p className="bq-panier__options">
                      {libelleVariantes(l.variantes)}
                    </p>
                  )}

                  <p className="bq-panier__unitaire">{formaterPrix(l.prix)} l'unité</p>
                </div>

                <div className="bq-panier__controles">
                  <div className="bq-quantite bq-quantite--petite" role="group" aria-label={`Quantité pour ${l.nom}`}>
                    <button type="button" onClick={() => changerQuantite(l.cle, l.quantite - 1)} aria-label="Diminuer la quantité">
                      <Minus size={14} strokeWidth={2.6} />
                    </button>
                    <span aria-live="polite">{l.quantite}</span>
                    <button type="button" onClick={() => changerQuantite(l.cle, l.quantite + 1)} aria-label="Augmenter la quantité">
                      <Plus size={14} strokeWidth={2.6} />
                    </button>
                  </div>

                  <p className="bq-panier__total">{formaterPrix(l.prix * l.quantite)}</p>

                  <button
                    type="button"
                    className="bq-supprimer"
                    onClick={() => retirer(l.cle)}
                    aria-label={`Retirer ${l.nom} du panier`}
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="bq-recap">
            <h2>Récapitulatif</h2>

            <p className="bq-recap__ligne">
              <span>Sous-total</span>
              <strong>{formaterPrix(sousTotal)}</strong>
            </p>

            {/* Les frais de livraison sont fixés par la configuration du
                backend et dépendent du mode choisi à l'étape suivante : les
                annoncer ici sous forme de montant serait un chiffre inventé. */}
            <p className="bq-recap__ligne bq-recap__ligne--sourde">
              <span>Livraison</span>
              <span>calculée à l'étape suivante</span>
            </p>

            <button
              type="button"
              className="bq-bouton bq-bouton--grand bq-bouton--bloc"
              onClick={() => navigate(`${base}/commande`)}
              disabled={!boutique.commandeActivee}
            >
              Passer la commande
            </button>

            {!boutique.commandeActivee && (
              <p className="bq-recap__note">
                Cette boutique ne prend pas les commandes en ligne. Contactez-la
                directement pour finaliser votre achat.
              </p>
            )}

            <p className="bq-recap__note">
              Aucun compte n'est nécessaire : votre nom et votre numéro suffisent.
            </p>

            <Link to={`${base}/produits`} className="bq-lien bq-recap__retour">
              Continuer mes achats
            </Link>
          </aside>
        </div>
      </div>
    </>
  );
}
