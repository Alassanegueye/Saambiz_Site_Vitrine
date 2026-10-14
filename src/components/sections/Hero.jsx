import { useState, useEffect, useRef } from 'react';
import { Play, Store, Megaphone, TrendingUp, BellRing } from 'lucide-react';
import hero1 from '../../assets/hero-1.webp';
import hero1Sm from '../../assets/hero-1-sm.webp';
import hero2 from '../../assets/hero-2.webp';
import hero2Sm from '../../assets/hero-2-sm.webp';

/* Badges de store — l'application n'est pas encore publiée, un clic renvoie
   vers la liste d'attente de la section « download ». */
const AppleGlyph = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);
/* Logo Play en quatre facettes. */
const PlayGlyph = () => (
  <svg width="24" height="26" viewBox="0 0 512 566" aria-hidden="true">
    <path fill="#34A853" d="M17 6 293 283 17 560c-10-10-17-25-17-43V49C0 31 7 16 17 6z" />
    <path fill="#4285F4" d="M17 6c11-11 28-8 45 2l286 163-55 112L17 6z" />
    <path fill="#FBBC04" d="M348 171l101 58c33 19 33 50 0 69l-101 58-55-73 55-112z" />
    <path fill="#EA4335" d="M17 560l276-277 55 73-286 163c-17 10-34 13-45-3z" />
  </svg>
);

/* Les quatre promesses affichées sous les boutons. */
const perks = [
  { icon: <Store size={22} strokeWidth={1.6} />,      label: <>Créez votre<br />boutique</> },
  { icon: <Megaphone size={22} strokeWidth={1.6} />,  label: <>Gérez vos<br />publicités</> },
  { icon: <TrendingUp size={22} strokeWidth={1.6} />, label: <>Suivez vos<br />ventes</> },
  { icon: <BellRing size={22} strokeWidth={1.6} />,   label: <>Notifiez vos<br />clients</> },
];

/* Deux compositions : chacune a son illustration (le décor occupe la moitié
   droite de l'image, la moitié gauche est laissée blanche pour le texte). */
const slides = [
  {
    src: hero1, srcSm: hero1Sm,
    alt: "Un téléphone SaamBiz relié à plusieurs boutiques, un entrepôt, des statistiques de ventes, des publicités et des colis en livraison.",
    title: <>Gérez votre business<br /><em>depuis votre téléphone</em></>,
    sub: <>SaamBiz vous aide à créer votre boutique, gérer vos ventes, vos publicités et fidéliser vos clients facilement.</>,
  },
  {
    src: hero2, srcSm: hero2Sm,
    alt: "L'application SaamBiz ouverte sur un catalogue de produits, entourée du suivi de livraison, des ventes en hausse, des publicités et des clients.",
    title: <>Votre business.<br />Partout. <em>Toujours.</em></>,
    sub: <>SaamBiz vous permet de créer votre boutique, gérer vos ventes, vos publicités et fidéliser vos clients <strong>depuis votre téléphone</strong>.</>,
  },
];

const DELAY = 7000;

