import { Store, Package, Share2, TrendingUp, Download, Search, Bell, ShieldCheck, Rocket } from 'lucide-react';

const vendorSteps = [
  { num:'01', icon:<Store size={20}/>,      title:'Créez votre boutique',      desc:'Inscrivez-vous, personnalisez votre boutique avec votre logo, nom et catégories de produits en quelques minutes.' },
  { num:'02', icon:<Package size={20}/>,    title:'Ajoutez vos produits',       desc:'Publiez vos articles avec photos, descriptions et prix. Organisez par catégories pour faciliter la navigation.' },
  { num:'03', icon:<Share2 size={20}/>,     title:'Partagez votre lien',        desc:"Votre boutique a sa propre adresse web dès sa création : envoyez-la par WhatsApp ou Instagram, vos clients commandent depuis leur navigateur." },
  { num:'04', icon:<TrendingUp size={20}/>, title:'Gérez & développez',         desc:'Suivez vos ventes en temps réel, gérez les commandes, lancez des promos et faites grandir votre business.' },
];

/* Le bloc vendeur s'adresse au vendeur, le bloc client s'adresse au client :
   chacun est écrit à la deuxième personne, pour son lecteur. */
const clientSteps = [
  { num:'01', icon:<Download size={20}/>,    title:"Ouvrez un lien ou l'application", desc:"Le lien d'une boutique s'ouvre dans votre navigateur, sans rien installer. L'application, elle, est gratuite sur App Store et Google Play." },
  { num:'02', icon:<Search size={20}/>,      title:'Explorez les boutiques',    desc:"Parcourez les catégories de votre ville, ou ouvrez directement le lien ou le QR code d'une boutique." },
  { num:'03', icon:<Bell size={20}/>,        title:'Abonnez-vous aux boutiques', desc:"Dans l'application, suivez plusieurs boutiques à la fois et activez la cloche pour être prévenu de leurs nouveautés." },
  { num:'04', icon:<ShieldCheck size={20}/>, title:'Commandez en confiance',    desc:"Réglez l'acompte en ligne pour confirmer votre commande. En cas de litige, le remboursement vous couvre." },
];

const StepCard = ({ step, tone }) => (
  <div className={`step-card tone-${tone} sr sr-d${step.num[1]}`}>
    <span className="step-ghost" aria-hidden="true">{step.num}</span>
    <span className="step-ico" aria-hidden="true">{step.icon}</span>
    <h4 className="step-title">{step.title}</h4>
    <p className="step-desc">{step.desc}</p>
  </div>
);

