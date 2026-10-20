import { Check, Sparkles, ArrowRight } from 'lucide-react';

/* ─── Ouvrir sa boutique ne coûte rien ────────────────────────────────
   Pas de grille à deux colonnes, pas d'offre bridée en face d'une offre
   complète : un commerçant qui compare deux colonnes se demande ce qui lui
   manque, et referme la page. Tout est clair et accessible dès le premier jour. */

const engagements = [
  'Aucune commission sur vos ventes',
  'Aucune carte bancaire demandée',
  'Boutique web & application incluses',
  'Produits et commandes illimités',
  'Notifications push à vos abonnés',
  'Sans aucun engagement',
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

      {/* Le prix, en un seul chiffre clair et direct */}
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
    </div>

    <style>{`
      .pricing-section { padding: clamp(60px, 10vh, 90px) 32px; background: var(--gray-bg); }
      .pricing-inner { max-width: 960px; margin: 0 auto; }

      /* ─── Le prix ─── */
      .gratuit-carte {
        max-width: 480px; margin: 0 auto;
        text-align: center;
        padding: 36px 32px 32px;
        border-radius: 18px;
        background: var(--navy);
        box-shadow: 0 16px 40px rgba(13,27,61,0.14);
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
        gap: 12px 16px;
        margin: 28px 0 28px;
        text-align: left;
      }
      .gratuit-engagements li {
        display: flex; align-items: flex-start; gap: 9px;
        font-size: 13px; font-weight: 500; line-height: 1.4;
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
        border: 1.5px solid transparent; border-radius: 8px; padding: 14px 20px;
        font-size: 14.5px; font-weight: 700; cursor: pointer;
        background: var(--gold);
        color: var(--navy);
        transition: transform 0.28s ease, box-shadow 0.28s ease;
      }
      .plan-btn:hover { background: var(--gold-mid); }

      @media (max-width: 820px) {
        .pricing-section { padding: 70px 20px; }
      }
      @media (max-width: 560px) {
        .pricing-section { padding: 60px 16px; }
        .gratuit-carte { padding: 28px 22px 24px; border-radius: 20px; }
        .gratuit-prix strong { font-size: 56px; }
        .gratuit-engagements { grid-template-columns: 1fr; }
      }
    `}</style>
  </section>
);

export default Pricing;
