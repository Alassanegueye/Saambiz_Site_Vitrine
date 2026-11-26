import { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Copy, Check, MessageCircle, Phone, PackageSearch, ShieldCheck } from 'lucide-react';
import { formaterTelephone, lienTelephone, lienWhatsapp } from '../outils';
import { formaterPrix } from '../api';

/**
 * La page qui suit une commande réussie.
 *
 * Elle a trois choses à faire, dans cet ordre : rassurer, donner le NUMÉRO
 * de la commande (à copier, à garder), et dire où la suivre : sur
 * saambiz.com, avec ce numéro. Aucun e-mail ne part plus : le numéro est le
 * seul moyen de retrouver la commande, d'où l'insistance à le garder.
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
            <span className="bq-recu__libelle">Numéro de commande</span>
            <span className="bq-recu__valeur">{resultat.reference}</span>
            <button type="button" onClick={copierReference} className="bq-recu__copier" aria-live="polite">
              {copie
                ? (<><Check size={15} strokeWidth={2.5} aria-hidden="true" /> Numéro copié</>)
                : (<><Copy size={15} strokeWidth={2.2} aria-hidden="true" /> Copier le numéro</>)}
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

        <p className="bq-confirmation__memo">
          <ShieldCheck size={16} strokeWidth={2.2} aria-hidden="true" />
          <span>
            <strong>Enregistrez bien ce numéro</strong> (copiez-le ou faites une
            capture d'écran) : c'est le seul moyen de retrouver votre commande,
            aucun e-mail ne vous sera envoyé. Gardez-le pour vous : il permet de
            modifier la commande.
          </span>
        </p>

        {/* Où suivre la commande : saambiz.com, avec le numéro. */}
        <div className="bq-suivre">
          <span className="bq-suivre__icone" aria-hidden="true">
            <PackageSearch size={22} strokeWidth={2} />
          </span>
          <div className="bq-suivre__texte">
            <strong>Suivez votre commande sur saambiz.com</strong>
            <p>
              Entrez votre numéro de commande en haut de la page d'accueil de
              saambiz.com : vous y verrez où en est votre commande, et vous
              pourrez la modifier ou l'annuler tant que la boutique ne l'a pas
              préparée.
            </p>
            <a className="bq-bouton bq-bouton--grand bq-suivre__lien" href="/#suivi">
              <PackageSearch size={17} strokeWidth={2.2} aria-hidden="true" /> Suivre ma commande
            </a>
          </div>
        </div>

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

      </div>
    </>
  );
}
