import { useState, useEffect, useRef } from 'react';
import { Play, Store, Megaphone, TrendingUp, BellRing } from 'lucide-react';
import visual1 from '../../assets/hero-visual-1.webp';
import visual2 from '../../assets/hero-visual-2.webp';
import edge1 from '../../assets/hero-edge-1.png';
import edge2 from '../../assets/hero-edge-2.png';

/* Badges de store — l'application n'est pas encore publiée, un clic renvoie
   vers la liste d'attente de la section « download ». */
const AppleGlyph = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);
/* Logo Play en quatre facettes, comme sur la maquette. */
const PlayGlyph = () => (
  <svg width="24" height="26" viewBox="0 0 512 566" aria-hidden="true">
    <path fill="#34A853" d="M17 6 293 283 17 560c-10-10-17-25-17-43V49C0 31 7 16 17 6z" />
    <path fill="#4285F4" d="M17 6c11-11 28-8 45 2l286 163-55 112L17 6z" />
    <path fill="#FBBC04" d="M348 171l101 58c33 19 33 50 0 69l-101 58-55-73 55-112z" />
    <path fill="#EA4335" d="M17 560l276-277 55 73-286 163c-17 10-34 13-45-3z" />
  </svg>
);

/* Les quatre promesses affichées sous le sous-titre, comme sur la maquette. */
const perks = [
  { icon: <Store size={22} strokeWidth={1.6} />,       label: <>Créez votre<br />boutique</> },
  { icon: <Megaphone size={22} strokeWidth={1.6} />,   label: <>Gérez vos<br />publicités</> },
  { icon: <TrendingUp size={22} strokeWidth={1.6} />,  label: <>Suivez vos<br />ventes</> },
  { icon: <BellRing size={22} strokeWidth={1.6} />,    label: <>Notifiez vos<br />clients</> },
];

/* Les deux compositions de marque. Chaque diapositive porte son texte, son
   visuel détouré et la vague jaune qui prolonge celle du visuel vers la
   gauche (tracé relevé sur l'image source, d'où les coordonnées exactes). */
/* Le jaune de la vague est le même dans les deux visuels (les images ont été
   recalées sur cette teinte) : aucun écart de couleur au changement. */
const WAVE = '#FEAA05';

const slides = [
  {
    src: visual1,
    edge: edge1,
    w: 958, h: 928,
    bg: '#FCFCFC',
    alt: "Un vendeur consulte son tableau de bord SaamBiz : ventes du mois, commandes, promotions et produits récents.",
    title: <>Gérez votre business<br /><em>depuis votre téléphone</em></>,
    sub: <>SaamBiz vous aide à créer votre boutique, gérer vos ventes, vos publicités et fidéliser vos clients facilement.</>,
    wave: {
      color: WAVE,
      viewBox: '0 0 578 928',
      ratio: '578 / 928',
      flat: 19.83,
      d: 'M0,744 Q0,744 10,744 Q20,744 30,745 Q40,746 50,748 Q60,750 70,753 Q80,756 90,760 Q100,764 110,768 Q120,773 130,777 Q140,782 150,787 Q160,793 170,798 Q180,804 190,809 Q200,815 210,820 Q220,826 230,831 Q240,837 250,841 Q260,846 270,850 Q280,854 290,857 Q300,861 310,863 Q320,866 330,867 Q340,869 350,870 Q360,871 370,871 Q380,871 390,870 Q400,870 410,868 Q420,867 430,864 Q440,862 450,859 Q460,857 470,854 Q480,851 490,848 Q500,845 510,841 Q520,838 530,834 Q540,830 550,826 Q560,823 569,819 L578,816 L578,928 L0,928 Z',
    },
  },
  {
    src: visual2,
    edge: edge2,
    w: 897, h: 869,
    bg: '#FAFAFA',
    alt: "Une vendeuse gère sa boutique SaamBiz depuis son téléphone : promotion en cours, notifications de commandes et chiffre du jour.",
    title: <>Votre business.<br />Partout. <em>Toujours.</em></>,
    sub: <>SaamBiz vous permet de créer votre boutique, gérer vos ventes, vos publicités et fidéliser vos clients <strong>depuis votre téléphone</strong>.</>,
    wave: {
      color: WAVE,
      viewBox: '0 0 820 869',
      ratio: '820 / 869',
      flat: 22.67,
      d: 'M0,672 Q0,672 10,675 Q20,678 30,682 Q40,686 50,691 Q60,696 70,701 Q80,706 90,712 Q100,718 110,723 Q120,729 130,735 Q140,741 150,746 Q160,752 170,757 Q180,763 190,768 Q200,774 210,779 Q220,784 230,788 Q240,792 250,796 Q260,800 270,803 Q280,806 290,808 Q300,811 310,813 Q320,815 330,816 Q340,817 350,817 Q360,818 370,818 Q380,818 390,817 Q400,817 410,815 Q420,814 430,812 Q440,811 450,808 Q460,806 470,803 Q480,801 490,798 Q500,795 510,792 Q520,789 530,785 Q540,782 550,779 Q560,776 570,772 Q580,769 590,765 Q600,762 610,759 Q620,756 630,752 Q640,749 650,746 Q660,743 670,740 Q680,738 690,735 Q700,733 710,731 Q720,729 730,727 Q740,726 750,724 Q760,723 770,722 Q780,722 790,722 Q800,722 810,722 L820,723 L820,869 L0,869 Z',
    },
  },
];

