import { useState, useEffect, useRef } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import LogoAnime from '../marque/LogoAnime';
import RideauMarque from '../marque/RideauMarque';
import useRideauMarque from '../marque/useRideauMarque';
import { RESEAUX } from './reseaux';

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

const LIENS = [
  { label: 'Fonctionnalités', id: 'features' },
  { label: 'Boutique web',    id: 'channels' },
  { label: 'Paiements',       id: 'payment'  },
  { label: 'Tarifs',          id: 'pricing'  },
  { label: 'FAQ',             id: 'faq'      },
];

/* Réseaux sociaux en pastilles rondes bleu marine. */
function Reseaux({ tabIndex }) {
  return (
    <ul className="nav-reseaux">
      {RESEAUX.map(({ id, label, href, Icone }) => (
        <li key={id}>
          <a
            className="nav-rond"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`SaamBiz sur ${label}`}
            title={label}
            tabIndex={tabIndex}
          >
            <Icone />
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Barre de navigation — capsule flottante au verre dépoli :
 *  - à gauche, la tuile bleu marine du logo, qui déborde de la capsule ;
 *  - au centre, les sections de la page ;
 *  - à droite, les réseaux sociaux puis l'icône de connexion à l'espace
 *    vendeur, tout au bord : c'est là que les vendeurs qui reviennent la
 *    cherchent.
 * Sous 960 px, les sections passent dans un panneau ; l'icône de connexion
 * reste dans la capsule, à côté du bouton de menu.
 */
const Navbar = ({ scrolled, hidden, scrollTo, active }) => {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef(null);
  const { partir, depart } = useRideauMarque();

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
      <nav className="nav-capsule" aria-label="Navigation principale">
        {/* TUILE DU LOGO */}
        <button className="nav-tuile la-survol" onClick={() => go('hero')} aria-label="SaamBiz — retour en haut">
          <LogoAnime taille={46} variante="couleur" mode="entree" />
          <span className="nav-tuile-nom" aria-hidden="true">Saam<span>Biz</span></span>
        </button>

        {/* SECTIONS */}
        <ul className="nav-links">
          {LIENS.map(l => (
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

        {/* RÉSEAUX + CONNEXION */}
        <div className="nav-actions">
          <Reseaux />
          <span className="nav-sep" aria-hidden="true" />
        </div>
        <a
          className="nav-rond nav-connexion"
          href={CONNEXION_VENDEUR}
          onClick={partir}
          aria-label="Se connecter à l'espace vendeur"
        >
          <LogIn size={19} strokeWidth={2.4} aria-hidden="true" />
          <span className="nav-bulle" aria-hidden="true">Se connecter</span>
        </a>

        {/* MENU (petits écrans) */}
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

      {/* PANNEAU MOBILE */}
      <div id="nav-mobile" className={`nav-mobile ${open ? 'open' : ''}`}>
        {LIENS.map(l => (
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
        <div className="mobile-pied">
          <span>Suivez SaamBiz</span>
          <Reseaux tabIndex={open ? 0 : -1} />
        </div>
      </div>

      {/* Voile derrière le menu mobile — un clic hors du panneau le referme. */}
      <div
        className={`nav-scrim ${open ? 'show' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {depart && <RideauMarque x={depart.x} y={depart.y} />}

      <style>{`
        /* ── Capsule ── */
        .nav-capsule {
          /* au-dessus du voile du menu mobile, sinon le bouton de fermeture
             n'est plus cliquable une fois le menu ouvert */
          position: relative; z-index: 2;
          max-width: 1240px; height: 64px; margin: 0 auto;
          display: flex; align-items: center; gap: 16px;
          padding: 0 10px 0 0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          -webkit-backdrop-filter: blur(18px) saturate(170%);
          backdrop-filter: blur(18px) saturate(170%);
          /* Filet bleu marine très léger : sur le hero blanc, la capsule
             doit se détacher autrement que par son ombre. */
          border: 1px solid rgba(13, 27, 61, 0.08);
          box-shadow:
            0 14px 34px -14px rgba(13, 27, 61, 0.28),
            0 2px 6px rgba(13, 27, 61, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        /* Une fois la page défilée, le verre s'opacifie : le texte reste lisible
           au-dessus des sections bleu marine. */
        .navbar.scrolled .nav-capsule {
          background: rgba(255, 255, 255, 0.93);
          box-shadow: 0 16px 36px -14px rgba(13, 27, 61, 0.32), 0 2px 6px rgba(13, 27, 61, 0.06);
        }

        /* ── Tuile du logo : carré blanc, logo en couleurs, qui déborde de
              la capsule en haut et en bas ── */
        .nav-tuile {
          position: relative; flex-shrink: 0;
          margin-left: 22px;
          width: 102px; height: 90px; padding: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px;
          background: var(--white);
          border: 1px solid rgba(13, 27, 61, 0.08);
          border-radius: 18px;
          box-shadow: 0 14px 30px -10px rgba(13, 27, 61, 0.38), 0 2px 6px rgba(13, 27, 61, 0.06);
          cursor: pointer;
          transition: scale 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), translate 0.3s ease, rotate 0.3s ease;
        }
        .nav-tuile:hover { translate: 0 -2px; rotate: -2deg; }
        .navbar.scrolled .nav-tuile { scale: 0.9; }
        .nav-tuile-nom {
          font-family: var(--font-display);
          font-size: 14px; font-weight: 700; line-height: 1; letter-spacing: -0.2px;
          color: #021E54;
        }
        .nav-tuile-nom span { color: var(--gold); }
        .navbar .nav-tuile:focus-visible { outline: 3px solid var(--gold); outline-offset: 3px; }

        /* ── Sections ── */
        .nav-links {
          display: flex; list-style: none; gap: 2px; flex: 1;
          justify-content: center;
        }
        .nav-link {
          position: relative;
          background: none; border: none; padding: 10px 15px;
          border-radius: 999px;
          font-size: 14.5px; font-weight: 600; letter-spacing: -0.1px;
          color: #1B2D57; cursor: pointer;
          /* Jamais de retour à la ligne : la capsule se resserre (voir les
             paliers plus bas), les libellés restent sur une ligne. */
          white-space: nowrap;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .nav-link:hover { color: var(--navy); background: rgba(13, 27, 61, 0.06); }
        /* Section en cours de lecture : un trait or sous le libellé */
        .nav-link.is-active { color: var(--navy); }
        .nav-link.is-active::after {
          content: ''; position: absolute; left: 50%; bottom: 3px;
          width: 18px; height: 3px; margin-left: -9px; border-radius: 3px;
          background: var(--gold);
        }

        /* ── Réseaux et connexion ── */
        .nav-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .nav-reseaux { display: flex; align-items: center; gap: 8px; list-style: none; }
        .nav-rond {
          width: 38px; height: 38px; border-radius: 50%;
          display: inline-grid; place-items: center; flex-shrink: 0;
          background: var(--navy); color: var(--white);
          transition: background 0.25s ease, color 0.25s ease, translate 0.25s ease, box-shadow 0.25s ease;
        }
        .nav-rond svg { width: 17px; height: 17px; }
        .nav-rond:hover { background: var(--navy-mid); translate: 0 -2px; box-shadow: 0 8px 16px -8px rgba(13, 27, 61, 0.6); }
        .nav-sep { width: 1px; height: 26px; background: rgba(13, 27, 61, 0.14); }

        /* Connexion : la seule pastille or — c'est l'entrée des vendeurs. */
        .nav-connexion {
          position: relative;
          width: 44px; height: 44px;
          background: var(--gold); color: var(--navy);
          box-shadow: 0 8px 18px -8px rgba(176, 133, 11, 0.9);
        }
        .nav-connexion svg { width: 19px; height: 19px; }
        .nav-connexion:hover { background: var(--navy); color: var(--gold); }
        .nav-bulle {
          position: absolute; top: calc(100% + 12px); right: -2px;
          padding: 7px 11px; border-radius: 9px;
          background: var(--navy); color: var(--white);
          font-size: 12.5px; font-weight: 600; white-space: nowrap;
          opacity: 0; translate: 0 -4px; pointer-events: none;
          transition: opacity 0.2s ease, translate 0.2s ease;
        }
        .nav-bulle::before {
          content: ''; position: absolute; top: -4px; right: 18px;
          width: 9px; height: 9px; background: inherit; rotate: 45deg; border-radius: 2px;
        }
        .nav-connexion:hover .nav-bulle,
        .nav-connexion:focus-visible .nav-bulle { opacity: 1; translate: 0 0; }

        .nav-burger {
          display: none; flex-shrink: 0;
          width: 42px; height: 42px; border-radius: 50%;
          place-items: center;
          background: rgba(13, 27, 61, 0.06); border: none;
          color: var(--navy);
        }
        .nav-burger:hover { background: rgba(13, 27, 61, 0.1); }

        /* ── Panneau mobile ── */
        .nav-mobile {
          position: relative; z-index: 2;
          max-width: 1240px; margin: 10px auto 0;
          display: flex; flex-direction: column; gap: 2px;
          padding: 0 12px; max-height: 0; overflow: hidden;
          opacity: 0; visibility: hidden;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 22px 44px -16px rgba(13, 27, 61, 0.35);
          transition: max-height 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), padding 0.4s cubic-bezier(0.2, 0.8, 0.2, 1),
                      opacity 0.25s ease, visibility 0.4s;
        }
        .nav-mobile.open { max-height: 560px; padding: 12px; opacity: 1; visibility: visible; }
        .mobile-link {
          background: none; border: none; padding: 14px 16px;
          border-radius: 14px; font-size: 15.5px; font-weight: 600;
          color: #1B2D57; cursor: pointer; text-align: left;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .mobile-link:hover { color: var(--navy); background: var(--navy-light); }
        .mobile-link.is-active {
          color: var(--navy); background: var(--navy-light);
          box-shadow: inset 3px 0 0 var(--gold);
        }
        .mobile-pied {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          margin-top: 8px; padding: 14px 6px 4px 16px;
          border-top: 1px solid rgba(13, 27, 61, 0.08);
          font-size: 13px; font-weight: 600; color: var(--text-light);
        }

        .nav-scrim {
          position: fixed; inset: 0; z-index: 1;
          background: rgba(13, 27, 61, 0.35);
          backdrop-filter: blur(2px);
          opacity: 0; visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s;
        }
        .nav-scrim.show { opacity: 1; visibility: visible; pointer-events: auto; }

        @media (min-width: 961px) {
          .nav-scrim, .nav-mobile { display: none; }
        }
        /* Paliers : on resserre plutôt que de masquer un lien. */
        @media (max-width: 1240px) {
          .nav-capsule { gap: 10px; }
          .nav-link { padding: 10px 11px; font-size: 14px; }
        }
        @media (max-width: 1100px) {
          .nav-tuile { margin-left: 16px; width: 94px; height: 84px; }
          .nav-link { padding: 10px 8px; font-size: 13.5px; }
          .nav-reseaux { gap: 6px; }
          .nav-rond { width: 34px; height: 34px; }
          .nav-rond svg { width: 15px; height: 15px; }
          .nav-connexion { width: 42px; height: 42px; }
          .nav-actions { gap: 9px; }
        }
        @media (max-width: 960px) {
          .nav-links, .nav-actions { display: none; }
          .nav-capsule { height: 58px; gap: 8px; padding-right: 8px; }
          .nav-connexion { margin-left: auto; width: 42px; height: 42px; }
          .nav-bulle { display: none; }
          .nav-burger { display: inline-grid; }
          .nav-tuile { margin-left: 14px; width: 80px; height: 72px; gap: 5px; border-radius: 16px; }
          .nav-tuile .logo-anime { width: 36px; height: auto; }
          .nav-tuile-nom { font-size: 12px; }
        }
        @media (max-width: 380px) {
          .nav-tuile { margin-left: 10px; width: 74px; }
          .mobile-pied > span { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
