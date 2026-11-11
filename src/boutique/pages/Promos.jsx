import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgePercent } from 'lucide-react';
import { chargerProduits } from '../api';
import { EntetePage, EtatVide, GrilleProduits, SqueletteGrille } from '../composants';

/**
 * « Nos promos » : les produits dont le prix est réduit en ce moment, la
 * plus forte remise d'abord, avec la date de fin quand le vendeur l'a fixée.
 *
 * L'API filtre les promos (`promo=1`). Une API plus ancienne ignore ce
 * filtre et renvoie tout le catalogue : on ne garde donc que les produits
 * qui ont réellement un prix barré, pour ne jamais présenter comme soldé un
 * article à son prix normal.
 */
export default function Promos({ boutique, produitsLocaux = null }) {
  const [produits, setProduits] = useState([]);
  const [erreur, setErreur] = useState(null);
  const [tentative, setTentative] = useState(0);
  const [affichee, setAffichee] = useState(null);
  const chargement = !produitsLocaux && affichee !== tentative;

  const base = `/b/${boutique.slug}`;
  const format = boutique.theme.modele === 'catalogue' ? 'ligne'
    : boutique.theme.modele === 'galerie' ? 'grande' : 'carte';

  useEffect(() => {
    if (produitsLocaux) return undefined;
    let annule = false;
    chargerProduits(boutique.slug, { promo: 1, limit: 48 })
      .then((d) => {
        if (annule) return;
        const enPromo = (d?.produits || []).filter((p) => p.prixBarre != null)
          .sort((a, b) => (b.remise || 0) - (a.remise || 0));
        setProduits(enPromo);
        setErreur(null);
      })
      .catch((e) => { if (!annule) { setProduits([]); setErreur(e.message); } })
      .finally(() => { if (!annule) setAffichee(tentative); });
    return () => { annule = true; };
  }, [boutique.slug, tentative, produitsLocaux]);

  const liste = produitsLocaux ? produitsLocaux.filter((p) => p.prixBarre != null) : produits;

  return (
    <>
      <EntetePage boutique={boutique} titre="Nos promos" fil={[{ libelle: 'Nos promos' }]} />

      <div className="bq-section bq-promos">
        {chargement && <SqueletteGrille nombre={8} format={format} />}

        {!chargement && erreur && (
          <EtatVide
            titre="Les promos n'ont pas pu être chargées"
            texte={erreur}
            action={(
              <button type="button" className="bq-bouton" onClick={() => setTentative((n) => n + 1)}>
                Réessayer
              </button>
            )}
          />
        )}

        {!chargement && !erreur && liste.length === 0 && (
          <EtatVide
            icone={BadgePercent}
            titre="Pas de promo en ce moment"
            texte={`Les prix réduits de ${boutique.nom} apparaîtront ici. En attendant, tout le catalogue vous attend.`}
            action={<Link to={`${base}/produits`} className="bq-bouton">Voir nos produits</Link>}
          />
        )}

        {!chargement && !erreur && liste.length > 0 && (
          <GrilleProduits produits={liste} slug={boutique.slug} format={format} />
        )}
      </div>
    </>
  );
}