const DELAY = 7000;

const Hero = ({ scrollTo }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // On suit le réglage système en direct : s'il change, le défilement
  // automatique s'arrête (ou repart) sans recharger la page.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* Défilement automatique — suspendu au survol, au focus clavier
     et si l'utilisateur a demandé moins d'animations. */
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

  /* Balayage tactile — sur mobile, on change de composition au doigt. */
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
    <section id="hero" className="hero-section" style={{ background: active.bg }}>
      {/* Trame de points blancs posée sur la vague, comme sur la maquette */}
      <span className="hero-grid-dots bl" aria-hidden="true" />

      <div
        className="hero-inner"
        role="region"
        aria-roledescription="carrousel"
        aria-label="Présentation de SaamBiz"
        tabIndex={0}
        onKeyDown={onKey}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* ─── COLONNE TEXTE ─── */}
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

        {/* ─── COLONNE VISUEL ─── */}
        <div className="hero-visual">
          <div className="hero-stage">
            {/* La vague est prolongée des deux côtés du visuel : à gauche par
                son tracé exact relevé sur l'image, à droite par une bande d'un
                pixel prise sur son bord. Le jaune court ainsi d'un bord à
                l'autre de l'écran, sans raccord ni écart de teinte. */}
            <div className="hero-wave" aria-hidden="true">
              <span className="hero-wave-flat" style={{ height: `${active.wave.flat}%`, background: active.wave.color }} />
              <svg
                className="hero-wave-curve"
                viewBox={active.wave.viewBox}
                style={{ aspectRatio: active.wave.ratio }}
                role="presentation"
              >
                <path d={active.wave.d} fill={active.wave.color} />
              </svg>
            </div>
            <span className="hero-edge" aria-hidden="true"
                  style={{ backgroundImage: `url(${active.edge})` }} />

            {slides.map((s, i) => (
              <img
                key={i}
                src={s.src}
                alt={i === index ? s.alt : ''}
                className={`hero-shot ${i === index ? 'is-active' : ''}`}
                width={s.w}
                height={s.h}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
                aria-hidden={i !== index}
                draggable="false"
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          overflow: hidden;
          /* Le fond reprend celui de la composition affichée : aucun
             raccord visible entre l'image et la section. */
          background: #FCFCFC;
          transition: background-color 0.8s ease;
          padding: calc(var(--nav-h) + 30px) 40px 0;
        }
        .hero-inner {
          position: relative; z-index: 1;
          max-width: 1360px; margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.06fr);
          align-items: center;
          gap: 32px;
        }
        .hero-inner:focus-visible { outline-offset: 10px; }

        /* ─── TEXTE ─── */
        /* La vague jaune monte jusqu'à ~20 % de la hauteur du visuel :
           on réserve la place en bas pour que les badges restent au-dessus. */
        .hero-copy { padding-bottom: 150px; }
        /* Le bloc est remonté à chaque changement de composition : la clé
           React relance l'animation d'entrée. */
        .hero-copy-swap { animation: heroCopyIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes heroCopyIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(27px, 2.9vw, 40px);
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
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease;
        }
        .hero-btn-main:hover { transform: translateY(-3px); box-shadow: 0 16px 38px rgba(13,27,61,0.32); }
        .hero-btn-alt {
          display: inline-flex; align-items: center; gap: 11px;
          background: var(--white); color: var(--navy);
          border: 1.5px solid rgba(13,27,61,0.14);
          padding: 13px 22px; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .hero-btn-alt:hover {
          border-color: var(--navy); transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(13,27,61,0.12);
        }
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
        /* Un accent or sur les deux promesses du milieu, comme sur la maquette */
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
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease;
          box-shadow: 0 6px 18px rgba(13,27,61,0.20);
        }
        .hero-store:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(13,27,61,0.30); }
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

        /* ─── VISUEL ─── */
        /* Le cadre garde le rapport exact des deux compositions (1,032) :
           aucune hauteur ne bouge d'une diapositive à l'autre. */
        .hero-visual { position: relative; align-self: end; }
        .hero-stage {
          position: relative;
          width: 108%; margin-right: -8%; margin-left: auto;
          aspect-ratio: 958 / 928;
        }
        .hero-shot {
          position: absolute; inset: 0; z-index: 1;
          width: 100%; height: 100%; object-fit: contain; object-position: bottom right;
          opacity: 0; transform: scale(1.02);
          transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1);
          user-select: none;
        }
        .hero-shot.is-active { opacity: 1; transform: scale(1); }

        /* Prolongements de la vague, posés sous l'image. */
        .hero-edge {
          /* 1 px de recouvrement sous l'image : sans lui, l'arrondi
             sous-pixel laisse un filet clair au raccord. */
          position: absolute; left: calc(100% - 1px); top: 0; z-index: 0;
          height: 100%; width: 100vw;
          background-repeat: repeat-x;
          background-size: 2px 100%;
          background-position: left top;
          pointer-events: none;
        }
        .hero-wave {
          position: absolute; right: calc(100% - 1px); bottom: 0; z-index: 0;
          height: 100%; width: 100vw;
          display: flex; align-items: flex-end; justify-content: flex-end;
          pointer-events: none;
        }
        .hero-wave-flat { flex: 1 1 auto; min-width: 0; }
        .hero-wave-curve { flex: 0 0 auto; height: 100%; width: auto; display: block; }

        /* ─── TRAMES DE POINTS ─── */
        .hero-grid-dots {
          position: absolute; pointer-events: none;
          background-image: radial-gradient(currentColor 2.2px, transparent 2.3px);
          background-size: 19px 19px;
        }
        .hero-grid-dots.bl {
          z-index: 2;
          left: 40px; bottom: 24px;
          width: 154px; height: 59px;
          color: rgba(255,255,255,0.9);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1080px) {
          .hero-inner { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px; }
          .hero-title { letter-spacing: -0.8px; }
          .hero-perk-label { font-size: 12.5px; }
        }
        @media (max-width: 900px) {
          .hero-section { padding: calc(var(--nav-h) + 26px) 20px 0; }
          .hero-inner { grid-template-columns: 1fr; gap: 8px; text-align: center; }
          .hero-copy { padding-bottom: 8px; order: 1; }
          .hero-visual { order: 2; }
          .hero-sub { margin-left: auto; margin-right: auto; }
          .hero-actions, .hero-stores, .hero-dots { justify-content: center; }
          .hero-perks { max-width: 460px; margin-left: auto; margin-right: auto; }
          .hero-stage { width: 100%; margin-right: 0; }
          /* Sur une colonne, l'image occupe toute la largeur : la vague de
             gauche sort de l'écran, celle de l'image suffit. */
          .hero-wave, .hero-edge { display: none; }
          .hero-grid-dots.bl { display: none; }
        }
        @media (max-width: 560px) {
          .hero-section { padding: calc(var(--nav-h) + 18px) 14px 0; }
          .hero-title { letter-spacing: -0.4px; }
          .hero-actions { gap: 12px; margin-bottom: 30px; }
          .hero-btn-main, .hero-btn-alt { width: 100%; justify-content: center; }
          .hero-perks { gap: 0; margin-bottom: 28px; }
          .hero-perk { padding: 0 4px; gap: 8px; }
          .hero-perk-ico svg { width: 22px; height: 22px; }
          .hero-perk-label { font-size: 11.5px; }
          .hero-store { flex: 1 1 auto; justify-content: center; padding: 9px 14px; }
          .hero-store strong { font-size: 15px; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
