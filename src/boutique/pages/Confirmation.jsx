import { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle2, Copy, Check, MessageCircle, Phone } from 'lucide-react';
import { formaterPrix } from '../api';
import AppelApplication from '../AppelApplication';

/**
 * La page qui suit une commande réussie.
 *
 * Elle a trois choses à faire, dans cet ordre : rassurer, donner la référence
 * de suivi, et seulement ensuite proposer l'application. C'est le moment où
 * l'argument porte : le client vient d'acheter, il a une commande à suivre, et
 * l'application est ce qui la lui met dans la poche.
 *
 * Le résultat arrive par l'état de navigation. Rien n'est redemandé au
 * serveur : recharger cette page ne repasserait donc aucune commande.
 */
export default function Confirmation({ boutique }) {
  const { state } = useLocation();
  const resultat = state?.resultat;
  const [copie, setCopie] = useState(false);

  // Page ouverte directement, ou rechargée : il n'y a rien à confirmer.
  if (!resultat) return <Navigate to={`/b/${boutique.slug}`} replace />;

  const copierReference = async () => {
    try {
      await navigator.clipboard.writeText(resultat.reference);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      // Presse-papier refusé (contexte non sécurisé, permission) : la
      // référence reste sélectionnable à la main juste à côté.
    }
  };

  const wa = boutique.whatsapp || boutique.telephone;
  const lienWa = wa
    ? `https://wa.me/${String(wa).replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour, je viens de passer la commande ${resultat.reference} sur votre site.`)}`
    : null;

  return (
    <>
      <div className="bq-section bq-confirmation">
        <span className="bq-confirmation__coche" aria-hidden="true">
          <CheckCircle2 size={42} strokeWidth={1.8} />
        </span>

        <h1>Merci, votre commande est enregistrée</h1>
        <p className="bq-confirmation__intro">
          {boutique.nom} vient d'être prévenu. Le vendeur vous appellera au{' '}
          <strong>{resultat.telephone}</strong> pour confirmer.
        </p>

        <div className="bq-reference">
          <span className="bq-reference__libelle">Référence de suivi</span>
          <span className="bq-reference__valeur">{resultat.reference}</span>
          <button type="button" onClick={copierReference} className="bq-reference__copier">
            {copie
              ? (<><Check size={15} strokeWidth={2.5} aria-hidden="true" /> Copiée</>)
              : (<><Copy size={15} strokeWidth={2.2} aria-hidden="true" /> Copier</>)}
          </button>
        </div>

        <dl className="bq-confirmation__detail">
          <div>
            <dt>Total</dt>
            <dd>{formaterPrix(resultat.montantTotal)}</dd>
          </div>
          <div>
            <dt>Mode de réception</dt>
            <dd>{resultat.modeLivraison === 'retrait' ? 'Retrait sur place' : 'Livraison'}</dd>
          </div>
          <div>
            <dt>Paiement</dt>
            <dd>{resultat.modePaiement === 'a_la_livraison' ? 'À la réception' : 'En ligne'}</dd>
          </div>
        </dl>

        {/* Frais de livraison : le montant vient du serveur, on ne l'annonce
            que quand il est réellement appliqué. */}
        {Number(resultat.fraisLivraison) > 0 && (
          <p className="bq-confirmation__frais">
            Dont {formaterPrix(resultat.fraisLivraison)} de frais de livraison.
          </p>
        )}

        <div className="bq-confirmation__actions">
          <Link
            to={`/b/${boutique.slug}/suivi/${resultat.reference}`}
            state={{ telephone: resultat.telephone }}
            className="bq-bouton bq-bouton--grand"
          >
            Suivre ma commande
          </Link>

          {lienWa && (
            <a className="bq-bouton bq-bouton--fantome bq-bouton--grand" href={lienWa} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={17} strokeWidth={2.2} aria-hidden="true" /> Écrire au vendeur
            </a>
          )}

          {boutique.telephone && (
            <a className="bq-bouton bq-bouton--fantome bq-bouton--grand" href={`tel:${boutique.telephone}`}>
              <Phone size={17} strokeWidth={2.2} aria-hidden="true" /> Appeler
            </a>
          )}
        </div>

        <p className="bq-confirmation__memo">
          Notez votre référence : avec votre numéro de téléphone, elle vous donne
          accès au suivi à tout moment, sans compte.
        </p>
      </div>

      {/* L'invitation à installer l'application arrive ici, une fois la
          commande passée et le suivi expliqué — pas avant. */}
      <AppelApplication boutique={boutique} contexte="commande" />
    </>
  );
}
