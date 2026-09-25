import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Search, AlertCircle, Loader2, Check } from 'lucide-react';
import { suivreCommande, formaterPrix } from '../api';
import { ImageProduit } from '../composants';

/**
 * Suivre une commande sans compte : référence + numéro de téléphone.
 *
 * Le numéro n'est pas là pour embêter le client mais pour lier la
 * consultation à la personne qui a commandé : une référence transite par SMS
 * et WhatsApp, elle est courte, et elle finit recopiée dans des conversations
 * de groupe.
 */

/* Les étapes visibles par le client. « annulee » n'y figure pas : ce n'est
   pas une étape du parcours mais sa fin, affichée à part. */
const ETAPES = [
  { cle: 'en_attente', libelle: 'Commande reçue', texte: 'Le vendeur a été prévenu.' },
  { cle: 'confirmee', libelle: 'Confirmée', texte: 'Le vendeur a accepté votre commande.' },
  { cle: 'en_preparation', libelle: 'En préparation', texte: 'Vos articles sont rassemblés.' },
  { cle: 'prete', libelle: 'Prête', texte: 'Votre commande est prête.' },
  { cle: 'en_livraison', libelle: 'En route', texte: 'Le livreur est en chemin.' },
  { cle: 'livree', libelle: 'Livrée', texte: 'Bonne réception !' },
];

