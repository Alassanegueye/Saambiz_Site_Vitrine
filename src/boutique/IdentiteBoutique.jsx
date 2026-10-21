import { MapPin, Phone, Clock, BadgeCheck, MessageCircle, Ghost } from 'lucide-react';
// lucide ne fournit plus d'icônes de marque : voir icones.jsx. Snapchat et
// WhatsApp prennent des pictogrammes génériques, nommés pour l'accessibilité.
import { Facebook, Instagram, TikTok } from './icones';

/** Lien WhatsApp — le canal réel de la vente au Sénégal. */
function lienWhatsapp(numero, nomBoutique) {
  const propre = String(numero || '').replace(/\D/g, '');
  if (!propre) return null;
  const texte = encodeURIComponent(`Bonjour ${nomBoutique}, je vous contacte depuis votre site.`);
  return `https://wa.me/${propre}?text=${texte}`;
}

/**
 * Le haut du site : tout ce qui identifie la boutique, au même endroit —
 * logo, nom, slogan, adresse, téléphone et réseaux — dans une seule boîte à
 * la couleur de la boutique. Le reste de la page reste blanc.
 */
export default function IdentiteBoutique({ boutique }) {
  const adresse = boutique.localisation || boutique.ville;
  const telephone = boutique.telephone || boutique.whatsapp;
  const reseaux = boutique.reseaux || {};
  const wa = lienWhatsapp(boutique.whatsapp || boutique.telephone, boutique.nom);
  const forme = boutique.logoForme || 'libre';

  const liens = [
    reseaux.instagram && { href: reseaux.instagram, nom: 'Instagram', icone: <Instagram size={19} /> },
    reseaux.snapchat && { href: reseaux.snapchat, nom: 'Snapchat', icone: <Ghost size={19} strokeWidth={2} /> },
    wa && { href: wa, nom: 'WhatsApp', icone: <MessageCircle size={19} strokeWidth={2} /> },
    reseaux.facebook && { href: reseaux.facebook, nom: 'Facebook', icone: <Facebook size={19} /> },
    reseaux.tiktok && { href: reseaux.tiktok, nom: 'TikTok', icone: <TikTok size={19} /> },
  ].filter(Boolean);

  return (
    <section className="bq-identite-bloc">
      <div className="bq-identite-bloc__carte">
        <div className="bq-identite-bloc__logo">
          {boutique.logo
            ? <img src={boutique.logo} alt={`Logo de ${boutique.nom}`} className={`bq-identite-bloc__logo-img bq-identite-bloc__logo-img--${forme}`} />
            : <span className="bq-identite-bloc__initiale" aria-hidden="true">{boutique.nom.charAt(0).toUpperCase()}</span>}
        </div>

        <div className="bq-identite-bloc__texte">
        <h1 className="bq-identite-bloc__nom">
          {boutique.nom}
          {boutique.verifiee && (
            <BadgeCheck size={22} strokeWidth={2.3} className="bq-verifiee" aria-label="Boutique vérifiée par SaamBiz" />
          )}
        </h1>
        {boutique.slogan && <p className="bq-identite-bloc__slogan">{boutique.slogan}</p>}

        {(adresse || telephone || boutique.horaires) && (
          <ul className="bq-identite-bloc__infos">
            {adresse && (
              <li><MapPin size={16} strokeWidth={2} aria-hidden="true" /><span>{adresse}</span></li>
            )}
            {telephone && (
              <li>
                <Phone size={16} strokeWidth={2} aria-hidden="true" />
                <a href={`tel:${telephone.replace(/\s/g, '')}`}>{telephone}</a>
              </li>
            )}
            {boutique.horaires && (
              <li><Clock size={16} strokeWidth={2} aria-hidden="true" /><span>{boutique.horaires}</span></li>
            )}
          </ul>
        )}

        {liens.length > 0 && (
          <div className="bq-identite-bloc__reseaux">
            {liens.map((l) => (
              <a key={l.nom} href={l.href} target="_blank" rel="noopener noreferrer"
                 className="bq-identite-bloc__reseau" aria-label={l.nom} title={l.nom}>
                {l.icone}
              </a>
            ))}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
