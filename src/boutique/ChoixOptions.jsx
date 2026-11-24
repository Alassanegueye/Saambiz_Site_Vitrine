import { Check, Minus, Plus } from 'lucide-react';
import { estClaire } from './options';

/**
 * Le choix des options d'un produit : des pastilles rondes pour les
 * couleurs, des boutons pour le reste (tailles, pointures, métrages).
 * Le même composant sert la fiche produit, l'ajout rapide et le panier.
 *
 * `groupes` vient de groupesOptions() ; `choix` est { cle: valeur }.
 */
export default function ChoixOptions({ groupes, choix, onChoisir, compact = false, manquantes = [] }) {
  return (
    <div className={`bq-options ${compact ? 'bq-options--compact' : ''}`}>
      {groupes.map((g) => {
        const actuel = choix?.[g.cle];
        const manque = manquantes.some((m) => m.cle === g.cle);
        return (
          <fieldset key={g.cle} className={`bq-option ${manque ? 'est-manquante' : ''}`}>
            <legend className="bq-option__titre">
              {g.libelle}
              {actuel
                ? <span className="bq-option__choix"> : {actuel}</span>
                : manque && <span className="bq-option__requis"> — à choisir</span>}
            </legend>

            {g.couleur ? (
              <div className="bq-teintes">
                {g.choix.map((c) => {
                  const actif = actuel === c.valeur;
                  return (
                    <button
                      key={c.valeur}
                      type="button"
                      className={`bq-teinte ${actif ? 'est-active' : ''} ${c.code ? '' : 'bq-teinte--texte'}`}
                      onClick={() => onChoisir(g.cle, c.valeur)}
                      aria-pressed={actif}
                      aria-label={c.valeur}
                      title={c.valeur}
                    >
                      {c.code ? (
                        <span
                          className={`bq-teinte__rond ${estClaire(c.code) ? 'est-claire' : ''}`}
                          style={{ background: c.code }}
                        >
                          {actif && <Check size={15} strokeWidth={3} aria-hidden="true" />}
                        </span>
                      ) : (
                        <span className="bq-teinte__nom">{c.valeur}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="bq-puces">
                {g.choix.map((c) => (
                  <button
                    key={c.valeur}
                    type="button"
                    className={`bq-puce bq-puce--option ${actuel === c.valeur ? 'est-active' : ''}`}
                    onClick={() => onChoisir(g.cle, c.valeur)}
                    aria-pressed={actuel === c.valeur}
                  >
                    {c.valeur}
                  </button>
                ))}
              </div>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}

/** « − n + » pour choisir une quantité avant l'ajout. */
export function Quantite({ valeur, onChanger, min = 1, max = 99, petite = false, nom = '' }) {
  return (
    <div className={`bq-quantite ${petite ? 'bq-quantite--petite' : ''}`} role="group"
      aria-label={nom ? `Quantité pour ${nom}` : 'Quantité'}>
      <button type="button" onClick={() => onChanger(Math.max(min, valeur - 1))} disabled={valeur <= min}
        aria-label="Diminuer la quantité">
        <Minus size={petite ? 14 : 16} strokeWidth={2.6} aria-hidden="true" />
      </button>
      <span aria-live="polite">{valeur}</span>
      <button type="button" onClick={() => onChanger(Math.min(max, valeur + 1))} disabled={valeur >= max}
        aria-label="Augmenter la quantité">
        <Plus size={petite ? 14 : 16} strokeWidth={2.6} aria-hidden="true" />
      </button>
    </div>
  );
}
