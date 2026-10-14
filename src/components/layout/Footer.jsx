import { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import picto from '../../assets/brand/picto-white.png';
import { company } from '../../data/legal';
import LegalModal from './LegalModal';

/* Pied de page — fond encre, coupe supérieure à 40°, grand pictogramme.
   Même construction que le pied de page du site Kodafrik : la marque en
   grand à gauche, trois colonnes, puis une ligne basse avec le copyright,
   les textes légaux (ouverts en fenêtre) et le retour en haut. */

const Instagram = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);
const Facebook = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const XLogo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const socials = [
  { label: 'Instagram', href: 'https://instagram.com/saambiz', Icon: Instagram },
  { label: 'Facebook',  href: 'https://facebook.com/saambiz',  Icon: Facebook  },
  { label: 'X',         href: 'https://x.com/saambiz',         Icon: XLogo     },
];

const siteLinks = [
  { label: 'Accueil',         id: 'hero'     },
  { label: 'Fonctionnalités', id: 'features' },
  { label: 'Vendeurs',        id: 'vendor'   },
  { label: 'Boutique web',    id: 'channels' },
  { label: 'Clients',         id: 'client'   },
  { label: 'Tarifs',          id: 'pricing'  },
  { label: 'FAQ',             id: 'faq'      },
];

/* Ce que fait l'application, en texte simple : utile aux moteurs de
   recherche, sans répéter le menu. */
const features = [
  'Boutique en ligne avec lien à partager',
  'Gestion des commandes et livraisons',
  'Tableau de bord des ventes',
  'Promotions et notifications',
];

