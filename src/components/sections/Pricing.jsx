import { Check, Sparkles, ArrowRight, Store, Globe, BellRing, BarChart3, Users, Percent } from 'lucide-react';

/* ─── Ouvrir sa boutique ne coûte rien ────────────────────────────────
   Pas de grille à deux colonnes, pas d'offre bridée en face d'une offre
   complète : un commerçant qui compare deux colonnes se demande ce qui lui
   manque, et referme la page.

   Tout est écrit au PRÉSENT, et rien n'engage l'avenir — ni « pour
   toujours », ni « sans limite de durée », ni « ce n'est pas une version
   d'essai ». Ce qui est vrai aujourd'hui se dit ; ce qui pourrait changer
   ne se promet pas. */

const inclus = [
  {
    Icon: Store,
    titre: 'Votre boutique, sans limite',
    texte: 'Autant de produits, de photos et de commandes que vous voulez. Aucun compteur, aucun palier.',
  },
  {
    Icon: Globe,
    titre: 'Votre site web',
    texte: 'Une adresse à vous, composée à partir de votre logo. Vos clients y commandent sans rien installer.',
  },
  {
    Icon: BellRing,
    titre: 'Vos notifications',
    texte: 'Prévenez tous vos abonnés à chaque arrivage ou promotion, autant de fois que nécessaire.',
  },
  {
    Icon: BarChart3,
    titre: 'Vos statistiques',
    texte: 'Ce qui se vend, ce qui stagne, qui revient acheter. Sur votre téléphone et sur votre ordinateur.',
  },
  {
    Icon: Percent,
    titre: 'Vos promotions',
    texte: 'Prix barrés, codes promo, mises en avant. Sans quota mensuel.',
  },
  {
    Icon: Users,
    titre: 'Vos clients vous appartiennent',
    texte: 'Leurs coordonnées sont les vôtres. Exportez-les quand vous voulez, partez avec si vous partez.',
  },
];

/* Ce que « gratuit » veut dire ici — parce que le mot a été trop utilisé.
   Quatre affirmations vérifiables sur le produit tel qu'il est, aucune sur
   ce qu'il sera. */
const engagements = [
  'Aucune commission sur vos ventes',
  'Aucune carte bancaire demandée',
  'Toutes les fonctionnalités ouvertes',
  'Sans engagement',
];