const HowItWorks = () => (
  <section id="features" className="hiw-section">
    <div className="hiw-inner">
      <div className="section-header sr">
        <div className="section-badge navy">
          <Rocket size={12} aria-hidden="true" />
          Comment ça marche
        </div>
        <h2 className="section-title">Votre boutique en ligne <em className="title-accent">en 5 minutes</em></h2>
        <p className="section-sub">Quatre étapes pour ouvrir votre boutique, quatre pour acheter dans celles des autres.</p>
      </div>

      {/* Côté vendeur */}
      <div className="hiw-block">
        <div className="hiw-block-header sr">
          <span className="hiw-tag vendor-tag"><Store size={14} aria-hidden="true"/>Côté vendeur</span>
          <span className="hiw-tag-line" aria-hidden="true" />
          <span className="hiw-tag-count">4 étapes</span>
        </div>
        <div className="steps-grid">
          {vendorSteps.map((s,i) => <StepCard key={i} step={s} tone="navy" />)}
        </div>
      </div>

      <div className="hiw-divider sr" aria-hidden="true">
        <span className="divider-line" />
        <span className="divider-pill">ou</span>
        <span className="divider-line" />
      </div>

      {/* Côté client */}
      <div className="hiw-block">
        <div className="hiw-block-header sr">
          <span className="hiw-tag client-tag"><Bell size={14} aria-hidden="true"/>Côté client</span>
          <span className="hiw-tag-line" aria-hidden="true" />
          <span className="hiw-tag-count">4 étapes</span>
        </div>
        <div className="steps-grid">
          {clientSteps.map((s,i) => <StepCard key={i} step={s} tone="gold" />)}
        </div>
      </div>
    </div>

    <style>{`
      .hiw-section {
        padding: clamp(64px, 11vh, 100px) 32px;
        background: var(--white);
      }
      .hiw-inner { max-width: 1140px; margin: 0 auto; }
      .hiw-block { margin-bottom: 16px; }
      .hiw-block-header {
        display: flex; align-items: center; gap: 14px; margin-bottom: 26px;
      }
      .hiw-tag {
        display: inline-flex; align-items: center; gap: 7px;
        padding: 8px 18px; border-radius: 999px;
        font-size: 13px; font-weight: 700; flex-shrink: 0;
        border: 1px solid transparent;
      }
      .vendor-tag { background: var(--navy-light); color: var(--navy); border-color: rgba(13,27,61,0.10); }
      .client-tag { background: var(--gold-light); color: var(--gold-ink); border-color: rgba(242,183,5,0.32); }
      .hiw-tag-line { flex: 1; height: 1px; background: var(--gray); }
      .hiw-tag-count {
        font-size: 12px; font-weight: 700; color: var(--text-muted);
        flex-shrink: 0;
      }

      .steps-grid {
        display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px;
        position: relative;
      }
      /* Fil pointillé qui relie les étapes, derrière les cartes. */
      .steps-grid::before {
        content: '';
        position: absolute; top: 62px; left: 60px; right: 60px; height: 0;
        border-top: 1px dashed rgba(13,27,61,0.22);
        z-index: 0;
      }

      .step-card {
        position: relative; z-index: 1; overflow: hidden;
        background: var(--white); border-radius: 20px; padding: 24px 22px 22px;
        border: 1px solid rgba(13,27,61,0.07);
        box-shadow: 0 2px 10px rgba(13,27,61,0.05);
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      }
      .step-card::after {
        content: ''; position: absolute; inset: 0 0 auto 0; height: 3px;
        background: var(--navy); opacity: 0;
        transition: opacity 0.3s ease;
      }
      .step-card.tone-gold::after { background: var(--gold); }
      .step-card:hover {
        transform: translateY(-6px);
        border-color: rgba(13,27,61,0.14);
        box-shadow: 0 18px 40px rgba(13,27,61,0.13);
      }
      .step-card:hover::after { opacity: 1; }

      /* Numéro d'étape en très gros, en filigrane dans le coin. */
      .step-ghost {
        position: absolute; top: 6px; right: 14px;
        font-family: var(--font-display);
        font-size: 54px; font-weight: 900; line-height: 1;
        color: rgba(13,27,61,0.06); letter-spacing: -2px;
        pointer-events: none;
      }
      .step-card.tone-gold .step-ghost { color: rgba(242,183,5,0.16); }

      .step-ico {
        position: relative;
        width: 46px; height: 46px; border-radius: 14px;
        display: inline-flex; align-items: center; justify-content: center;
        background: var(--navy-light); color: var(--navy);
        margin-bottom: 16px;
      }
      .step-card.tone-gold .step-ico { background: var(--gold-light); color: var(--gold-ink); }

      .step-title { font-size: 15.5px; font-weight: 800; color: var(--text-dark); margin-bottom: 8px; }
      .step-desc  { font-size: 13.5px; color: var(--text-light); line-height: 1.65; }

      .hiw-divider { display: flex; align-items: center; gap: 20px; margin: 44px 0; }
      .divider-line { flex: 1; height: 1px; background: var(--gray); }
      .divider-pill {
        font-size: 12px; font-weight: 700; color: var(--text-muted);
        background: var(--white); border: 1px solid var(--gray);
        padding: 5px 14px; border-radius: 999px;
      }

      @media (max-width: 900px) {
        .steps-grid { grid-template-columns: repeat(2,1fr); }
        .steps-grid::before { display: none; }
        .hiw-tag-count { display: none; }
      }
      @media (max-width: 520px) {
        .hiw-section { padding: 70px 16px; }
        .steps-grid { grid-template-columns: 1fr; }
      }
    `}</style>
  </section>
);

export default HowItWorks;
