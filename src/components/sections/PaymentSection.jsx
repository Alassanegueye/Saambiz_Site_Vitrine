import { ShieldCheck, Lock, RefreshCw, CreditCard, CheckCircle, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import logoWave from '../../assets/paiement/wave.webp';
import logoOrangeMoney from '../../assets/paiement/orange-money.webp';
import logoFreeMoney from '../../assets/paiement/free-money.webp';

const features = [
  { icon:<CheckCircle size={17}/>, title:'Acompte à la commande',   desc:"Aucune commande n'est validée sans le paiement d'un acompte, dont le vendeur fixe le pourcentage. Le solde est réglé à la livraison.", tone:'green' },
  { icon:<Lock size={17}/>,        title:'Paiement 100 % sécurisé', desc:'Wave, Orange Money, Free Money ou carte bancaire. Les transactions sont chiffrées SSL et les données bancaires ne sont jamais stockées.', tone:'navy'  },
  { icon:<ShieldCheck size={17}/>, title:'Protection acheteur',     desc:"Commande non conforme ou non livrée : l'acheteur est remboursé. Cette garantie rassure les clients qui découvrent une boutique.", tone:'navy'  },
  { icon:<RefreshCw size={17}/>,   title:'Litiges arbitrés sous 48 h', desc:'En cas de contestation, notre équipe examine le dossier et tranche. Vendeur comme acheteur sont accompagnés.', tone:'gold'  },
];

const methods = [
  { name:'Wave',         logo:logoWave        },
  { name:'Orange Money', logo:logoOrangeMoney },
  { name:'Free Money',   logo:logoFreeMoney   },
  { name:'Carte Visa',   color:'#0D1B3D', Icon:CreditCard },
];

/* Logo de l'opérateur quand on l'a, sinon une icône (carte bancaire). */
const MethodMark = ({ m, size }) => m.logo
  ? <img src={m.logo} alt="" width={size} height={size} className="pay-logo" loading="lazy" decoding="async" />
  : <m.Icon size={size - 4} strokeWidth={2.2} style={{ color:m.color }} aria-hidden="true" />;

const PaymentFlow = () => (
  <div className="pay-flow">
    <div className="pf-header">
      <Lock size={13} aria-hidden="true" />
      <span>Paiement sécurisé</span>
      <span className="ssl-badge">SSL 256-bit</span>
    </div>
    <div className="pf-amount-box">
      <div className="pf-label">Acompte (30%) à régler maintenant</div>
      <div className="pf-amount">6 750 <span>XOF</span></div>
      <div className="pf-total">Total commande : <strong>22 500 XOF</strong></div>
    </div>
    <div className="pf-methods">
      {methods.map((m,i) => (
        <motion.div key={i} className={`pf-method ${i===0?'selected':''}`}
          initial={{ opacity:0, y:8 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ delay:i*0.08+0.2 }}>
          <span className="pf-emoji" style={{ color:m.color }}><MethodMark m={m} size={22} /></span>
          <span className="pf-mname">{m.name}</span>
          {i===0 && <CheckCircle size={14} color="#22C55E" />}
        </motion.div>
      ))}
    </div>
    <div className="pf-confirm">
      <Lock size={13} aria-hidden="true" /> Confirmer le paiement
    </div>
    <div className="pf-note">
      <AlertCircle size={12} aria-hidden="true" />
      <span>Votre commande sera confirmée après validation du paiement</span>
    </div>
  </div>
);

const PaymentSection = ({ scrollTo }) => (
  <section id="payment" className="payment-section">
    <div className="payment-inner">
      <div className="section-header sr">
        <div className="section-badge emerald">
          <ShieldCheck size={12} aria-hidden="true" />
          Paiements & Sécurité
        </div>
        <h2 className="section-title">Des transactions <em className="title-accent">sécurisées</em>,<br/>des deux côtés</h2>
        <p className="section-sub">Acompte obligatoire, paiement mobile intégré et arbitrage des litiges : le vendeur est payé, l'acheteur est protégé.</p>
      </div>

      <div className="payment-layout">
        <div className="payment-features sr-l">
          <ul className="pfc-list">
            {features.map((f,i) => (
              <li key={i} className={`pfc sr sr-d${i+1}`}>
                <span className={`pfc-ico tone-${f.tone}`} aria-hidden="true">{f.icon}</span>
                <span className="rich-body">
                  <strong>{f.title}</strong>
                  <small>{f.desc}</small>
                </span>
              </li>
            ))}
          </ul>

          <div className="methods-box sr sr-d5">
            <div className="methods-title">Moyens de paiement acceptés</div>
            <div className="methods-pills">
              {methods.map((m,i) => (
                <span key={i} className="method-pill">
                  <MethodMark m={m} size={18} /> {m.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="payment-visual sr-r">
          <div className="pv-wrap">
            <span className="glow-blob pv-glow" aria-hidden="true" />
            <PaymentFlow />
            <span className="float-chip chip-confirmed" aria-hidden="true">
              <CheckCircle2 size={13} />
              Commande confirmée !
            </span>
            <span className="float-chip chip-refund" aria-hidden="true">
              <RefreshCw size={13} />
              Remboursé sous 48 h
            </span>
          </div>
        </div>
      </div>

      {/* Bandeau de réassurance */}
      <div className="payment-banner sr sr-d2">
        <span className="pb-ico" aria-hidden="true"><ShieldCheck size={24} /></span>
        <div className="pb-text">
          <div className="pb-title">Vous êtes protégé à 100%</div>
          <div className="pb-sub">En cas de problème avec votre commande, notre équipe est disponible 7j/7 pour vous aider.</div>
        </div>
        <button className="pb-btn" onClick={() => scrollTo?.('faq')}>
          En savoir plus sur nos garanties
          <ArrowRight size={15} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    </div>

    <style>{`
      .payment-section {
        padding: clamp(64px, 11vh, 100px) 32px;
        background: var(--white);
      }
      .payment-inner { max-width: 1140px; margin: 0 auto; }
      .payment-layout { display: flex; align-items: flex-start; gap: 64px; margin-bottom: 56px; }
      .payment-features { flex: 1 1 560px; min-width: 0; }

      .pfc-list { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 14px; }
      .pfc {
        display: flex; align-items: flex-start; gap: 14px;
        background: var(--white); border-radius: 16px; padding: 17px 18px;
        border: 1px solid rgba(13,27,61,0.07);
        box-shadow: 0 2px 10px rgba(13,27,61,0.05);
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
      }
      .pfc:hover {
        transform: translateX(5px);
        border-color: rgba(13,27,61,0.14);
        box-shadow: 0 14px 32px rgba(13,27,61,0.12);
      }
      .pfc-ico {
        width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0; margin-top: 1px;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .pfc-ico.tone-navy  { background: var(--navy-light); color: var(--navy); }
      .pfc-ico.tone-green { background: var(--emerald-lt); color: var(--emerald-ink); }
      .pfc-ico.tone-gold  { background: var(--gold-light); color: var(--gold-ink); }

      .methods-box {
        background: var(--white); border-radius: 16px; padding: 18px;
        border: 1px solid rgba(13,27,61,0.07);
        box-shadow: 0 2px 10px rgba(13,27,61,0.05);
      }
      .methods-title { font-size: 13px; font-weight: 700; color: var(--text-dark); margin-bottom: 12px; }
      .methods-pills { display: flex; flex-wrap: wrap; gap: 8px; }
      .method-pill {
        display: inline-flex; align-items: center; gap: 6px;
        background: var(--gray-bg); border: 1px solid var(--gray);
        padding: 7px 13px; border-radius: 999px;
        font-size: 12px; font-weight: 600; color: var(--text-mid);
      }

      /* ─── MAQUETTE PAIEMENT ─── */
      .payment-visual { flex: 1 1 400px; display: flex; justify-content: center; min-width: 0; }
      .pv-wrap { position: relative; width: 100%; max-width: 380px; }
      .pv-glow {
        width: 320px; height: 320px; background: rgba(34,197,94,0.20);
        top: 45%; left: 50%; transform: translate(-50%,-50%);
      }
      .pay-flow {
        position: relative; z-index: 1;
        background: var(--white); border-radius: 22px; padding: 22px;
        border: 1px solid rgba(13,27,61,0.07);
        box-shadow: 0 24px 60px rgba(13,27,61,0.16), 0 4px 14px rgba(13,27,61,0.06);
      }
      .pf-header {
        display: flex; align-items: center; gap: 8px;
        font-size: 13px; font-weight: 700; color: var(--text-dark);
        margin-bottom: 16px; padding-bottom: 13px; border-bottom: 1px solid var(--gray-light);
      }
      .pf-header svg { color: var(--emerald); }
      .ssl-badge {
        margin-left: auto; background: var(--emerald-lt); color: var(--emerald-ink);
        padding: 3px 10px; border-radius: 999px; font-size: 10px; font-weight: 800;
      }
      .pf-amount-box {
        background: #F0FDF4; border-radius: 14px; padding: 15px; margin-bottom: 14px;
        border: 1px solid rgba(34,197,94,0.20);
      }
      .pf-label  { font-size: 11px; color: var(--text-light); margin-bottom: 6px; }
      .pf-amount { font-size: 25px; font-weight: 800; color: var(--text-dark); font-family: var(--font-display); }
      .pf-amount span { font-size: 14px; color: var(--text-light); font-weight: 600; }
      .pf-total  { font-size: 11px; color: var(--text-light); margin-top: 4px; }
      .pf-methods { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
      .pf-method {
        display: flex; align-items: center; gap: 10px;
        background: var(--gray-bg); border-radius: 11px; padding: 11px 12px;
        border: 1.5px solid transparent;
        font-size: 13px; font-weight: 600; color: var(--text-mid);
        transition: all 0.2s;
      }
      .pf-method.selected { border-color: var(--emerald); background: #F0FDF4; }
      .pf-emoji { display: inline-flex; align-items: center; justify-content: center; width: 22px; }
      .pay-logo {
        display: block; flex-shrink: 0;
        border-radius: 6px; border: 1px solid var(--gray);
        object-fit: cover;
      }
      .pf-mname { flex: 1; }
      .pf-confirm {
        background: var(--emerald-ink);
        color: var(--white); border-radius: 12px; padding: 14px;
        text-align: center; font-size: 14px; font-weight: 700;
        display: flex; align-items: center; justify-content: center; gap: 8px;
        margin-bottom: 10px;
      }
      .pf-note {
        display: flex; align-items: center; gap: 6px;
        font-size: 11px; color: var(--text-muted); justify-content: center;
      }

      .chip-confirmed { bottom: -18px; left: -22px; animation-delay: 0.3s; }
      .chip-confirmed svg { color: var(--emerald); }
      .chip-refund { top: -16px; right: -18px; animation-delay: 0.15s; }
      .chip-refund svg { color: var(--navy-mid); }

      /* ─── BANDEAU ─── */
      .payment-banner {
        background: #0D1B3D;
        border-radius: 16px; padding: 30px 34px;
        display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
      }
      .pb-ico {
        width: 52px; height: 52px; border-radius: 16px; flex-shrink: 0;
        display: inline-flex; align-items: center; justify-content: center;
        background: rgba(34,197,94,0.16); color: var(--emerald);
      }
      .pb-text { flex: 1; min-width: 240px; color: var(--white); }
      .pb-title { font-family: var(--font-display); font-size: 19px; font-weight: 800; margin-bottom: 4px; }
      .pb-sub   { font-size: 14px; color: rgba(255,255,255,0.62); max-width: 460px; line-height: 1.55; }
      .pb-btn {
        display: inline-flex; align-items: center; gap: 8px;
        background: rgba(242,183,5,0.18); color: var(--gold-mid);
        border: 1px solid rgba(242,183,5,0.32);
        padding: 13px 24px; border-radius: 12px; font-size: 14px; font-weight: 700;
        cursor: pointer; white-space: nowrap; flex-shrink: 0; transition: all 0.25s;
      }
      .pb-btn:hover { background: rgba(242,183,5,0.30); }

      @media (max-width: 960px) {
        .payment-layout { flex-direction: column-reverse; gap: 52px; }
        .payment-features, .payment-visual { width: 100%; flex: 1 1 auto; }
        .pv-wrap { max-width: 100%; }
        .payment-banner { flex-direction: column; text-align: center; }
        .pb-text { min-width: 0; }
        .pb-sub { margin: 0 auto; }
        .pb-btn { width: 100%; justify-content: center; }
      }
      @media (max-width: 560px) {
        .payment-section { padding: 70px 16px; }
        .payment-banner { padding: 26px 20px; border-radius: 20px; }
        .chip-confirmed { left: -6px; }
        .chip-refund { right: -6px; }
      }
    `}</style>
  </section>
);

export default PaymentSection;
