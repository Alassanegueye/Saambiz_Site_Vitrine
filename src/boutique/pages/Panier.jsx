import { Link, useNavigate } from 'react-router-dom';
import { formaterPrix } from '../api';
import { usePanier } from '../panierContexte';
import { EtatVide, EntetePage } from '../composants';
import LignePanier from '../LignePanier';
import { BarreSelection } from '../PanierFlottant';

/** Le panier : relecture, choix des articles à commander, passage en caisse. */
export default function Panier({ boutique }) {
  const { lignes, sousTotal, nombreArticles, nombreChoisis, toutCocher } = usePanier();
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
          <div className="bq-panier__liste">
            {lignes.length > 1 && <BarreSelection lignes={lignes} toutCocher={toutCocher} />}
            <ul className="bq-lps">
              {lignes.map((l) => <LignePanier key={l.uid || l.cle} ligne={l} slug={boutique.slug} />)}
            </ul>
          </div>

          <aside className="bq-recap">
            <h2>Récapitulatif</h2>

            <p className="bq-recap__ligne">
              <span>Sous-total ({nombreChoisis} article{nombreChoisis > 1 ? 's' : ''})</span>
              <strong>{formaterPrix(sousTotal)}</strong>
            </p>

            {/* Les frais de livraison dépendent du mode choisi à l'étape
                suivante : les annoncer ici serait un chiffre inventé. */}
            <p className="bq-recap__ligne bq-recap__ligne--sourde">
              <span>Livraison</span>
              <span>calculée à l'étape suivante</span>
            </p>

            <button
              type="button"
              className="bq-bouton bq-bouton--grand bq-bouton--bloc"
              onClick={() => navigate(`${base}/commande`)}
              disabled={!boutique.commandeActivee || nombreChoisis === 0}
            >
              {nombreChoisis === 0 ? 'Cochez au moins un article' : 'Passer la commande'}
            </button>

            {!boutique.commandeActivee && (
              <p className="bq-recap__note">
                Cette boutique ne prend pas les commandes en ligne. Contactez-la
                directement pour finaliser votre achat.
              </p>
            )}

            {nombreChoisis < nombreArticles && nombreChoisis > 0 && (
              <p className="bq-recap__note">
                Les articles décochés restent dans votre panier pour plus tard.
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
