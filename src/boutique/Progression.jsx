import { Check, X } from 'lucide-react';
import { ETAPES, ETAPE_DU_STATUT, ARRETS } from './etapesCommande';

/**
 * La frise d'avancement d'une commande, telle que le client la lit.
 *
 * Le vocabulaire et la correspondance des statuts vivent dans
 * `etapesCommande.js` : ce fichier n'exporte qu'un composant, ce que la
 * règle de rafraîchissement à chaud exige, et ce qui permet de tester la
 * correspondance sans monter React.
 */
export function Progression({ statut, modeLivraison }) {
  const arret = ARRETS[statut];
  if (arret) {
    return (
      <p className="bq-suivi__annulee" role="status">
        <X size={15} strokeWidth={3} aria-hidden="true" /> {arret}
      </p>
    );
  }

  // Un retrait sur place ne passe pas par « En route » : afficher une étape
  // que la commande ne franchira jamais laisse croire à un blocage.
  const etapes = modeLivraison === 'retrait'
    ? ETAPES.filter((e) => e.cle !== 'en_livraison')
    : ETAPES;

  const cleActuelle = ETAPE_DU_STATUT[statut];
  const indexActuel = etapes.findIndex((e) => e.cle === cleActuelle);

  return (
    <ol className="bq-progression">
      {etapes.map((etape, i) => {
        const faite = indexActuel >= 0 && i < indexActuel;
        const encours = i === indexActuel;
        return (
          <li
            key={etape.cle}
            className={`bq-progression__etape ${faite ? 'est-faite' : ''} ${encours ? 'est-encours' : ''}`}
          >
            <span className="bq-progression__puce" aria-hidden="true">
              {faite ? <Check size={13} strokeWidth={3} /> : i + 1}
            </span>
            <span className="bq-progression__texte">
              <strong>{etape.libelle}</strong>
              {encours && <span>{statut === 'payee' ? 'Votre paiement est bien reçu.' : etape.texte}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
