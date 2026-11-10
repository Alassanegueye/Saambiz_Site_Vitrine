import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Globe, MessageCircle, Ghost } from 'lucide-react';
// lucide ne fournit plus d'icônes de marque : voir icones.jsx.
import { Facebook, Instagram, TikTok } from './icones';
import { LogoBoutique } from './IdentiteBoutique';
import { lienCarte, lienTelephone, lienWhatsapp } from './outils';
import logoBlanc from '../assets/brand/logo-white.png';

/**
 * Le pied de page du site d'une boutique : sa couleur, très assombrie, comme
 * le bas d'une façade ; le contact, les liens utiles, puis la mention
 * SaamBiz.
 *
 * La marque de la plateforme n'apparaît qu'ici, discrètement. Le client est
 * venu voir un commerçant ; lui rappeler la marketplace en haut de chaque
 * page ne lui apporte rien et dilue la boutique.
 */
export default function Pied({ boutique }) {
  const base = `/b/${boutique.slug}`;
  const wa = lienWhatsapp(boutique.whatsapp || boutique.telephone, `Bonjour ${boutique.nom}, je vous contacte depuis votre site.`);
  const reseaux = boutique.reseaux || {};
  const sections = boutique.theme.sections || {};
  const adresse = boutique.localisation || boutique.ville;

  const liens = [
    reseaux.instagram && { href: reseaux.instagram, nom: 'Instagram', icone: <Instagram size={18} /> },
    reseaux.facebook && { href: reseaux.facebook, nom: 'Facebook', icone: <Facebook size={18} /> },
    reseaux.tiktok && { href: reseaux.tiktok, nom: 'TikTok', icone: <TikTok size={18} /> },
    reseaux.snapchat && { href: reseaux.snapchat, nom: 'Snapchat', icone: <Ghost size={18} strokeWidth={2} /> },
    reseaux.site && { href: reseaux.site, nom: 'Site web', icone: <Globe size={18} strokeWidth={2} /> },
  ].filter(Boolean);

  return (
    <footer className="bq-pied">
      <div className="bq-pied__haut">
        <div className="bq-pied__marque">
          <p className="bq-pied__nom">
            <LogoBoutique boutique={boutique} className="bq-pied__logo" />
            {boutique.nom}
          </p>
          {(boutique.description || boutique.slogan) && (
            <p className="bq-pied__desc">{boutique.description || boutique.slogan}</p>
          )}
          {liens.length > 0 && (
            <div className="bq-reseaux bq-reseaux--pied">
              {liens.map((l) => (
                <a key={l.nom} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.nom} title={l.nom}>
                  {l.icone}
                </a>
              ))}
            </div>
          )}
        </div>

        {sections.contact !== false && (boutique.telephone || wa || adresse || boutique.horaires) && (
          <div className="bq-pied__bloc">
            <h2>Nous joindre</h2>
            <ul className="bq-pied__liste">
              {boutique.telephone && (
                <li>
                  <Phone size={16} strokeWidth={2} aria-hidden="true" />
                  <a href={lienTelephone(boutique.telephone)}>{boutique.telephone}</a>
                </li>
              )}
              {wa && (
                <li>
                  <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
                  <a href={wa} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
                </li>
              )}
              {adresse && (
                <li>
                  <MapPin size={16} strokeWidth={2} aria-hidden="true" />
                  <a href={lienCarte(adresse)} target="_blank" rel="noopener noreferrer">{adresse}</a>
                </li>
              )}
              {boutique.horaires && (
                <li>
                  <Clock size={16} strokeWidth={2} aria-hidden="true" />
                  <span>{boutique.horaires}</span>
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="bq-pied__bloc">
          <h2>La boutique</h2>
          <ul className="bq-pied__liste bq-pied__liste--nue">
            <li><Link to={base}>Accueil</Link></li>
            <li><Link to={`${base}/catalogue`}>Tous les produits</Link></li>
            <li><Link to={`${base}/suivi`}>Suivre ma commande</Link></li>
            {boutique.commandeActivee && <li><Link to={`${base}/panier`}>Mon panier</Link></li>}
          </ul>
        </div>
      </div>

      <div className="bq-pied__bas">
        <p>© {new Date().getFullYear()} {boutique.nom}</p>
        <a href="/" className="bq-pied__saambiz">
          <span>Boutique créée avec</span>
          <img src={logoBlanc} alt="SaamBiz" width="88" height="21" />
        </a>
      </div>
    </footer>
  );
}
