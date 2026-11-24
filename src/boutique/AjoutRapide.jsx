import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { formaterPrix } from './api';
import { usePanier } from './panierContexte';
import { ImageProduit, Montant } from './composants';
import Feuille from './Feuille';
import ChoixOptions, { Quantite } from './ChoixOptions';
import { choixParDefaut, groupesOptions, optionsManquantes } from './options';

/**
 * L'ajout rapide : depuis l'accueil ou une liste, le bouton « + » d'un
 * produit à options ouvre cette fenêtre au lieu d'envoyer le client sur la
 * fiche. Il choisit sa taille, sa couleur, sa quantité, et le produit part
 * au panier — sans quitter la page qu'il parcourait.
 */
function Contenu({ produit, slug, fermer }) {
  const { ajouter } = usePanier();
  const groupes = useMemo(() => groupesOptions(produit), [produit]);
  const [choix, setChoix] = useState(() => choixParDefaut(groupes));
  const [quantite, setQuantite] = useState(1);
  const [tente, setTente] = useState(false);

  const manquantes = optionsManquantes(groupes, choix);

  const valider = () => {
    if (manquantes.length) { setTente(true); return; }
    ajouter(produit, quantite, Object.keys(choix).length ? choix : null);
    fermer();
  };

  return (
    <>
      <div className="bq-ajout__produit">
        <ImageProduit src={produit.image} alt={produit.nom} className="bq-ajout__image" />
        <div className="bq-ajout__texte">
          <p className="bq-ajout__nom">{produit.nom}</p>
          <p className="bq-ajout__prix">
            <Montant valeur={produit.prix} />
            {produit.prixBarre != null && <s>{formaterPrix(produit.prixBarre)}</s>}
          </p>
          <Link to={`/b/${slug}/produit/${produit.id}`} className="bq-lien bq-ajout__fiche" onClick={fermer}>
            Voir la fiche du produit
          </Link>
        </div>
      </div>

      <ChoixOptions groupes={groupes} choix={choix} manquantes={tente ? manquantes : []}
        onChoisir={(cle, v) => setChoix((c) => ({ ...c, [cle]: v }))} />

      <div className="bq-ajout__action">
        <Quantite valeur={quantite} onChanger={setQuantite} nom={produit.nom} />
        <button type="button" className="bq-bouton bq-bouton--grand bq-bouton--bloc bq-bouton--avec-prix" onClick={valider}>
          <span><ShoppingBag size={18} strokeWidth={2.2} aria-hidden="true" /> Ajouter au panier</span>
          <span className="bq-bouton__prix">{formaterPrix(produit.prix * quantite)}</span>
        </button>
      </div>
      {tente && manquantes.length > 0 && (
        <p className="bq-ajout__alerte" role="alert">
          Choisissez {manquantes.map((m) => m.libelle.toLowerCase()).join(' et ')} pour continuer.
        </p>
      )}
    </>
  );
}

export default function AjoutRapide({ slug }) {
  const { produitEnChoix, fermerChoix } = usePanier();
  return (
    <Feuille ouvert={Boolean(produitEnChoix)} onFermer={fermerChoix} mode="fenetre"
      titre="Ajouter au panier" className="bq-ajout">
      {produitEnChoix && <Contenu key={produitEnChoix.id} produit={produitEnChoix} slug={slug} fermer={fermerChoix} />}
    </Feuille>
  );
}
