import { useState, useEffect, useRef } from 'react';
import {
  Store, Package, BarChart2, Bell, CreditCard, CheckCircle2, ArrowRight,
  TrendingUp, Tag, Share2, Eye, Edit3, Truck, Clock, Star, Megaphone, Users, Heart
} from 'lucide-react';
import vendeurBoutique from '../../assets/screens/vendeur-boutique.webp';
import vendeurCommandes from '../../assets/screens/vendeur-commandes.webp';
import vendeurDashboard from '../../assets/screens/vendeur-dashboard.webp';
import vendeurPromotions from '../../assets/screens/vendeur-promotions.webp';
// Les visuels vendeur-*.webp sont des compositions complètes (téléphone et
// cartes flottantes déjà dessinées), recadrées en 1200 × 1500 sur fond blanc
// pur — la couleur de la carte.

const tabs = [
  { id: 'shop',  icon: <Store size={16} />,     label: 'Votre boutique'     },
  { id: 'sales', icon: <Package size={16} />,   label: 'Gestion des ventes' },
  { id: 'dash',  icon: <BarChart2 size={16} />, label: 'Dashboard'          },
  { id: 'promo', icon: <Tag size={16} />,       label: 'Promotions'         },
];

/* « composed » : l'image contient déjà ses cartes flottantes (note, avis,
   clients…). Les cartes HTML ne s'affichent alors pas, pour ne pas faire
   doublon. Les quatre onglets sont aujourd'hui des compositions complètes. */
const screens = [
  { id: 'shop',  src: vendeurBoutique,  w: 1200, h: 1500, composed: true,
    alt: "L'écran « Ma boutique » de l'application SaamBiz : produits publiés, statistiques de la semaine et commandes récentes." },
  { id: 'sales', src: vendeurCommandes, w: 1200, h: 1500, composed: true,
    alt: "L'écran « Commandes » de l'application SaamBiz : liste des commandes par statut et suivi d'une livraison à Dakar." },
  { id: 'dash',  src: vendeurDashboard, w: 1200, h: 1500, composed: true,
    alt: "Le tableau de bord de l'application SaamBiz : ventes de la semaine, produits populaires et dernières commandes." },
  { id: 'promo', src: vendeurPromotions, w: 1200, h: 1500, composed: true,
    alt: "L'écran « Promotions & Publicités » de l'application SaamBiz : campagnes actives, vues, clics et ventes générées." },
];

