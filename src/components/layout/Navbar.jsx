import { useState, useEffect, useRef } from 'react';
import { Menu, X, Download, LogIn } from 'lucide-react';
import logo from '../../assets/brand/logo-navy.png';

/* Espace vendeur web : les boutiques se gèrent aussi depuis un ordinateur.
   C'est une application à part (dossier Dashboard_Vendeur), distincte de
   l'administration. L'adresse se règle via VITE_DASHBOARD_URL. */
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'https://app.saambiz.com';

/* En développement local, le tableau de bord n'est pas déployé : on vise
   l'instance Vite voisine, en mode démo, pour pouvoir travailler l'interface
   vendeur sans backend. Ce raccourci ne s'applique jamais en production. */
function lienConnexionVendeur() {
  const enLocal =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname);

  if (enLocal && !import.meta.env.VITE_DASHBOARD_URL) {
    return 'http://localhost:5190/connexion';
  }
  return `${DASHBOARD_URL.replace(/\/$/, '')}/connexion`;
}

const CONNEXION_VENDEUR = lienConnexionVendeur();

const Navbar = ({ scrolled, hidden, scrollTo, active }) => {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef(null);

  const links = [
    { label: 'Fonctionnalités', id: 'features' },
    { label: 'Vendeurs',        id: 'vendor'   },
    { label: 'Boutique web',    id: 'channels' },
    { label: 'Clients',         id: 'client'   },
    { label: 'Tarifs',          id: 'pricing'  },
    { label: 'FAQ',             id: 'faq'      },
  ];

  const go = (id) => { scrollTo(id); setOpen(false); };

  /* Menu mobile : fermeture au clavier (Échap) et blocage du défilement
     de la page derrière le panneau ouvert. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''} ${hidden && !open ? 'nav-hidden' : ''}`}>
      <nav className="nav-inner" aria-label="Navigation principale">
        {/* LOGO */}
        <button className="nav-logo" onClick={() => go('hero')} aria-label="SaamBiz — retour en haut">
          <img src={logo} alt="SaamBiz" className="nav-logo-img" />
        </button>

        {/* LINKS DESKTOP */}
        <ul className="nav-links">
          {links.map(l => (
            <li key={l.id}>
              <button
                className={`nav-link ${active === l.id ? 'is-active' : ''}`}
                onClick={() => go(l.id)}
                aria-current={active === l.id ? 'true' : undefined}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        {/* ACTIONS DESKTOP */}
        <div className="nav-actions">
          <button className="nav-cta" onClick={() => go('download')}>
            <Download size={15} strokeWidth={2.5} />
            Télécharger l'app
          </button>
          {/* En dernier, tout à droite : c'est le point d'entrée des vendeurs
              qui reviennent, ils le cherchent au bord de l'écran. */}
          <a className="nav-login" href={CONNEXION_VENDEUR}>
            <LogIn size={15} strokeWidth={2.3} aria-hidden="true" />
            Se connecter
          </a>
        </div>

        {/* BURGER */}
        <button
          ref={burgerRef}
          className="nav-burger"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          aria-controls="nav-mobile"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div id="nav-mobile" className={`nav-mobile ${open ? 'open' : ''}`}>
        {links.map(l => (
          <button
            key={l.id}
            className={`mobile-link ${active === l.id ? 'is-active' : ''}`}
            onClick={() => go(l.id)}
            tabIndex={open ? 0 : -1}
            aria-current={active === l.id ? 'true' : undefined}
          >
            {l.label}
          </button>
        ))}
        <a className="mobile-login" href={CONNEXION_VENDEUR} tabIndex={open ? 0 : -1}>
          <LogIn size={16} strokeWidth={2.3} aria-hidden="true" />
          Se connecter
          <small>Gérez votre boutique depuis un ordinateur</small>
        </a>
        <button className="mobile-cta" onClick={() => go('download')} tabIndex={open ? 0 : -1}>
          <Download size={16} strokeWidth={2.5} />
          Télécharger l'app
        </button>
      </div>

      {/* Voile derrière le menu mobile — un clic hors du panneau le referme. */}
      <div
        className={`nav-scrim ${open ? 'show' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <style>{`
        .nav-inner {
          /* au-dessus du voile du menu mobile, sinon le bouton de fermeture
             n'est plus cliquable une fois le menu ouvert */
          position: relative; z-index: 2;
          max-width: 1360px; margin: 0 auto;
          padding: 0 40px; display: flex; align-items: center; gap: 20px;
        }
        .nav-logo {
          background: none; border: none; cursor: pointer;
          flex-shrink: 0; padding: 0; display: flex; align-items: center;
        }
        .nav-logo-img {
          height: 42px; width: auto; object-fit: contain;
          transition: height 0.3s ease;
        }
        /* La largeur est figée sur celle du logo au repos : quand il rétrécit
           au défilement, la barre ne se réorganise pas autour de lui. */
        .nav-logo { width: 174px; justify-content: flex-start; }
        .navbar.scrolled .nav-logo-img { height: 36px; }
        .nav-links {
          display: flex; list-style: none; gap: 2px; flex: 1;
          justify-content: center;
        }
        .nav-link {
          position: relative;
          background: none; border: none; padding: 8px 14px 10px;
          border-radius: 9px; font-size: 14px; font-weight: 600;
          color: #2C3E63; cursor: pointer;
          /* Jamais de retour à la ligne : la barre se resserre (voir les
             paliers plus bas), les libellés restent sur une ligne. */
          white-space: nowrap;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .nav-link:hover { color: #0D1B3D; background: #E8EDF7; }
        /* Soulignement or sur la section en cours de lecture */
        .nav-link.is-active { color: #0D1B3D; }
        .nav-link.is-active::after {
          content: ''; position: absolute; left: 14px; right: 14px; bottom: 2px;
          height: 2.5px; border-radius: 2px; background: #F2B705;
        }
        .nav-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .nav-login {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 16px; border-radius: 8px;
          border: 1.5px solid rgba(13,27,61,0.14);
          /* Translucide comme la barre : un aplat blanc dessinait un rectangle
             visible dès que le fond laissait passer la page. */
          background: #FFFFFF;
          color: #0D1B3D;
          font-size: 14px; font-weight: 600; white-space: nowrap;
          transition: border-color 0.2s ease, background 0.2s ease, transform 0.25s ease;
        }
        .nav-login:hover { border-color: #0D1B3D; }
        .nav-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: #0D1B3D;
          color: white; border: none; padding: 11px 20px;
          border-radius: 8px; font-size: 14px; font-weight: 600;
          cursor: pointer; flex-shrink: 0; white-space: nowrap;
          box-shadow: none;
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }
        .nav-cta:hover { background: #1E3A78; }
        .nav-burger {
          display: none; background: none; border: none;
          color: #2C3E63; padding: 8px; border-radius: 10px; margin-left: auto;
        }
        .nav-burger:hover { background: #E8EDF7; color: #0D1B3D; }

        .nav-mobile {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; gap: 4px;
          padding: 0 20px; max-height: 0; overflow: hidden;
          border-top: 1px solid transparent;
          background: rgba(255,255,255,0.99);
          transition: max-height 0.35s ease, padding 0.35s ease, border-color 0.2s ease;
        }
        .nav-mobile.open {
          max-height: 620px; padding: 12px 20px 22px;
          border-top-color: rgba(13,27,61,0.08);
        }
        .mobile-link {
          background: none; border: none; padding: 13px 16px;
          border-radius: 10px; font-size: 15px; font-weight: 600;
          color: #2C3E63; cursor: pointer; text-align: left;
          transition: all 0.2s;
        }
        .mobile-link:hover { color: #0D1B3D; background: #E8EDF7; }
        .mobile-link.is-active {
          color: #0D1B3D; background: #E8EDF7;
          box-shadow: inset 3px 0 0 #F2B705;
        }
        .mobile-login {
          margin-top: 10px;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: 12px 20px; border-radius: 12px;
          border: 1.5px solid rgba(13,27,61,0.14);
          color: #0D1B3D; font-size: 15px; font-weight: 600;
        }
        .mobile-login svg { margin-bottom: 2px; }
        .mobile-login small { font-size: 11.5px; font-weight: 500; color: #5B6C8A; }
        .mobile-cta {
          margin-top: 8px;
          display: inline-flex; align-items: center; justify-content: center; gap: 9px;
          background: #0D1B3D;
          color: white; border: none; padding: 14px 22px;
          border-radius: 12px; font-size: 15px; font-weight: 700;
          cursor: pointer; box-shadow: none;
        }

        .nav-scrim {
          position: fixed; inset: 0; z-index: 1;
          background: rgba(13,27,61,0.35);
          backdrop-filter: blur(2px);
          opacity: 0; visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s;
        }
        .nav-scrim.show { opacity: 1; visibility: visible; }

        @media (min-width: 961px) {
          .nav-scrim { display: none; }
        }
        /* Avec sept entrées, la barre déborderait entre 960 et 1200 px :
           on resserre plutôt que de masquer un lien. */
        @media (max-width: 1280px) {
          .nav-inner { padding: 0 24px; gap: 12px; }
          .nav-logo { width: 150px; }
          .nav-link { padding: 8px 9px 10px; font-size: 13.5px; }
          .nav-link.is-active::after { left: 9px; right: 9px; }
          .nav-login, .nav-cta { padding-left: 13px; padding-right: 13px; font-size: 13.5px; }
        }
        /* Dernière tranche avant le menu burger : c'est là que les sept
           entrées et les deux boutons tiennent le plus juste. */
        @media (max-width: 1120px) {
          .nav-inner { padding: 0 16px; gap: 8px; }
          .nav-logo { width: 132px; }
          .nav-logo-img { height: 36px; }
          .navbar.scrolled .nav-logo-img { height: 32px; }
          .nav-link { padding: 8px 6px 10px; font-size: 13px; }
          .nav-link.is-active::after { left: 6px; right: 6px; }
          .nav-login, .nav-cta { padding-left: 11px; padding-right: 11px; gap: 6px; font-size: 13px; }
        }
        @media (max-width: 960px) {
          .nav-links, .nav-actions { display: none; }
          .nav-burger { display: flex; }
        }
        @media (max-width: 480px) {
          .nav-inner { padding: 0 16px; }
          .nav-logo-img { height: 34px; }
          .navbar.scrolled .nav-logo-img { height: 30px; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
