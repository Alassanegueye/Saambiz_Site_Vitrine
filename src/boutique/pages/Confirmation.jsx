import { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Copy, Check, MessageCircle, Phone } from 'lucide-react';
import { formaterTelephone, lienTelephone, lienWhatsapp } from '../outils';
import { formaterPrix } from '../api';

/**
 * La page qui suit une commande réussie.
 *
 * Elle a trois choses à faire, dans cet ordre : rassurer, donner la référence
 * de la commande, et seulement ensuite proposer l'application. C'est le moment où
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

  const lienWa = lienWhatsapp(
    boutique.whatsapp || boutique.telephone,
    `Bonjour, je viens de passer la commande ${resultat.reference} sur votre site.`,
  );

  return (
    <>
      <div className="bq-section bq-confirmation">
        <span className="bq-confirmation__coche" aria-hidden="true">
          <Check size={36} strokeWidth={2.6} />
        </span>

        <h1>Merci, votre commande est enregistrée</h1>
        <p className="bq-confirmation__intro">
          {boutique.nom} vient d'être prévenu. Le vendeur vous appellera au{' '}
          <strong>{formaterTelephone(resultat.telephone)}</strong> pour confirmer.
        </p>

        {/* Le reçu : la référence en grand, puis l'essentiel de la commande.
            C'est ce que le client photographie ou recopie. */}
        <div className="bq-recu">
          <div className="bq-recu__haut">
            <span className="bq-recu__boutique">{boutique.nom}</span>
            <span className="bq-recu__libelle">Référence de commande</span>
            <span className="bq-recu__valeur">{resultat.reference}</span>
            <button type="button" onClick={copierReference} className="bq-recu__copier">
              {copie
                ? (<><Check size={15} strokeWidth={2.5} aria-hidden="true" /> Référence copiée</>)
                : (<><Copy size={15} strokeWidth={2.2} aria-hidden="true" /> Copier la référence</>)}
            </button>
          </div>

          <div className="bq-recu__coupe" aria-hidden="true" />

          <dl className="bq-recu__detail">
            <div>
              <dt>Total</dt>
              <dd>{formaterPrix(resultat.montantTotal)}</dd>
            </div>
            <div>
              <dt>Réception</dt>
              <dd>{resultat.modeLivraison === 'retrait' ? 'Retrait sur place' : 'Livraison'}</dd>
            </div>
            <div>
              <dt>Paiement</dt>
              <dd>{resultat.modePaiement === 'a_la_livraison' ? 'À la réception' : 'En ligne'}</dd>
            </div>
          </dl>
        </div>

        {/* Frais de livraison : le montant vient du serveur, on ne l'annonce
            que quand il est réellement appliqué. */}
        {Number(resultat.fraisLivraison) > 0 && (
          <p className="bq-confirmation__frais">
            Dont {formaterPrix(resultat.fraisLivraison)} de frais de livraison.
          </p>
        )}

        <div className="bq-confirmation__actions">
          {lienWa && (
            <a className="bq-bouton bq-bouton--doux bq-bouton--grand" href={lienWa} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={17} strokeWidth={2.2} aria-hidden="true" /> Écrire au vendeur
            </a>
          )}

          {boutique.telephone && (
            <a className="bq-bouton bq-bouton--doux bq-bouton--grand" href={lienTelephone(boutique.telephone)}>
              <Phone size={17} strokeWidth={2.2} aria-hidden="true" /> Appeler
            </a>
          )}
        </div>

        <p className="bq-confirmation__memo">
          Notez votre référence : donnez-la au vendeur si vous le contactez
          au sujet de votre commande.
        </p>
      </div>
    </>
  );
}