function Progression({ statut, modeLivraison }) {
  if (statut === 'annulee') {
    return (
      <p className="bq-suivi__annulee" role="status">
        Cette commande a été annulée. Contactez le vendeur si c'est une erreur.
      </p>
    );
  }

  // Un retrait sur place ne passe pas par « En route » : afficher une étape
  // que la commande ne franchira jamais laisse croire à un blocage.
  const etapes = modeLivraison === 'retrait'
    ? ETAPES.filter((e) => e.cle !== 'en_livraison')
    : ETAPES;

  const indexActuel = etapes.findIndex((e) => e.cle === statut);

  return (
    <ol className="bq-progression">
      {etapes.map((etape, i) => {
        const faite = indexActuel >= 0 && i < indexActuel;
        const encours = i === indexActuel;
        return (
          <li key={etape.cle} className={`bq-progression__etape ${faite ? 'est-faite' : ''} ${encours ? 'est-encours' : ''}`}>
            <span className="bq-progression__puce" aria-hidden="true">
              {faite ? <Check size={13} strokeWidth={3} /> : i + 1}
            </span>
            <span className="bq-progression__texte">
              <strong>{etape.libelle}</strong>
              {encours && <span>{etape.texte}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function Suivi({ boutique }) {
  const { reference: refUrl } = useParams();
  const { state } = useLocation();

  const [reference, setReference] = useState(refUrl || '');
  // Le téléphone est passé par la page de confirmation : le client vient de
  // commander, lui redemander son numéro sur l'écran suivant serait absurde.
  const [telephone, setTelephone] = useState(state?.telephone || '');
  const [commande, setCommande] = useState(null);
  const [erreur, setErreur] = useState(null);

  /* La recherche demandée, et celle dont le résultat est affiché. Le
     chargement se déduit de l'écart entre les deux. Arrivée depuis la page de
     confirmation, la première recherche est déjà posée dans l'état initial :
     elle part donc au premier rendu, sans effet qui la déclenche après coup. */
  const [demande, setDemande] = useState(
    refUrl && state?.telephone ? { reference: refUrl, telephone: state.telephone } : null
  );
  const [affichee, setAffichee] = useState(null);
  const chargement = demande !== null && demande !== affichee;

  useEffect(() => {
    if (!demande) return undefined;

    let annule = false;
    suivreCommande(demande.reference, demande.telephone)
      .then((c) => { if (!annule) { setCommande(c); setErreur(null); } })
      .catch((e) => { if (!annule) { setCommande(null); setErreur(e.message); } })
      .finally(() => { if (!annule) setAffichee(demande); });

    return () => { annule = true; };
  }, [demande]);

  const soumettre = (e) => {
    e.preventDefault();
    if (!reference.trim() || telephone.replace(/\D/g, '').length < 9) {
      return setErreur('Indiquez votre référence de commande et le numéro utilisé.');
    }
    // Un nouvel objet à chaque envoi : relancer la même recherche après un
    // échec réseau doit repartir, même si les valeurs n'ont pas bougé.
    return setDemande({ reference: reference.trim(), telephone: telephone.trim() });
  };

  return (
    <div className="bq-section bq-suivi">
      <h1 className="bq-page-titre">Suivre ma commande</h1>
      <p className="bq-suivi__intro">
        Entrez la référence reçue à la validation et le numéro de téléphone que
        vous aviez donné.
      </p>

      <form className="bq-suivi__form" onSubmit={soumettre} noValidate>
        <label className="bq-label">
          Référence
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())}
            placeholder="CMD-2026-XXXXXX"
            /* Le clavier logiciel ne doit ni corriger ni mettre en minuscules
               une référence : c'est un code, pas un mot. */
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck="false"
          />
        </label>

        <label className="bq-label">
          Téléphone
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="77 123 45 67"
            autoComplete="tel"
          />
        </label>

        <button type="submit" className="bq-bouton bq-bouton--grand" disabled={chargement}>
          {chargement
            ? (<><Loader2 size={17} strokeWidth={2.4} className="bq-tourne" aria-hidden="true" /> Recherche…</>)
            : (<><Search size={17} strokeWidth={2.4} aria-hidden="true" /> Rechercher</>)}
        </button>
      </form>

      {erreur && (
        <p className="bq-erreur" role="alert">
          <AlertCircle size={17} strokeWidth={2.2} aria-hidden="true" /> {erreur}
        </p>
      )}

      {commande && (
        <div className="bq-suivi__resultat">
          <header className="bq-suivi__entete">
            <div>
              <p className="bq-suivi__ref">{commande.reference}</p>
              <p className="bq-suivi__date">
                Passée le {new Date(commande.date).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
            <p className="bq-suivi__montant">{formaterPrix(commande.montantTotal)}</p>
          </header>

          <Progression statut={commande.statut} modeLivraison={commande.modeLivraison} />

          <ul className="bq-suivi__lignes">
            {commande.lignes.map((l, i) => (
              <li key={i}>
                <ImageProduit src={l.image} alt={l.nom} className="bq-suivi__image" />
                <span className="bq-suivi__nom">{l.nom}</span>
                <span className="bq-suivi__qte">× {l.quantite}</span>
                <span className="bq-suivi__prix">{formaterPrix(l.sousTotal)}</span>
              </li>
            ))}
          </ul>

          <dl className="bq-suivi__detail">
            <div><dt>Articles</dt><dd>{formaterPrix(commande.montantProduits)}</dd></div>
            <div><dt>Livraison</dt><dd>{Number(commande.fraisLivraison) > 0 ? formaterPrix(commande.fraisLivraison) : 'Offerte'}</dd></div>
            <div><dt>Total</dt><dd><strong>{formaterPrix(commande.montantTotal)}</strong></dd></div>
            <div>
              <dt>Paiement</dt>
              <dd>{commande.statutPaiement === 'paye' ? 'Réglé' : commande.modePaiement === 'a_la_livraison' ? 'À la réception' : 'En attente'}</dd>
            </div>
            {commande.adresseLivraison && (
              <div><dt>Livraison à</dt><dd>{commande.adresseLivraison}</dd></div>
            )}
          </dl>

          {commande.boutique?.telephone && (
            <p className="bq-suivi__contact">
              Une question ? Appelez {commande.boutique.nom} au{' '}
              <a href={`tel:${commande.boutique.telephone}`}>{commande.boutique.telephone}</a>.
            </p>
          )}
        </div>
      )}

      <p className="bq-retour">
        <Link to={`/b/${boutique.slug}`} className="bq-lien-discret">← Retour à la boutique</Link>
      </p>
    </div>
  );
}
