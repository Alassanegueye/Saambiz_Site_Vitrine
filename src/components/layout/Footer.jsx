import { Mail, MapPin, Phone } from 'lucide-react';
import logo from '../../assets/brand/logo-white.png';

const Instagram = ({ size=16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);
const Facebook = ({ size=16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const Twitter = ({ size=16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Footer = ({ scrollTo }) => {
  const year = new Date().getFullYear();

  const links = {
    'Fonctionnalités': [
      { label:'Créer une boutique',    id:'vendor'  },
      { label:'Gestion des ventes',    id:'vendor'  },
      { label:'Dashboard analytics',   id:'vendor'  },
      { label:'Promotions',            id:'vendor'  },
      { label:'Carte QR',              id:'qrcard'  },
    ],
    'Pour les clients': [
      { label:'Explorer les boutiques',id:'client'  },
      { label:'Abonnements',           id:'client'  },
      { label:'Notifications',         id:'client'  },
      { label:'Paiement sécurisé',     id:'payment' },
    ],
    'Support': [
      { label:'FAQ',                   id:'faq'     },
      { label:'Nous contacter',        id:'download'},
    ],
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <button className="footer-logo-btn" onClick={() => scrollTo('hero')}>
            <img src={logo} alt="SaamBiz" className="footer-logo-img" />
          </button>
          <p className="footer-tagline">
            La marketplace mobile qui connecte vendeurs et acheteurs au Sénégal. Commerce digital, simplifié.
          </p>
          <address className="footer-contact">
            <div className="fc-row"><MapPin size={13}/><span>Dakar, Sénégal</span></div>
            <a className="fc-row fc-link" href="mailto:contact@saambiz.com">
              <Mail size={13}/><span>contact@saambiz.sn</span>
            </a>
            <a className="fc-row fc-link" href="tel:+221775929390">
              <Phone size={13}/><span>+221 77 592 93 90</span>
            </a>
          </address>
          <div className="footer-social">
            {[
              { icon:<Instagram size={16}/>, label:'Instagram', href:'https://instagram.com/saambiz.sn' },
              { icon:<Facebook size={16}/>,  label:'Facebook',  href:'https://facebook.com/saambiz.sn'  },
              { icon:<Twitter size={16}/>,   label:'X',         href:'https://x.com/saambiz_sn'         },
            ].map((s,i) => (
              <a key={i} href={s.href} className="social-btn"
                 target="_blank" rel="noreferrer"
                 aria-label={`SaamBiz sur ${s.label}`} title={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(links).map(([cat, items]) => (
          <div key={cat} className="footer-col">
            <h4 className="footer-col-title">{cat}</h4>
            <ul className="footer-col-list">
              {items.map((item,i) => (
                <li key={i}>
                  <button className="footer-link" onClick={() => scrollTo(item.id)}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© {year} SaamBiz — Tous droits réservés</span>
          <div className="footer-badges">
            <div className="f-badge">Bientôt sur App Store</div>
            <div className="f-badge">Bientôt sur Google Play</div>
          </div>
        </div>
      </div>

      <style>{`
        .footer { background: #0D1B3D; color: rgba(255,255,255,0.65); }
        .footer-inner {
          max-width: 1280px; margin: 0 auto; padding: 44px 32px 28px;
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px;
        }
        .footer-brand { display: flex; flex-direction: column; gap: 12px; }
        .footer-logo-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; }
        .footer-logo-img { height: 46px; width: auto; object-fit: contain; }
        .footer-tagline { font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.50); max-width: 260px; }
        .footer-contact { display: flex; flex-direction: column; gap: 6px; font-style: normal; }
        .fc-row { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: rgba(255,255,255,0.45); }
        .fc-link { transition: color 0.2s ease; }
        .fc-link:hover { color: #F2B705; }
        .footer-social { display: flex; gap: 9px; margin-top: 2px; }
        .social-btn {
          width: 32px; height: 32px; border-radius: 9px;
          background: rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.55); transition: all 0.25s ease;
        }
        .social-btn:hover { background: #F2B705; color: #0D1B3D; transform: translateY(-2px); }
        .footer-col { display: flex; flex-direction: column; gap: 11px; }
        .footer-col-title { font-size: 11.5px; font-weight: 700; color: white; text-transform: uppercase; letter-spacing: 0.6px; }
        .footer-col-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .footer-link {
          font-size: 13px; color: rgba(255,255,255,0.48);
          background: none; border: none; cursor: pointer;
          text-decoration: none; padding: 0; text-align: left;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #F2B705; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.07); padding: 14px 32px; }
        .footer-bottom-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
          font-size: 13px; color: rgba(255,255,255,0.30);
          /* Le bouton « retour en haut » est fixe en bas à droite et se pose
             sur le dernier badge, dont il rogne la fin. On lui réserve sa
             place plutôt que de le laisser mordre sur le texte. */
          padding-right: 76px;
        }
        .footer-badges { display: flex; gap: 8px; }
        .f-badge { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); padding: 5px 12px; border-radius: 7px; font-size: 12px; font-weight: 600; }
        @media (max-width: 1000px) {
          .footer-inner { grid-template-columns: 1fr 1fr; gap: 30px; }
          .footer-brand { grid-column: span 2; }
        }

        /* Sur téléphone, les listes de liens restent sur DEUX colonnes.
           Les empiler donnait un pied de page interminable : trois titres et
           onze liens à faire défiler avant d'atteindre le bas, alors que ces
           listes sont courtes et tiennent largement côte à côte. */
        @media (max-width: 600px) {
          .footer-inner {
            grid-template-columns: 1fr 1fr;
            gap: 26px 18px;
            padding: 34px 18px 22px;
          }
          .footer-brand { grid-column: 1 / -1; gap: 14px; }
          /* La largeur imposée sur grand écran tenait le texte en colonne
             étroite ; sur téléphone elle laisse la moitié de la ligne vide. */
          .footer-tagline { max-width: none; }

          /* Le bouton « retour en haut » est fixe en bas à droite : sans
             cette réserve, il se pose sur le dernier badge et en rogne le
             texte. La marge lui laisse le vide du pied de page. */
          .footer-bottom { padding: 16px 18px 78px; }
          /* Le copyright et les badges se chevauchaient en fin de ligne :
             ils passent l'un sous l'autre, et les badges se partagent la
             largeur au lieu de déborder sur les petits écrans. */
          .footer-bottom-inner {
            flex-direction: column; align-items: stretch;
            gap: 14px; font-size: 12px;
            /* En colonne, la réserve est prise en bas (voir .footer-bottom) :
               garder une marge à droite décalerait tout le bloc. */
            padding-right: 0;
          }
          .footer-badges { gap: 8px; }
          /* Un peu plus serré : « Bientôt sur Google Play » débordait de sa
             pastille à 12 px sur un écran de 360. */
          .f-badge { flex: 1; text-align: center; font-size: 11.5px; padding: 6px 8px; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