const content = {
  shop: {
    badge: { icon: <Store size={12} />, label: 'Boutique en ligne' },
    title: 'Créez votre boutique en quelques',
    highlight: 'minutes',
    subtitle: "Personnalisez votre vitrine avec votre nom, logo, description et catégories. Elle vit à la fois dans l'application et sur le web : partagez son lien, vos clients commandent aussitôt.",
    features: [
      { icon: <Edit3 size={17} />,   title: 'Nom, logo et description personnalisés', desc: "Affichez l'identité de votre marque avec professionnalisme." },
      { icon: <Share2 size={17} />,  title: 'Lien unique à partager partout',          desc: 'WhatsApp, Instagram, bio : vos clients commandent depuis leur navigateur.' },
      { icon: <Eye size={17} />,     title: 'Vitrine visible pour tous vos abonnés',   desc: 'Vos produits restent accessibles à toute heure.' },
      { icon: <Package size={17} />, title: 'Ajoutez autant de produits que vous voulez', desc: 'Enrichissez votre catalogue sans aucune limite.' },
    ],
    cta: 'Créer ma boutique maintenant',
    note: 'Gratuit, rapide et sans engagement',
    stat: { icon: <Store size={17} />, tone: 'green', label: 'Boutique en ligne', value: '28 produits publiés' },
    chip: { icon: <Heart size={13} />, tone: 'rose',  text: 'Boutique personnalisable' },
  },
  sales: {
    badge: { icon: <Package size={12} />, label: 'Suivi des commandes' },
    title: 'Gérez chaque vente avec',
    highlight: 'précision',
    subtitle: "Suivez l'état de chaque commande en temps réel. Changez le statut d'un simple geste : en attente, confirmée, expédiée, livrée ou payée.",
    features: [
      { icon: <Clock size={17} />,      title: 'Le statut en un seul geste',        desc: 'En attente → Confirmée → Expédiée → Livrée.' },
      { icon: <Truck size={17} />,      title: 'Livraison et paiement en 1 clic',   desc: 'Mettez la commande à jour depuis votre téléphone.' },
      { icon: <CreditCard size={17} />, title: "Validation après l'acompte",         desc: 'Aucune commande confirmée sans paiement initial.' },
      { icon: <Star size={17} />,       title: 'Historique complet de vos ventes',   desc: 'Retrouvez et filtrez toutes vos commandes par statut.' },
    ],
    cta: 'Voir la gestion des ventes',
    note: 'Mise à jour en temps réel',
    stat: { icon: <Package size={17} />, tone: 'navy', label: 'Commandes traitées', value: '56 livrées ce mois' },
    chip: { icon: <Truck size={13} />,   tone: 'gold', text: 'Livraison suivie' },
  },
  dash: {
    badge: { icon: <BarChart2 size={12} />, label: 'Pilotage en temps réel' },
    title: 'Un dashboard pour tout',
    highlight: 'piloter',
    subtitle: 'Visualisez vos revenus, vos produits les plus vendus, vos meilleures périodes de vente et la croissance de votre boutique en temps réel.',
    features: [
      { icon: <TrendingUp size={17} />, title: 'Revenus quotidiens & mensuels', desc: 'Des courbes claires pour suivre votre croissance.' },
      { icon: <Star size={17} />,       title: 'Top 5 des produits les plus vendus', desc: 'Identifiez immédiatement ce qui marche le mieux.' },
      { icon: <BarChart2 size={17} />,  title: 'Statistiques complètes',        desc: 'Produits, clients, avis et panier moyen au même endroit.' },
      { icon: <Bell size={17} />,       title: 'Alertes en temps réel',         desc: 'Nouvelle commande, nouvel avis, stock faible.' },
    ],
    cta: 'Découvrir le dashboard',
    note: 'Données actualisées en continu',
    stat: { icon: <BarChart2 size={17} />, tone: 'green', label: 'Ventes en croissance', value: '+24% ce mois' },
    chip: { icon: <Users size={13} />,     tone: 'navy',  text: '340 clients actifs' },
  },
  promo: {
    badge: { icon: <Megaphone size={12} />, label: 'Promotions & publicités' },
    title: 'Lancez des promotions qui',
    highlight: 'convertissent',
    subtitle: 'Créez des offres limitées dans le temps et notifiez automatiquement tous vos abonnés. Boostez vos ventes avec des campagnes ciblées.',
    features: [
      { icon: <Tag size={17} />,    title: 'Remises en % ou en montant fixe', desc: "Créez une offre en moins d'une minute." },
      { icon: <Bell size={17} />,   title: 'Notification push automatique',   desc: 'Tous vos abonnés sont prévenus instantanément.' },
      { icon: <Clock size={17} />,  title: "Dates de début et d'expiration",   desc: 'Programmez vos ventes flash à l’avance.' },
      { icon: <Share2 size={17} />, title: 'Partage sur les réseaux sociaux', desc: 'Diffusez vos promos là où sont vos clients.' },
    ],
    cta: 'Créer une promotion',
    note: 'Vos abonnés notifiés en 1 clic',
    stat: { icon: <Megaphone size={17} />, tone: 'gold', label: 'Campagne active', value: '450 000 FCFA générés' },
    chip: { icon: <Eye size={13} />,       tone: 'navy', text: '25 430 vues'  },
  }
};