const Hero = ({ scrollTo }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* Défilement automatique en boucle, comme dans l'ancienne version.
     Il ne s'arrête que si l'on navigue au clavier dans le hero (le temps
     de lire) ou si l'utilisateur a demandé moins d'animations. Un clic sur
     une puce relance simplement le compte à rebours depuis cette image. */
  useEffect(() => {
    if (paused || reduced) return;
    const id = setTimeout(() => setIndex(i => (i + 1) % slides.length), DELAY);
    return () => clearTimeout(id);
  }, [paused, reduced, index]);

  const go = (i) => setIndex((i + slides.length) % slides.length);

  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(index - 1); }
  };

  const touchX = useRef(null);
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(delta) > 45) go(index + (delta < 0 ? 1 : -1));
    touchX.current = null;
  };

  const active = slides[index];

  return (
    <section
      id="hero"
      className="hero-section"
      role="region"
      aria-roledescription="carrousel"
      aria-label="Présentation de SaamBiz"
      tabIndex={0}
      onKeyDown={onKey}
      onFocus={(e) => { if (e.target.matches(':focus-visible')) setPaused(true); }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ─── ILLUSTRATIONS ─── */}
      <div className="hero-media">
        {slides.map((s, i) => (
          <img
            key={i}
            src={s.src}
            srcSet={`${s.srcSm} 1344w, ${s.src} 2688w`}
            sizes="100vw"
            alt={i === index ? s.alt : ''}
            aria-hidden={i !== index}
            className={`hero-img ${i === index ? 'is-active' : ''}`}
            width="2688"
            height="1152"
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            draggable="false"
          />
        ))}
      </div>

      {/* ─── TEXTE (identique à l'ancienne version) ─── */}
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-copy-swap" key={index}>
            <h1 className="hero-title">{active.title}</h1>
            <p className="hero-sub">{active.sub}</p>
          </div>

          <div className="hero-actions">
            <button className="hero-btn-main" onClick={() => scrollTo('download')}>
              Commencer gratuitement
            </button>
            <button className="hero-btn-alt" onClick={() => scrollTo('features')}>
              <Play size={15} strokeWidth={2.4} fill="currentColor" aria-hidden="true" />
              Voir la démo
            </button>
          </div>

          <ul className="hero-perks">
            {perks.map((p, i) => (
              <li key={i} className="hero-perk">
                <span className="hero-perk-ico" aria-hidden="true">{p.icon}</span>
                <span className="hero-perk-label">{p.label}</span>
              </li>
            ))}
          </ul>

          <div className="hero-stores">
            <button type="button" className="hero-store" onClick={() => scrollTo('download')}>
              <AppleGlyph />
              <span><small>Télécharger dans</small><strong>l'App&nbsp;Store</strong></span>
            </button>
            <button type="button" className="hero-store" onClick={() => scrollTo('download')}>
              <PlayGlyph />
              <span><small>Disponible sur</small><strong>Google&nbsp;Play</strong></span>
            </button>
          </div>

          {/* Puces de navigation entre les deux compositions */}
          <div className="hero-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`hero-dot ${i === index ? 'is-active' : ''}`}
                onClick={() => go(i)}
                aria-label={`Afficher la composition ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          overflow: hidden;
          background: #FEFEFE;
          /* Tout l'écran à l'ouverture : le bandeau bleu du dessous
             n'apparaît qu'au défilement. */
          min-height: max(100vh, calc(var(--nav-h) + 520px));
          min-height: max(100svh, calc(var(--nav-h) + 520px));
          display: flex; align-items: center;
          padding: calc(var(--nav-h) + 20px) 40px 32px;
        }
        .hero-section:focus-visible { outline-offset: -6px; }

        /* ─── ILLUSTRATIONS ─── */
        .hero-media {
          /* sous la barre de navigation, pas derrière : le haut des
             illustrations (toits des boutiques) resterait caché */
          position: absolute; top: var(--nav-h); right: 0; bottom: 0; left: 0;
          z-index: 0;
        }
        /* Illustration affichée en entier, calée en bas à droite (la vague
           jaune de la première image rejoint ainsi le coin de l'écran). */
        .hero-img {
          position: absolute; right: 0; bottom: 0;
          width: 100%; height: 100%;
          object-fit: contain;
          object-position: right bottom;
          opacity: 0; transform: scale(1.02); transform-origin: right bottom;
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1);
          user-select: none;
        }
        .hero-img.is-active { opacity: 1; transform: scale(1); }

        /* ─── TEXTE ─── */
        .hero-inner {
          position: relative; z-index: 1;
          width: 100%; max-width: 1360px; margin: 0 auto;
        }
        .hero-copy { max-width: min(540px, 42vw); }

        /* Le bloc est remonté à chaque changement de composition : la clé
           React relance l'animation d'entrée. */
        .hero-copy-swap { animation: heroCopyIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes heroCopyIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(27px, 2.9vw, 42px);
          font-weight: 700; line-height: 1.2;
          letter-spacing: -0.9px; color: var(--navy);
          margin-bottom: 16px;
        }
        .hero-title em { font-style: normal; color: var(--gold); }
        .hero-sub {
          font-size: clamp(14px, 1.05vw, 15.5px);
          line-height: 1.7; color: var(--text-light);
          max-width: 34em; margin-bottom: 28px; text-wrap: pretty;
        }
        .hero-sub strong { color: var(--text-mid); font-weight: 700; }

        /* ─── BOUTONS ─── */
        .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 32px; }
        .hero-btn-main {
          background: var(--navy); color: var(--white);
          border: none; padding: 14px 24px; border-radius: 10px;
          font-size: 14px; font-weight: 600; letter-spacing: -0.1px;
          box-shadow: 0 8px 22px rgba(13,27,61,0.18);
          transition: background-color 0.2s ease;
        }
        .hero-btn-main:hover { background: var(--navy-mid); }
        .hero-btn-alt {
          display: inline-flex; align-items: center; gap: 11px;
          background: var(--white); color: var(--navy);
          border: 1.5px solid rgba(13,27,61,0.14);
          padding: 13px 22px; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          transition: border-color 0.2s ease;
        }
        .hero-btn-alt:hover { border-color: var(--navy); }
        .hero-btn-alt svg { color: var(--navy); }

        /* ─── PROMESSES ─── */
        .hero-perks {
          list-style: none; display: flex; align-items: flex-start;
          gap: 0; margin-bottom: 30px; max-width: 520px;
        }
        .hero-perk {
          flex: 1 1 0; min-width: 0;
          display: flex; flex-direction: column; align-items: center; gap: 9px;
          padding: 0 8px;
          border-left: 1px solid rgba(13,27,61,0.10);
        }
        .hero-perk:first-child { border-left: none; padding-left: 0; }
        .hero-perk-ico { color: var(--navy); line-height: 0; }
        /* Un accent or sur les deux promesses du milieu */
        .hero-perk:nth-child(2) .hero-perk-ico,
        .hero-perk:nth-child(3) .hero-perk-ico { color: var(--gold); }
        .hero-perk-label {
          font-size: 12.5px; font-weight: 500; line-height: 1.4;
          color: var(--text-mid); text-align: center;
        }

        /* ─── BADGES DE STORE ─── */
        .hero-stores { display: flex; flex-wrap: wrap; gap: 12px; }
        .hero-store {
          display: inline-flex; align-items: center; gap: 11px;
          background: var(--navy); color: var(--white);
          border: none; border-radius: 9px; padding: 8px 16px;
          box-shadow: 0 6px 18px rgba(13,27,61,0.20);
          transition: background-color 0.2s ease;
        }
        .hero-store:hover { background: var(--navy-mid); }
        .hero-store span { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.15; }
        .hero-store small { font-size: 9.5px; font-weight: 500; opacity: 0.8; }
        .hero-store strong { font-size: 14.5px; font-weight: 600; letter-spacing: -0.2px; }

        /* ─── PUCES ─── */
        .hero-dots { display: flex; gap: 7px; margin-top: 22px; }
        .hero-dot {
          width: 8px; height: 8px; border-radius: 50%;
          border: none; padding: 0; background: rgba(13,27,61,0.18);
          transition: width 0.3s ease, background 0.3s ease;
        }
        .hero-dot:hover { background: rgba(13,27,61,0.38); }
        .hero-dot.is-active { width: 22px; border-radius: 999px; background: var(--navy); }

        /* ─── RESPONSIVE ─── */
        /* Écrans moyens : l'image rétrécit un peu pour ne pas passer sous
           le texte. */
        @media (max-width: 1280px) {
          .hero-img { width: 92%; }
        }
        /* Sous 1100 px, le blanc de gauche ne suffit plus au texte : on
           empile, le texte d'abord, l'illustration en dessous. */
        @media (max-width: 1100px) {
          .hero-section {
            flex-direction: column; align-items: stretch; min-height: 0;
            padding: calc(var(--nav-h) + 28px) 24px 0;
          }
          .hero-copy { max-width: 620px; }
          /* Le cadre reprend exactement la partie illustrée des images
             (les 60 % de droite) : tout le décor est visible et centré,
             sans le blanc de gauche prévu pour le texte sur ordinateur. */
          .hero-media {
            position: relative; inset: auto; top: auto;
            order: 2;
            width: 100%; max-width: 640px;
            margin: 28px auto 0;
            aspect-ratio: 1613 / 1152;
          }
          .hero-img { width: 100%; height: 100%; object-fit: cover; object-position: right center; transform-origin: center; }
        }
        @media (max-width: 900px) {
          .hero-copy { text-align: center; margin: 0 auto; }
          .hero-sub { margin-left: auto; margin-right: auto; }
          .hero-actions, .hero-stores, .hero-dots { justify-content: center; }
          .hero-perks { max-width: 460px; margin-left: auto; margin-right: auto; }
        }
        @media (max-width: 560px) {
          .hero-section { padding: calc(var(--nav-h) + 18px) 14px 0; }
          .hero-media { margin-top: 22px; }
          .hero-title { letter-spacing: -0.4px; }
          .hero-actions { gap: 12px; margin-bottom: 30px; }
          .hero-btn-main, .hero-btn-alt { width: 100%; justify-content: center; }
          .hero-perks { gap: 0; margin-bottom: 28px; }
          .hero-perk { padding: 0 4px; gap: 8px; }
          .hero-perk-label { font-size: 11.5px; }
          .hero-store { flex: 1 1 auto; justify-content: center; padding: 9px 14px; }
          .hero-store strong { font-size: 15px; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
