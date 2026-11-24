import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { formaterPrix } from './api';
import { usePanier } from './panierContexte';
import { ImageProduit } from './composants';
import ChoixOptions, { Quantite } from './ChoixOptions';
import { detailLigne, estClaire, groupesOptions } from './options';

/**
 * Une ligne du panier, la même dans le volet et sur la page Panier :
 *   - une case à cocher : décochée, la ligne reste au panier mais ne part
 *     pas dans la commande ;
 *   - les options choisies, modifiables sur place (« Modifier ») ;
 *   - la quantité, et la corbeille pour retirer l'article.
 */
export default function LignePanier({ ligne, slug, onNaviguer }) {
  const { changerQuantite, changerVariantes, retirer, basculer } = usePanier();
  const [edition, setEdition] = useState(false);
  const groupes = useMemo(() => groupesOptions({ attributs: ligne.attributs, libelles: ligne.libelles }), [ligne.attributs, ligne.libelles]);
  const details = detailLigne(ligne);
  const modifiable = groupes.length > 0;
  const cochee = !ligne.exclue;

  return (
    <li className={`bq-lp ${cochee ? '' : 'est-exclue'}`}>
      <label className="bq-case" title={cochee ? 'Retirer de la commande' : 'Ajouter à la commande'}>
        <input type="checkbox" checked={cochee} onChange={() => basculer(ligne.cle)}
          aria-label={`${ligne.nom} — inclure dans la commande`} />
        <span className="bq-case__boite" aria-hidden="true"><Check size={14} strokeWidth={3.2} /></span>
      </label>

      <Link to={`/b/${slug}/produit/${ligne.id}`} className="bq-lp__media" onClick={onNaviguer} tabIndex={-1} aria-hidden="true">
        <ImageProduit src={ligne.image} alt="" className="bq-lp__image" />
      </Link>

      <div className="bq-lp__corps">
        <div className="bq-lp__haut">
          <Link to={`/b/${slug}/produit/${ligne.id}`} className="bq-lp__nom" onClick={onNaviguer}>{ligne.nom}</Link>
          <button type="button" className="bq-lp__retirer" onClick={() => retirer(ligne.cle)}
            aria-label={`Retirer ${ligne.nom} du panier`} title="Retirer du panier">
            <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        {(details.length > 0 || modifiable) && (
          <div className="bq-lp__options">
            {details.map((d) => (
              <span key={d.cle} className="bq-lp__option">
                {d.code && (
                  <span className={`bq-lp__teinte ${estClaire(d.code) ? 'est-claire' : ''}`} style={{ background: d.code }} aria-hidden="true" />
                )}
                {d.libelle} : <strong>{d.valeur}</strong>
              </span>
            ))}
            {modifiable && (
              <button type="button" className="bq-lp__modifier" onClick={() => setEdition((v) => !v)} aria-expanded={edition}>
                <Pencil size={13} strokeWidth={2.3} aria-hidden="true" /> {edition ? 'Terminé' : 'Modifier'}
              </button>
            )}
          </div>
        )}

        {edition && (
          <div className="bq-lp__edition">
            <ChoixOptions compact groupes={groupes} choix={ligne.variantes || {}}
              onChoisir={(cle, v) => changerVariantes(ligne.cle, { ...(ligne.variantes || {}), [cle]: v })} />
          </div>
        )}

        <div className="bq-lp__bas">
          <Quantite petite valeur={ligne.quantite} nom={ligne.nom}
            onChanger={(q) => changerQuantite(ligne.cle, q)} />
          <p className="bq-lp__prix">
            {formaterPrix(ligne.prix * ligne.quantite)}
            {ligne.quantite > 1 && <small>{formaterPrix(ligne.prix)} l'unité</small>}
          </p>
        </div>
      </div>
    </li>
  );
}