const Footer = ({ scrollTo }) => {
  // Texte légal ouvert en fenêtre : 'conditions', 'confidentialite' ou null.
  const [legalDoc, setLegalDoc] = useState(null);

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src={picto} alt="" width="460" height="419" loading="lazy" decoding="async" className="footer__mark" />
          <p className="footer__name">Saam<span>Biz</span></p>
          <p className="footer__baseline">
            L’application qui met la boutique des commerçants sénégalais en ligne. Dakar, Sénégal.
          </p>
        </div>

        <nav className="footer__col footer__col--wide" aria-label="Plan du site">
          <h2>Le site</h2>
          <ul>
            {siteLinks.map((l) => (
              <li key={l.id}>
                <button type="button" onClick={() => scrollTo(l.id)}>{l.label}</button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col footer__col--wide">
          <h2>L’application</h2>
          <ul className="footer__plain">
            {features.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>

        <div className="footer__col footer__col--contact">
          <h2>Nous joindre</h2>
          <ul className="footer__contacts">
            <li><a href={`tel:${company.phoneHref}`}>{company.phone}</a></li>
            <li><a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a></li>
            <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
            <li className="footer__muted">Support 7j/7</li>
          </ul>
          <ul className="footer__socials">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" aria-label={`SaamBiz sur ${label}`}>
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} {company.name} · {company.address}</p>
        <ul className="footer__legal">
          <li>
            <button type="button" onClick={() => setLegalDoc('conditions')}>Conditions générales</button>
          </li>
          <li>
            <button type="button" onClick={() => setLegalDoc('confidentialite')}>Confidentialité</button>
          </li>
        </ul>
        <button type="button" className="footer__top" onClick={() => scrollTo('hero')}>
          Haut de page
          <ArrowUp size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>

      <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} onSwitch={setLegalDoc} />

      <style>{`
        .footer {
          position: relative;
          padding: clamp(3.5rem, 3rem + 1.5vw, 4.5rem) 40px 1.25rem;
          /* Un ton plus sombre que la section « Télécharger » au-dessus,
             pour que la coupe à 40° se lise. */
          background: var(--navy-deep);
          color: #C3CCE0;
          margin-top: -1px;
        }

        /* Coupe supérieure : encoche de 64 px de haut pour 76 px de large
           (40°), dessinée dans la couleur de la section au-dessus. Elle
           déborde de 2 px vers le haut pour ne laisser aucun filet sur les
           écrans mis à l'échelle (125 %, 150 %). */
        .footer::before {
          content: '';
          position: absolute; top: -2px; left: 0;
          width: 78px; height: 66px;
          background: var(--navy);
          clip-path: polygon(0 0, 100% 0, 0 100%);
        }

        .footer__inner,
        .footer__bottom { max-width: 1140px; margin: 0 auto; }

        .footer__inner {
          display: grid;
          grid-template-columns: minmax(0, 3fr) repeat(3, minmax(0, 2.4fr));
          column-gap: 2.5rem;
          row-gap: 2rem;
        }

        .footer__mark { width: clamp(3.5rem, 3rem + 1.5vw, 4.5rem); height: auto; }
        .footer__name {
          margin-top: 0.75rem;
          font-family: var(--font-display);
          font-size: 1.75rem; font-weight: 700;
          letter-spacing: -0.02em; color: var(--white);
        }
        .footer__name span { color: var(--gold); }
        .footer__baseline { margin-top: 0.5rem; max-width: 20rem; font-size: 15px; line-height: 1.6; }

        .footer__col h2 {
          margin-bottom: 0.75rem;
          font-family: var(--font-body);
          font-size: 0.9375rem; font-weight: 700; letter-spacing: 0;
          color: #9AA8C7;
        }
        .footer__col ul { list-style: none; display: grid; gap: 0.15rem; }
        .footer__col a,
        .footer__col button {
          display: inline-flex; align-items: center; min-height: 30px;
          padding: 0; border: 0; background: none;
          font: inherit; font-size: 14.5px; font-weight: 700;
          color: var(--white); text-align: left;
        }
        .footer__col a:hover,
        .footer__col button:hover {
          text-decoration: underline;
          text-decoration-thickness: 2px;
          text-underline-offset: 4px;
        }
        .footer__plain li,
        .footer__muted { font-size: 14.5px; line-height: 1.45; color: #C3CCE0; padding: 4px 0; }

        .footer__col .footer__socials { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
        .footer__socials a {
          justify-content: center;
          width: 38px; height: 38px;
          border: 1.5px solid rgba(195,204,224,0.45);
          border-radius: 999px;
        }
        .footer__socials a:hover { border-color: var(--white); text-decoration: none; }

        .footer__bottom {
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
          gap: 0.75rem;
          margin-top: 2rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(195,204,224,0.2);
          font-size: 0.9375rem;
          /* Le bouton « retour en haut » fixe se pose en bas à droite :
             on lui laisse sa place. */
          padding-right: 64px;
        }
        .footer__legal { list-style: none; display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; }
        .footer__legal button {
          display: inline-flex; align-items: center; min-height: 44px;
          padding: 0; border: 0; background: none; font: inherit;
          color: #C3CCE0;
          text-decoration: underline;
          text-decoration-color: rgba(195,204,224,0.4);
          text-underline-offset: 4px;
        }
        .footer__legal button:hover { color: var(--white); text-decoration-color: var(--white); }
        .footer__top {
          display: inline-flex; align-items: center; gap: 0.5rem; min-height: 44px;
          padding: 0; border: 0; background: none; font: inherit;
          font-weight: 700; color: var(--white);
        }
        .footer__top:hover { text-decoration: underline; text-underline-offset: 4px; }

        /* Tablette */
        @media (max-width: 1023px) {
          .footer { padding-left: 24px; padding-right: 24px; }
          .footer__inner { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .footer__brand { grid-column: 1 / -1; }
        }

        /* Mobile : le plan du site et la liste des fonctions répètent le
           menu et la page — seuls la marque et les contacts restent. */
        /* Mobile : un pied de page court et centré, comme sur le site
           Kodafrik — la marque, les réseaux sociaux, les textes légaux et
           le copyright. Le plan du site, les fonctions et les contacts
           répètent le menu et la section FAQ : ils ne sont pas repris. */
        @media (max-width: 900px) {
          .footer { padding: 3rem 20px calc(1.25rem + env(safe-area-inset-bottom)); text-align: center; }
          .footer::before { width: 50px; height: 42px; }
          .footer__inner { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; }
          .footer__col--wide,
          .footer__col--contact h2,
          .footer__col .footer__contacts,
          .footer__baseline { display: none; }
          .footer__brand { display: flex; align-items: center; gap: 10px; }
          .footer__mark { width: 2.5rem; }
          .footer__name { margin-top: 0; font-size: 1.4rem; }
          .footer__col .footer__socials { margin-top: 0; justify-content: center; }
          .footer__bottom {
            flex-direction: column; align-items: center; gap: 0.25rem;
            margin-top: 1.5rem; padding-top: 1rem; padding-right: 0;
            font-size: 0.875rem;
          }
          .footer__legal { justify-content: center; gap: 0 1.25rem; order: -1; }
          .footer__legal button { min-height: 40px; }
          /* Le bouton flottant « retour en haut » fait déjà ce travail. */
          .footer__top { display: none; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
