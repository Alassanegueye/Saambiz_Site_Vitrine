import { Phone, MapPin, BadgeCheck, MessageCircle, Ghost, Star, Store, Heart, Clock } from 'lucide-react';
// lucide ne fournit plus d'icônes de marque : voir icones.jsx. Snapchat et
// WhatsApp prennent des pictogrammes génériques, nommés pour l'accessibilité.
import { Facebook, Instagram, TikTok } from './icones';

// « Suivre » passe par l'application : le bouton invite à la télécharger.
import { inviterApplication } from './stores';

/** Lien WhatsApp — le canal réel de la vente au Sénégal. */
function lienWhatsapp(numero, nomBoutique) {
  const propre = String(numero || '').replace(/\D/g, '');
  if (!propre) return null;
  const texte = encodeURIComponent(`Bonjour ${nomBoutique}, je vous contacte depuis votre site.`);
  return `https://wa.me/${propre}?text=${texte}`;
}

/**
 * Le haut du site : logo rond, nom, activité, note et ancienneté, bouton
 * « Suivre », l'adresse (lien vers la carte), puis les deux façons de joindre
 * la boutique (appeler, écrire sur WhatsApp) et ses réseaux.
 */
export default function IdentiteBoutique({ boutique }) {
  const adresse = boutique.localisation || boutique.ville;
  const telephone = boutique.telephone || boutique.whatsapp;
  const reseaux = boutique.reseaux || {};
  const wa = lienWhatsapp(boutique.whatsapp || boutique.telephone, boutique.nom);
  const forme = boutique.logoForme || 'libre';
  const stats = boutique.stats || {};
  const carte = adresse ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresse)}` : null;

  const liens = [
    reseaux.instagram && { href: reseaux.instagram, nom: 'Instagram', icone: <Instagram size={17} /> },
    reseaux.snapchat && { href: reseaux.snapchat, nom: 'Snapchat', icone: <Ghost size={17} strokeWidth={2} /> },
    reseaux.facebook && { href: reseaux.facebook, nom: 'Facebook', icone: <Facebook size={17} /> },
    reseaux.tiktok && { href: reseaux.tiktok, nom: 'TikTok', icone: <TikTok size={17} /> },
  ].filter(Boolean);

  const sousTitre = boutique.slogan || boutique.categorie;

  return (
    <section className="bq-id" data-apercu="style">
      <div className="bq-id__haut">
        <div className="bq-id__logo">
          {boutique.logo
            ? <img src={boutique.logo} alt={`Logo de ${boutique.nom}`} className={`bq-id__logo-img bq-id__logo-img--${forme}`} />
            : <Store size={44} strokeWidth={1.8} aria-hidden="true" />}
        </div>

        <div className="bq-id__texte">
          <h1 className="bq-id__nom">
            {boutique.nom}
            {boutique.verifiee && (
              <BadgeCheck size={24} strokeWidth={2.2} className="bq-verifiee" aria-label="Boutique vérifiée par SaamBiz" />
            )}
          </h1>
          {sousTitre && <p className="bq-id__sous">{sousTitre}</p>}
          <p className="bq-id__meta">
            {stats.note != null && stats.avis > 0 && (
              <span className="bq-id__note">
                <Star size={17} className="bq-id__etoile" aria-hidden="true" />
                <strong>{stats.note}</strong> <span>({stats.avis} avis)</span>
              </span>
            )}
            {boutique.depuis && (
              <span className="bq-id__depuis">
                <Store size={16} strokeWidth={2} aria-hidden="true" /> Vente en ligne depuis {boutique.depuis}
              </span>
            )}
            {adresse && (
              <a className="bq-id__lieu" href={carte} target="_blank" rel="noopener noreferrer" title="Voir sur la carte">
                <MapPin size={16} strokeWidth={2} aria-hidden="true" /> {adresse}
              </a>
            )}
          </p>
        </div>

        <button type="button" className="bq-id__suivre" onClick={() => inviterApplication('suivre')}
          title={`Suivez ${boutique.nom} dans l'application SaamBiz`}>
          <Heart size={19} strokeWidth={2.2} aria-hidden="true" /> Suivre
        </button>
      </div>

      <div className="bq-id__ligne">
      {(telephone || wa) && (
        <ul className="bq-id__contacts">
          {telephone && (
            <li>
              <a href={`tel:${telephone.replace(/\s/g, '')}`}>
                <span className="bq-id__pastille"><Phone size={18} strokeWidth={2.2} aria-hidden="true" /></span>
                <span><strong>Appeler</strong><small>{telephone}</small></span>
              </a>
            </li>
          )}
          {wa && (
            <li>
              <a href={wa} target="_blank" rel="noopener noreferrer">
                <span className="bq-id__pastille"><MessageCircle size={18} strokeWidth={2.2} aria-hidden="true" /></span>
                <span><strong>WhatsApp</strong><small>Écrire</small></span>
              </a>
            </li>
          )}
        </ul>
      )}

      {(liens.length > 0 || boutique.horaires) && (
        <div className="bq-id__bas">
          {boutique.horaires && (
            <span className="bq-id__horaires"><Clock size={15} aria-hidden="true" /> {boutique.horaires}</span>
          )}
          {liens.length > 0 && (
            <div className="bq-id__reseaux">
              <span className="bq-id__reseaux-titre">Suivez-nous</span>
              {liens.map((l) => (
                <a key={l.nom} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.nom} title={l.nom}>
                  {l.icone}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </section>
  );
}