const Pricing = ({ scrollTo }) => (
  <section id="pricing" className="pricing-section">
    <div className="pricing-inner">
      <div className="section-header sr">
        <div className="section-badge gold">
          <Sparkles size={12} aria-hidden="true" />
          Tarifs
        </div>
        <h2 className="section-title">
          Ouvrez votre boutique, <em className="title-accent">c'est gratuit</em>
        </h2>
        <p className="section-sub">
          Pas d'offre bridée, pas de fonctionnalité verrouillée derrière un abonnement,
          pas de commission prélevée sur ce que vous vendez. Vous avez accès à la
          totalité de SaamBiz dès l'ouverture de votre boutique.
        </p>
      </div>

      {/* Le prix, en un seul chiffre. Une grille à deux colonnes ferait
          chercher ce qui manque ; il n'y a rien à chercher. */}
      <div className="gratuit-carte sr">
        <div className="gratuit-prix">
          <strong>0</strong>
          <span className="gratuit-cur">F CFA</span>
        </div>
        <p className="gratuit-legende">par mois, pour toutes les boutiques</p>

        <ul className="gratuit-engagements">
          {engagements.map((e) => (
            <li key={e}>
              <span className="gratuit-mark" aria-hidden="true">
                <Check size={11} strokeWidth={3.4} />
              </span>
              {e}
            </li>
          ))}
        </ul>

        <button className="plan-btn gold" onClick={() => scrollTo?.('download')}>
          Ouvrir ma boutique
          <ArrowRight size={15} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>

      <div className="gratuit-grille">
        {inclus.map(({ Icon, titre, texte }, i) => (
          <article key={titre} className={`gratuit-item sr sr-d${(i % 3) + 1}`}>
            <span className="gratuit-icone" aria-hidden="true">
              <Icon size={18} strokeWidth={2.1} />
            </span>
            <h3>{titre}</h3>
            <p>{texte}</p>
          </article>
        ))}
      </div>

    </div>

    <style>{`
      .pricing-section { padding: 90px 32px; background: var(--gray-bg); }
      .pricing-inner { max-width: 1000px; margin: 0 auto; }

      /* ─── Le prix ─── */
      .gratuit-carte {
        max-width: 460px; margin: 0 auto 44px;
        text-align: center;
        padding: 34px 30px 30px;
        border-radius: 24px;
        background: linear-gradient(160deg, var(--navy-deep) 0%, var(--navy) 58%, var(--navy-dark) 100%);
        box-shadow: 0 24px 56px rgba(13,27,61,0.28);
        border: 1px solid rgba(242,183,5,0.30);
      }

      .gratuit-prix { display: flex; align-items: baseline; justify-content: center; gap: 8px; }
      .gratuit-prix strong {
        font-family: var(--font-display);
        font-size: 68px; font-weight: 700; letter-spacing: -3px;
        color: var(--white); line-height: 1;
      }
      .gratuit-cur { font-size: 20px; font-weight: 600; color: var(--gold); }
      .gratuit-legende {
        margin-top: 8px; font-size: 13.5px;
        color: rgba(255,255,255,0.62);
      }

      .gratuit-engagements {
        list-style: none;
        display: grid; grid-template-columns: 1fr 1fr;
        gap: 10px 14px;
        margin: 24px 0 24px;
        text-align: left;
      }
      .gratuit-engagements li {
        display: flex; align-items: flex-start; gap: 9px;
        font-size: 12.8px; font-weight: 500; line-height: 1.4;
        color: rgba(255,255,255,0.92);
      }
      .gratuit-mark {
        width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
        display: inline-flex; align-items: center; justify-content: center;
        background: rgba(242,183,5,0.18); color: var(--gold-mid);
      }

      .plan-btn {
        display: flex; align-items: center; justify-content: center; gap: 9px;
        width: 100%;
        border: 1.5px solid transparent; border-radius: 12px; padding: 14px 20px;
        font-size: 14px; font-weight: 700; cursor: pointer;
        background: linear-gradient(135deg, var(--gold), var(--gold-mid));
        color: var(--navy);
        box-shadow: 0 10px 26px rgba(242,183,5,0.38);
        transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease;
      }
      .plan-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(242,183,5,0.50); }

      /* ─── Ce qui est inclus ─── */
      .gratuit-grille {
        display: grid; grid-template-columns: repeat(3, 1fr);
        gap: 18px;
      }
      .gratuit-item {
        background: var(--white);
        border: 1px solid rgba(13,27,61,0.08);
        border-radius: 18px; padding: 24px 22px;
        box-shadow: var(--shadow-xs);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .gratuit-item:hover { transform: translateY(-3px); box-shadow: 0 16px 38px rgba(13,27,61,0.10); }

      .gratuit-icone {
        display: inline-flex; align-items: center; justify-content: center;
        width: 40px; height: 40px; border-radius: 12px;
        background: var(--gold-light); color: var(--gold-ink);
        margin-bottom: 14px;
      }
      .gratuit-item h3 {
        font-size: 15.5px; font-weight: 700; color: var(--text-dark);
        margin-bottom: 7px; line-height: 1.35;
      }
      .gratuit-item p {
        font-size: 13.2px; line-height: 1.62; color: var(--text-light);
        text-wrap: pretty;
      }

      @media (max-width: 820px) {
        .pricing-section { padding: 70px 20px; }
        .gratuit-grille { grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 560px) {
        .pricing-section { padding: 60px 16px; }
        .gratuit-carte { padding: 28px 22px 24px; border-radius: 20px; }
        .gratuit-prix strong { font-size: 56px; }
        .gratuit-engagements { grid-template-columns: 1fr; }
        .gratuit-grille { grid-template-columns: 1fr; }
      }
    `}</style>
  </section>
);

export default Pricing;
