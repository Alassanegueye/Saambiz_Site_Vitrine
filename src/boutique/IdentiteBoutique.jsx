import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, BadgeCheck, MessageCircle, Star, Store, Clock, Share2, Check } from 'lucide-react';
import { formaterNote, lienCarte, lienTelephone, lienWhatsappBoutique } from './outils';
import { ImageProduit } from './composants';

/**
 * Le logo de la boutique, posé selon la forme mesurée à son téléversement :
 * 'rond' (pastille), 'carre' (tuile arrondie), 'bandeau' (large, le nom est
 * déjà écrit dedans) ou 'libre' (tel quel, sur une plaque blanche). Sans
 * logo, l'initiale de la boutique, dans sa couleur.
 */
export function LogoBoutique({ boutique, className = '' }) {
  const forme = boutique.logoForme || 'libre';
  if (boutique.logo) {
    return (
      <span className={`bq-logo bq-logo--${forme} ${className}`}>
        {/* Texte alternatif vide : le nom de la boutique est écrit juste à côté. */}
        <img src={boutique.logo} alt="" />
      </span>
    );
  }
  const initiale = (boutique.nom || '?').trim().charAt(0).toUpperCase();
  return <span className={`bq-logo bq-logo--initiale ${className}`} aria-hidden="true">{initiale}</span>;
}

/**
 * Le haut du site : logo, nom, activité, ce qui rassure (note, adresse,
 * horaires, ancienneté), puis les gestes utiles — écrire, appeler, partager.
 *
 * Volontairement sans bannière : la plupart des vendeurs n'en ont pas. Sur
 * ordinateur, la place à droite du nom accueille trois de ses produits, comme
 * une vitrine : la boutique se présente avec ce qu'elle vend, sans que le
 * vendeur ait rien à fournir de plus.
 */
export default function IdentiteBoutique({ boutique, vitrine = [] }) {
  const [lienCopie, setLienCopie] = useState(false);

  const adresse = boutique.localisation || boutique.ville;
  const telephone = boutique.telephone || boutique.whatsapp;
  const wa = lienWhatsappBoutique(boutique);
  const stats = boutique.stats || {};
  const sousTitre = boutique.slogan || boutique.categorie;
  const base = `/b/${boutique.slug}`;

  // Le lien de la boutique part vers le menu de partage du téléphone
  // (WhatsApp, SMS…) ; à défaut, il est copié.
  const partager = async () => {
    const url = `${window.location.origin}${base}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: boutique.nom, text: sousTitre || boutique.nom, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setLienCopie(true);
      setTimeout(() => setLienCopie(false), 2200);
    } catch {
      // Partage annulé par le client, ou presse-papier refusé : rien à dire.
    }
  };

  return (
    <section className={`bq-id ${vitrine.length ? 'bq-id--vitrine' : ''}`} data-apercu="style">
      <div className="bq-id__interieur">
        <div className="bq-id__principal">
          <div className="bq-id__haut">
            <LogoBoutique boutique={boutique} className="bq-id__logo" />
            <div className="bq-id__texte">
              <h1 className="bq-id__nom">
                {boutique.nom}
                {boutique.verifiee && (
                  <BadgeCheck size={24} strokeWidth={2.2} className="bq-verifiee" aria-label="Boutique certifiée par SaamBiz" />
                )}
              </h1>
              {sousTitre && <p className="bq-id__slogan">{sousTitre}</p>}
            </div>
          </div>

          <ul className="bq-reperes">
            {stats.note != null && stats.avis > 0 && (
              <li>
                <Star size={15} className="bq-reperes__etoile" aria-hidden="true" />
                <strong>{formaterNote(stats.note)}</strong>
                <span className="bq-reperes__discret">({stats.avis} avis)</span>
              </li>
            )}
            {adresse && (
              <li>
                <a href={lienCarte(adresse)} target="_blank" rel="noopener noreferrer" title="Voir sur la carte">
                  <MapPin size={15} strokeWidth={2.2} aria-hidden="true" /> {adresse}
                </a>
              </li>
            )}
            {boutique.horaires && (
              <li><Clock size={15} strokeWidth={2.2} aria-hidden="true" /> {boutique.horaires}</li>
            )}
            {boutique.depuis && (
              <li><Store size={15} strokeWidth={2.2} aria-hidden="true" /> En ligne depuis {boutique.depuis}</li>
            )}
          </ul>

          <div className="bq-actions">
            {wa && (
              <a className="bq-action bq-action--principale" href={wa} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} strokeWidth={2.2} aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            )}
            {telephone && (
              <a className="bq-action" href={lienTelephone(telephone)}>
                <Phone size={18} strokeWidth={2.2} aria-hidden="true" />
                <span>Appeler</span>
              </a>
            )}
            <button type="button" className="bq-action" onClick={partager} aria-live="polite">
              {lienCopie
                ? <Check size={18} strokeWidth={2.4} aria-hidden="true" />
                : <Share2 size={18} strokeWidth={2.2} aria-hidden="true" />}
              <span>{lienCopie ? 'Lien copié' : 'Partager'}</span>
            </button>
          </div>
        </div>

        {vitrine.length > 0 && (
          <ul className="bq-id__vitrine" aria-label={`Quelques produits de ${boutique.nom}`}>
            {vitrine.map((p, i) => (
              <li key={p.id} className={`bq-id__piece bq-id__piece--${i + 1}`}>
                <Link to={`${base}/produit/${p.id}`} className="bq-id__piece-lien">
                  {/* Paresseuses : sur téléphone, la vitrine est masquée et
                      ses photos ne doivent rien coûter au forfait. Sur
                      ordinateur, elles sont dans l'écran et chargent tout de
                      suite. */}
                  <ImageProduit src={p.image} alt={p.nom} className="bq-id__piece-image" />
                  <span className="bq-id__piece-nom">{p.nom}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