/* Flèche décorative qui relie la preuve sociale au téléphone. */
const CurveArrow = () => (
  <svg className="device-arrow" viewBox="0 0 110 130" fill="none" aria-hidden="true">
    <path d="M12 124C2 88 10 44 52 20" stroke="currentColor" strokeWidth="4"
          strokeLinecap="round" strokeDasharray="9 11" />
    <path d="M38 16 L56 17 L50 34" stroke="currentColor" strokeWidth="4"
          strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Un seul appareil, monté une fois pour toutes : le châssis (qui fait partie
   des visuels) ne bouge jamais, seule l'opacité des captures change. Les
   éléments graphiques, eux, flottent autour du téléphone : la carte de
   statistique et la pastille suivent l'onglet, la preuve sociale reste. */
const PhoneDevice = ({ active, stat, chip }) => (
  <div className={`device ${screens.find(s => s.id === active)?.composed ? 'is-composed' : ''}`}>
    {screens.map(s => (
      <img
        key={s.id}
        src={s.src}
        alt={s.alt}
        className={`device-shot ${s.id === active ? 'is-active' : ''}`}
        aria-hidden={s.id !== active}
        width={s.w}
        height={s.h}
        loading="lazy"
        decoding="async"
      />
    ))}

    {/* Carte de statistique — change avec l'onglet */}
    <span key={`stat-${active}`} className={`fl-card fl-stat tone-${stat.tone}`} aria-hidden="true">
      <span className="fl-ico">{stat.icon}</span>
      <span className="fl-body">
        <small>{stat.label}</small>
        <strong>{stat.value}</strong>
      </span>
    </span>

    {/* Clients — avatars empilés */}
    <span className="fl-card fl-people" aria-hidden="true">
      <small>Des clients partout !</small>
      <span className="fl-avatars">
        {['A', 'M', 'F'].map((n, i) => (
          <span key={i} className={`fl-av av-${i}`}>{n}</span>
        ))}
        <span className="fl-av fl-av-more">+1K</span>
      </span>
    </span>

    {/* Pastille — change avec l'onglet */}
    <span key={`chip-${active}`} className={`float-chip fl-pill tone-${chip.tone}`} aria-hidden="true">
      {chip.icon}
      {chip.text}
    </span>

    {/* Témoignage */}
    <span className="fl-card fl-quote" aria-hidden="true">
      <span className="fl-quote-top">
        <span className="fl-av av-quote">A</span>
        <span className="fl-quote-text">
          « J'ai créé ma boutique en 5 minutes et mes ventes ont doublé ! »
        </span>
      </span>
      <span className="fl-stars">
        {[0,1,2,3,4].map(i => <Star key={i} size={11} fill="currentColor" strokeWidth={0} />)}
        <em>— Awa, vendeuse à Dakar</em>
      </span>
    </span>

    {/* Note globale */}
    <span className="float-chip fl-rating" aria-hidden="true">
      <Star size={13} fill="currentColor" strokeWidth={0} />
      <span className="fl-rating-text"><strong>4.9/5</strong> Satisfaction client</span>
    </span>

    <CurveArrow />
  </div>
);

const AUTO_DELAY = 5200;

const VendorFeatures = ({ scrollTo }) => {
  const [active, setActive] = useState('shop');
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const reduced = useRef(false);
  const c = content[active];

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced.current) setAuto(false);
  }, []);

  /* Défilement automatique des écrans, façon démo. Il s'arrête définitivement
     dès que l'utilisateur choisit un onglet lui-même, et se met en pause au survol. */
  useEffect(() => {
    if (!auto || hover) return;
    const id = setInterval(() => {
      setActive(a => tabs[(tabs.findIndex(t => t.id === a) + 1) % tabs.length].id);
    }, AUTO_DELAY);
    return () => clearInterval(id);
  }, [auto, hover, active]);

  const select = (id) => { setAuto(false); setActive(id); };

  // Onglets pilotables au clavier : flèches gauche/droite, Origine et Fin.
  const onTabKey = (e) => {
    const i = tabs.findIndex(t => t.id === active);
    let next = null;
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(tabs[next].id);
    document.getElementById(`vtab-${tabs[next].id}`)?.focus();
  };

  return (
    <section id="features" className="vf-section">
      {/* Bandeau bleu marine */}
      <div className="vf-top-band">
        <div className="vf-top-inner sr">
          <div className="section-badge navy">Pour les Vendeurs</div>
          <h2 className="section-title vf-title">Tout ce qu'il faut pour vendre en ligne</h2>
          <p className="section-sub vf-sub">De la création de votre boutique à la gestion des commandes, SaamBiz vous donne tous les outils pour réussir.</p>
        </div>
      </div>

      <div
        className="vf-inner"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="vf-card sr">
          {/* Onglets */}
          <div className="vf-tabs" role="tablist" aria-label="Fonctionnalités vendeur" onKeyDown={onTabKey}>
            {tabs.map(t => (
              <button
                key={t.id}
                id={`vtab-${t.id}`}
                role="tab"
                aria-selected={active === t.id}
                aria-controls="vf-panel"
                tabIndex={active === t.id ? 0 : -1}
                className={`vtab ${active === t.id ? 'active' : ''}`}
                onClick={() => select(t.id)}
              >
                <span aria-hidden="true">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>

          {/* Contenu */}
          <div className="vf-content" id="vf-panel" role="tabpanel" aria-labelledby={`vtab-${active}`}>
            <div className="vf-text">
              <span className="vf-chip">
                <span aria-hidden="true">{c.badge.icon}</span>
                {c.badge.label}
              </span>

              <h3 className="feat-title">
                {c.title} <em>{c.highlight}</em>
              </h3>
              <p className="feat-sub">{c.subtitle}</p>

              <ul className="feat-list">
                {c.features.map((f, i) => (
                  <li key={i} className="feat-list-item">
                    <span className="feat-icon-wrap" aria-hidden="true">{f.icon}</span>
                    <span className="feat-body">
                      <strong>{f.title}</strong>
                      <small>{f.desc}</small>
                    </span>
                  </li>
                ))}
              </ul>

              <button className="vf-cta" onClick={() => scrollTo?.('download')}>
                <Store size={16} strokeWidth={2.4} aria-hidden="true" />
                {c.cta}
                <ArrowRight size={15} strokeWidth={2.6} aria-hidden="true" />
              </button>
              <p className="vf-note">
                <CheckCircle2 size={14} strokeWidth={2.4} aria-hidden="true" />
                {c.note}
              </p>
            </div>

            <div className="vf-visual">
              <PhoneDevice active={active} stat={c.stat} chip={c.chip} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* SECTION */
        .vf-section { background: var(--gray-bg); }

        /* BANDEAU BLEU MARINE */
        .vf-top-band {
          background: #0D1B3D;
          padding: clamp(48px, 8vh, 72px) 32px clamp(80px, 11vh, 96px);
          position: relative; overflow: hidden;
        }
        .vf-top-inner {
          max-width: 1280px; margin: 0 auto;
          text-align: center; position: relative; z-index: 1;
        }
        .vf-title { color: white !important; }
        .vf-sub   { color: rgba(255,255,255,0.65) !important; }
        .vf-top-band .section-badge.navy {
          color: #FFC93C;
        }

        /* CARTE BLANCHE — elle chevauche le bandeau bleu */
        .vf-inner { max-width: 1280px; margin: 0 auto; padding: 0 32px clamp(56px, 9vh, 80px); }
        .vf-card {
          margin-top: -56px; position: relative; z-index: 2;
          background: var(--white);
          border: 1px solid rgba(13,27,61,0.06);
          border-radius: 16px;
          padding: 28px 40px 44px;
          box-shadow: 0 1px 3px rgba(13,27,61,0.06);
        }

        /* ONGLETS */
        .vf-tabs {
          display: flex; flex-wrap: wrap; gap: 8px;
          justify-content: center; padding: 4px 0 clamp(20px, 4vh, 40px);
        }
        .vtab {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 16px; border-radius: 8px;
          border: 1.5px solid var(--gray); background: white;
          font-size: 13.5px; font-weight: 600; color: #5B6C8A;
          cursor: pointer; transition: all 0.25s ease;
        }
        .vtab span { display: inline-flex; align-items: center; }
        .vtab:hover { border-color: #0D1B3D; color: #0D1B3D; background: #E8EDF7; }
        .vtab.active {
          background: #0D1B3D;
          color: white; border-color: #0D1B3D;
        }

        /* CONTENU */
        .vf-content { display: flex; align-items: center; gap: 48px; }
        .vf-text { flex: 1 1 460px; min-width: 0; max-width: 520px; }

        .vf-chip {
          display: inline-flex; align-items: center; gap: 7px;
          color: var(--gold-ink);
          padding: 0;
          font-size: 13px; font-weight: 600;
          margin-bottom: 18px;
        }
        .vf-chip span { display: inline-flex; align-items: center; }

        .feat-title {
          font-size: clamp(21px, 1.9vw, 27px); font-weight: 700;
          color: #0D1B3D; margin-bottom: 14px;
          letter-spacing: -0.5px; line-height: 1.2;
        }
        .feat-title em { font-style: normal; color: var(--gold-deep); }
        .feat-sub { font-size: 14.5px; color: #5B6C8A; line-height: 1.75; margin-bottom: 26px; }

        .feat-list { list-style: none; display: flex; flex-direction: column; gap: 16px; margin-bottom: 30px; }
        .feat-list-item { display: flex; align-items: flex-start; gap: 14px; }
        .feat-icon-wrap {
          width: 36px; height: 36px; border-radius: 8px;
          background: var(--navy-light); color: var(--navy);
          display: inline-flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 1px;
        }
        .feat-body { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .feat-body strong { font-size: 14.5px; font-weight: 700; color: #0D1B3D; }
        .feat-body small  { font-size: 13px; color: #5B6C8A; line-height: 1.5; }

        .vf-cta {
          display: inline-flex; align-items: center; gap: 10px;
          background: #0D1B3D;
          color: white; border: none;
          padding: 14px 22px; border-radius: 8px;
          font-size: 14.5px; font-weight: 700; cursor: pointer;
          box-shadow: none;
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }
        .vf-cta:hover { background: #1E3A78; }
        .vf-note {
          display: flex; align-items: center; gap: 7px;
          margin-top: 12px; font-size: 12.5px; font-weight: 600;
          color: var(--emerald-ink);
        }

        /* ─── APPAREIL ─── */
        .vf-visual { flex: 1 1 420px; display: flex; justify-content: center; min-width: 0; }
        .device {
          position: relative;
          width: 100%; max-width: 540px;
          aspect-ratio: 4 / 5;
        }
        /* Composition complète : ses cartes sont dans l'image. */
        .device.is-composed .fl-card,
        .device.is-composed .fl-pill,
        .device.is-composed .fl-rating { display: none; }
        /* Écran Promotions (ancienne capture, plus étroite que le cadre 4:5) :
           les cartes restent dans le cadre au lieu de déborder de la carte. */
        .device:not(.is-composed) .fl-stat   { left: 2%; }
        .device:not(.is-composed) .fl-rating { left: 2%; }
        .device:not(.is-composed) .fl-people { right: 0; }
        .device:not(.is-composed) .fl-pill   { right: 0; }
        .device:not(.is-composed) .fl-quote  { right: 0; width: 230px; }
        @keyframes deviceFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        .device-shot {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: contain;
          opacity: 0;
          transition: opacity 0.55s cubic-bezier(0.4,0,0.2,1);
        }
        .device-shot.is-active { opacity: 1; }

        /* ─── ÉLÉMENTS GRAPHIQUES AUTOUR DU TÉLÉPHONE ─── */
        .fl-card, .fl-pill, .fl-rating {
          position: absolute; z-index: 3;
          background: var(--white);
          border: 1px solid rgba(13,27,61,0.07);
          box-shadow: 0 2px 10px rgba(13,27,61,0.10);
          animation: chipIn 0.55s ease both;
        }
        .fl-card { border-radius: 10px; padding: 12px 14px; }
        @keyframes chipIn {
          from { opacity: 0; transform: translateY(12px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Carte statistique (haut-gauche) */
        .fl-stat {
          display: flex; align-items: center; gap: 11px;
          top: 3%; left: -15%; animation-delay: 0.10s;
        }
        .fl-ico {
          width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .fl-stat.tone-green .fl-ico { background: var(--emerald-lt); color: var(--emerald-ink); }
        .fl-stat.tone-navy  .fl-ico { background: var(--navy-light); color: var(--navy); }
        .fl-stat.tone-gold  .fl-ico { background: var(--gold-light); color: var(--gold-ink); }
        .fl-body { display: flex; flex-direction: column; gap: 2px; }
        .fl-body small  { font-size: 11px; font-weight: 600; color: var(--text-light); white-space: nowrap; }
        .fl-body strong { font-size: 13.5px; font-weight: 800; color: var(--text-dark); white-space: nowrap; }
        .fl-stat.tone-green .fl-body strong { color: var(--emerald-ink); }

        /* Carte clients (haut-droite) */
        .fl-people {
          display: flex; flex-direction: column; gap: 8px;
          top: 1%; right: -13%; animation-delay: 0.22s;
        }
        .fl-people > small { font-size: 12px; font-weight: 800; color: var(--text-dark); white-space: nowrap; }
        .fl-avatars { display: flex; align-items: center; }
        .fl-av {
          width: 28px; height: 28px; border-radius: 50%;
          border: 2px solid var(--white); margin-left: -8px;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800; color: var(--white);
        }
        .fl-av:first-child { margin-left: 0; }
        .av-0 { background: var(--navy); }
        .av-1 { background: var(--gold-deep); }
        .av-2 { background: var(--emerald-ink); }
        .fl-av-more { background: var(--gray-light); color: var(--text-mid); font-size: 10px; }

        /* Pastille (milieu-droite) */
        .fl-pill {
          display: inline-flex; align-items: center; gap: 7px;
          border-radius: 12px; padding: 9px 13px;
          font-size: 12px; font-weight: 700; color: var(--text-dark);
          white-space: nowrap;
          top: 40%; right: -16%; animation-delay: 0.34s;
        }
        .fl-pill svg { flex-shrink: 0; }
        .tone-green svg { color: var(--emerald); }
        .tone-navy  svg { color: var(--navy-mid); }
        .tone-gold  svg { color: var(--gold-ink); }
        .tone-rose  svg { color: var(--rose); }

        /* Témoignage (bas-droite) */
        .fl-quote {
          display: flex; flex-direction: column; gap: 8px;
          width: 250px; bottom: 4%; right: -17%; animation-delay: 0.46s;
        }
        .fl-quote-top { display: flex; align-items: flex-start; gap: 10px; }
        .av-quote {
          background: var(--gold-deep); margin-left: 0; flex-shrink: 0;
          width: 32px; height: 32px; font-size: 13px;
        }
        .fl-quote-text {
          font-size: 11.5px; font-weight: 600; color: var(--text-dark);
          line-height: 1.45;
        }
        .fl-stars { display: flex; align-items: center; gap: 2px; color: var(--gold); }
        .fl-stars em {
          font-style: normal; margin-left: 7px;
          font-size: 10.5px; font-weight: 600; color: var(--text-muted);
          white-space: nowrap;
        }

        /* Note globale (bas-gauche) */
        .fl-rating {
          display: inline-flex; align-items: center; gap: 8px;
          border-radius: 12px; padding: 9px 14px;
          bottom: 15%; left: -14%; animation-delay: 0.58s;
        }
        .fl-rating svg { color: var(--gold); flex-shrink: 0; }
        .fl-rating-text { font-size: 11.5px; font-weight: 600; color: var(--text-light); white-space: nowrap; }
        .fl-rating-text strong { font-size: 13px; font-weight: 800; color: var(--text-dark); margin-right: 3px; }

        /* Flèche décorative */
        .device-arrow {
          display: none;
          position: absolute; z-index: 2; pointer-events: none;
          width: 74px; height: 88px;
          bottom: 27%; left: -4%;
          color: var(--gold);
          opacity: 0; animation: chipIn 0.6s ease-out 0.7s both;
        }

        @media (max-width: 1050px) {
          .vf-content { gap: 32px; }
          .device { max-width: 460px; }
          .fl-quote { width: 216px; right: -20%; }
          .fl-stat, .fl-rating { left: -20%; }
          .fl-people, .fl-pill { right: -20%; }
        }
        @media (max-width: 900px) {
          .vf-top-band { padding: 52px 20px 88px; }
          .vf-inner { padding: 0 20px 60px; }
          .vf-card { padding: 24px 22px 36px; border-radius: 22px; }
          .vf-content { flex-direction: column; gap: 40px; }
          .vf-text { max-width: 100%; flex: 1 1 auto; }
          .vf-visual { width: 100%; flex: 1 1 auto; }
        }
        @media (max-width: 600px) {
          .vtab { font-size: 12.5px; padding: 9px 14px; }
          /* La composition déborde sur les marges de la carte : le
             téléphone gagne en taille, toujours centré. */
          .vf-visual { margin: -12px -20px 0; width: calc(100% + 40px); }
          .vf-card { padding-bottom: 20px; }
          .device { max-width: 100%; }
          /* Trop etroit pour faire flotter les cartes : on n'en garde que deux. */
          .fl-people, .fl-quote, .device-arrow { display: none; }
          .fl-stat  { left: -6%; top: 1%; }
          .fl-pill  { right: -6%; top: 44%; }
          .fl-rating { left: -4%; bottom: 6%; }
          .vf-cta { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
};

export default VendorFeatures;
