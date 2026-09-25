import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Globe, MessageCircle } from 'lucide-react';
// lucide ne fournit plus d'icônes de marque : voir icones.jsx.
import { Facebook, Instagram, TikTok } from './icones';
import logoBlanc from '../assets/brand/logo-white.png';

/**
 * Le pied de page du site d'une boutique : contact, horaires, réseaux, puis
 * la mention SaamBiz.
 *
 * La marque de la plateforme n'apparaît qu'ici, discrètement. Le client est
 * venu voir un commerçant ; lui rappeler la marketplace en haut de chaque
 * page ne lui apporte rien et dilue la boutique.
 */

/** Lien WhatsApp — le canal réel de la vente au Sénégal. */
function lienWhatsapp(numero, nomBoutique) {
  const propre = String(numero || '').replace(/\D/g, '');
  if (!propre) return null;
  const texte = encodeURIComponent(`Bonjour ${nomBoutique}, je vous contacte depuis votre site.`);
  return `https://wa.me/${propre}?text=${texte}`;
}

export default function Pied({ boutique }) {
  const base = `/b/${boutique.slug}`;
  const wa = lienWhatsapp(boutique.whatsapp || boutique.telephone, boutique.nom);
  const reseaux = boutique.reseaux || {};
  const sections = boutique.theme.sections;

  return (
    <footer className="bq-pied">
      <div className="bq-pied__haut">
        <div className="bq-pied__bloc">
          <h3>{boutique.nom}</h3>
          {boutique.description && <p className="bq-pied__desc">{boutique.description}</p>}

          {(reseaux.facebook || reseaux.instagram || reseaux.tiktok || reseaux.site) && (
            <div className="bq-pied__reseaux">
              {reseaux.facebook && (
                <a href={reseaux.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
              )}
              {reseaux.instagram && (
                <a href={reseaux.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
              )}
              {reseaux.tiktok && (
                <a href={reseaux.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <TikTok size={18} />
                </a>
              )}
              {reseaux.site && (
                <a href={reseaux.site} target="_blank" rel="noopener noreferrer" aria-label="Site web">
                  <Globe size={18} strokeWidth={2} />
                </a>
              )}
            </div>
          )}
        </div>

        {sections.contact && (
          <div className="bq-pied__bloc">
            <h4>Nous joindre</h4>
            <ul className="bq-pied__liste">
              {boutique.telephone && (
                <li>
                  <Phone size={15} strokeWidth={2} aria-hidden="true" />
                  <a href={`tel:${boutique.telephone}`}>{boutique.telephone}</a>
                </li>
              )}
              {wa && (
                <li>
                  <MessageCircle size={15} strokeWidth={2} aria-hidden="true" />
                  <a href={wa} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
                </li>
              )}
              {(boutique.localisation || boutique.ville) && (
                <li>
                  <MapPin size={15} strokeWidth={2} aria-hidden="true" />
                  <span>{boutique.localisation || boutique.ville}</span>
                </li>
              )}
              {boutique.horaires && (
                <li>
                  <Clock size={15} strokeWidth={2} aria-hidden="true" />
                  <span>{boutique.horaires}</span>
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="bq-pied__bloc">
          <h4>La boutique</h4>
          <ul className="bq-pied__liste bq-pied__liste--nue">
            <li><Link to={base}>Accueil</Link></li>
            <li><Link to={`${base}/catalogue`}>Tous les produits</Link></li>
            <li><Link to={`${base}/suivi`}>Suivre ma commande</Link></li>
            {boutique.commandeActivee && <li><Link to={`${base}/panier`}>Mon panier</Link></li>}
          </ul>
        </div>
      </div>

      <div className="bq-pied__bas">
        <p>© {new Date().getFullYear()} {boutique.nom}. Tous droits réservés.</p>
        <a href="/" className="bq-pied__saambiz">
          <span>Boutique propulsée par</span>
          <img src={logoBlanc} alt="SaamBiz" />
        </a>
      </div>
    </footer>
  );
}
