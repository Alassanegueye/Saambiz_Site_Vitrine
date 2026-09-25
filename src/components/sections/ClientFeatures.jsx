import { BellRing, Search, Heart, ShoppingCart, Star, Wallet, Users, ArrowRight, CheckCircle2, Percent, PackageCheck, Tag, Smartphone } from 'lucide-react';
import handPhone from '../../assets/client-hand.jpg';
// Visuel détouré puis recomposé sur --gray-bg (#F7F9FC), avec le halo chaud et
// le cercle pointillé intégrés : si le fond de la section change, régénérer.

/* Section côté acheteurs : elle leur parle directement. L'argumentaire
   vendeur est porté par les sections Vendeurs, Carte QR et Tarifs. */
const features = [
  { icon:<Search size={18}/>,       title:'Explorez les boutiques',   desc:"Des centaines de boutiques locales par catégorie — ou ouvrez directement le lien web de celle qu'on vous a partagée.", tone:'navy'   },
  { icon:<Heart size={18}/>,        title:'Suivez plusieurs boutiques', desc:'Abonnez-vous à toutes celles qui vous plaisent et retrouvez leurs nouveautés dans un seul fil.',           tone:'rose'   },
  { icon:<BellRing size={18}/>,     title:'Activez les notifications', desc:'Recevez les nouveaux produits, les promotions et les réassorts des boutiques que vous suivez.',           tone:'gold'   },
  { icon:<ShoppingCart size={18}/>, title:'Commandez facilement',     desc:"Ajoutez au panier, choisissez la livraison ou le retrait, puis réglez l'acompte en ligne.",                 tone:'green'  },
  { icon:<Star size={18}/>,         title:'Notez vos achats',         desc:'Partagez votre expérience : vos avis guident les autres clients et font vivre les boutiques.',              tone:'navy'   },
  { icon:<Wallet size={18}/>,       title:'Achetez en sécurité',      desc:'Paiements chiffrés, acompte à la commande et remboursement en cas de litige.',                             tone:'green'  },
];


const ClientFeatures = ({ scrollTo }) => (
  <section id="client" className="client-section">
    <div className="client-inner">
      <div className="client-layout">
        {/* TEXTE */}
        <div className="client-text sr-l">
          <div className="section-badge gold">
            <Users size={12} aria-hidden="true" />
            Côté clients
          </div>
          <h2 className="section-title client-title">
            Une expérience d'achat<br />
            <em className="title-accent">simple et personnalisée</em>
          </h2>
          <p className="client-sub">
            Vous pouvez commander depuis le lien d'une boutique, sans rien installer. Avec
            l'application, vous suivez plusieurs boutiques au même endroit, vous gardez
            l'historique de vos commandes et vous êtes prévenu de chaque promotion.
          </p>

          <ul className="client-grid">
            {features.map((f,i) => (
              <li key={i} className={`client-card sr sr-d${(i%3)+1}`}>
                <span className={`client-ico tone-${f.tone}`} aria-hidden="true">{f.icon}</span>
                <span className="rich-body">
                  <strong>{f.title}</strong>
                  <small>{f.desc}</small>
                </span>
              </li>
            ))}
          </ul>

          <button className="btn-navy" onClick={() => scrollTo?.('download')}>
            <Smartphone size={16} strokeWidth={2.4} aria-hidden="true" />
            Télécharger l'application
            <ArrowRight size={15} strokeWidth={2.6} aria-hidden="true" />
          </button>
          <p className="note-ok">
            <CheckCircle2 size={14} strokeWidth={2.4} aria-hidden="true" />
            Gratuite, sans abonnement pour acheter
          </p>
        </div>

        {/* VISUEL — la photo déborde à droite, la section la rogne.
            Autour de la main : anneaux, pastilles et cartes qui flottent. */}
        <div className="client-visual sr-r">
          {/* Couche arrière : halo et anneaux passent DERRIÈRE la photo */}
          <div className="client-fx back" aria-hidden="true">
            <span className="client-glow" />
            {/* Deux anneaux pointillés tournant en sens inverse autour de la main */}
            <svg className="client-ring r1" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor"
                      strokeWidth="0.3" strokeDasharray="1.4 2.6" strokeLinecap="round" />
            </svg>
            <svg className="client-ring r2" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor"
                      strokeWidth="0.35" strokeDasharray="0.6 3.4" strokeLinecap="round" />
            </svg>
          </div>

          <div className="client-shot">
            <img
              src={handPhone}
              alt="Une cliente abonnée à une boutique SaamBiz reçoit ses notifications sur son écran verrouillé : nouvelle promotion, offre limitée, dernière chance."
              className="client-hand"
              width="1000"
              height="1180"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Couche avant — purement décorative, le texte utile est à gauche */}
          <div className="client-fx front" aria-hidden="true">
            {/* Une pastille qui fait le tour de l'anneau */}
            <span className="client-orbit"><i /></span>

            <div className="cfx cfx-card c1 sr sr-d1">
              <div className="cfx-in">
                <span className="cfx-ico gold"><Star size={14} fill="currentColor" /></span>
                <span className="cfx-txt"><strong>4,9</strong><small>128 avis</small></span>
              </div>
            </div>

            <div className="cfx cfx-card c2 sr sr-d3">
              <div className="cfx-in">
                <span className="cfx-ico green"><PackageCheck size={14} /></span>
                <span className="cfx-txt"><strong>Nouvelle commande</strong><small>Acompte réglé · 25 000 F</small></span>
              </div>
            </div>

            <div className="cfx cfx-card c3 sr sr-d2">
              <div className="cfx-in">
                <span className="cfx-ico navy"><BellRing size={14} /></span>
                <span className="cfx-txt"><strong>Promotion reçue</strong><small>Boutique Diarra · -20 %</small></span>
              </div>
            </div>

            <div className="cfx cfx-pill p1 sr sr-d2"><div className="cfx-in"><Percent size={18} strokeWidth={2.6} /></div></div>
            <div className="cfx cfx-pill p2 sr sr-d4"><div className="cfx-in"><Heart size={18} fill="currentColor" /></div></div>
            <div className="cfx cfx-pill p3 sr sr-d3"><div className="cfx-in"><Tag size={17} strokeWidth={2.4} /></div></div>

            <span className="cfx-dot d1" />
            <span className="cfx-dot d2" />
            <span className="cfx-dot d3" />
            <span className="cfx-dot d4" />
          </div>
        </div>
      </div>
    </div>

    <style>{`
      .client-section {
        padding: 100px 32px;
        background: var(--gray-bg);
        overflow: hidden;
      }
      .client-inner { max-width: 1280px; margin: 0 auto; }
      .client-layout { display: flex; align-items: center; gap: 64px; }
      .client-text { flex: 1 1 560px; min-width: 0; }
      .client-title { text-align: left !important; margin-bottom: 16px; }
      .client-sub { font-size: 15px; color: var(--text-light); line-height: 1.75; margin-bottom: 26px; }

      /* Cartes de fonctionnalités — deux colonnes */
      .client-grid {
        list-style: none;
        display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
        margin-bottom: 30px;
      }
      .client-card {
        display: flex; align-items: flex-start; gap: 13px;
        background: var(--white); border-radius: 16px; padding: 15px 16px;
        border: 1px solid rgba(13,27,61,0.07);
        box-shadow: 0 2px 10px rgba(13,27,61,0.05);
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
      }
      .client-card:hover {
        transform: translateY(-4px);
        border-color: rgba(13,27,61,0.14);
        box-shadow: 0 14px 32px rgba(13,27,61,0.12);
      }
      .client-ico {
        width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0; margin-top: 1px;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .client-ico.tone-navy  { background: var(--navy-light);  color: var(--navy); }
      .client-ico.tone-gold  { background: var(--gold-light);  color: var(--gold-ink); }
      .client-ico.tone-green { background: var(--emerald-lt);  color: var(--emerald-ink); }
      .client-ico.tone-rose  { background: var(--rose-lt);     color: var(--rose-ink); }

      /* ─── VISUEL ─── */
      /* La photo est composée avec le même fond que la section : elle déborde
         à droite et c'est la section qui la rogne, comme sur la maquette. */
      .client-visual {
        flex: 1 1 440px; min-width: 0;
        position: relative; align-self: stretch;
        display: flex; align-items: center;
      }
      .client-shot {
        position: relative; z-index: 1;
        width: 126%; margin-left: auto; margin-right: -26%;
      }
      .client-hand {
        position: relative; z-index: 1;
        display: block; width: 100%; max-width: none; height: auto;
      }

      /* ─── ÉLÉMENTS GRAPHIQUES AUTOUR DE LA MAIN ─── */
      /* Les deux couches décoratives se calent sur la partie VISIBLE de la
         colonne, pas sur la photo qui déborde de 26 % hors écran. */
      .client-fx { position: absolute; inset: 0; pointer-events: none; }
      .client-fx.back  { z-index: 0; }
      .client-fx.front { z-index: 2; }

      /* Halo chaud derrière la main */
      .client-glow {
        position: absolute;
        left: 14%; top: 16%; width: 78%; height: 66%;
        border-radius: 50%;
        background: radial-gradient(circle, var(--gold-glow) 0%, rgba(242,183,5,0) 68%);
        filter: blur(18px);
        animation: cfxBreathe 7s ease-in-out infinite;
      }
      /* Anneaux pointillés — sens de rotation opposés */
      .client-ring {
        position: absolute;
        left: 52%; top: 50%; width: 104%; height: auto;
        transform: translate(-50%, -50%);
        overflow: visible;
      }
      .client-ring.r1 { color: rgba(13,27,61,0.18); animation: cfxSpin 44s linear infinite; }
      .client-ring.r2 { width: 84%; color: rgba(242,183,5,0.55); animation: cfxSpin 32s linear infinite reverse; }
      @keyframes cfxSpin { to { transform: translate(-50%, -50%) rotate(360deg); } }
      @keyframes cfxBreathe {
        0%, 100% { opacity: 0.75; transform: scale(1); }
        50%      { opacity: 1;    transform: scale(1.06); }
      }

      /* Pastille qui fait le tour de l'anneau extérieur */
      .client-orbit {
        position: absolute;
        left: 52%; top: 50%; width: 104%; aspect-ratio: 1;
        transform: translate(-50%, -50%);
        animation: cfxSpin 26s linear infinite;
        pointer-events: none;
      }
      .client-orbit i {
        position: absolute; left: 50%; top: -7px;
        width: 14px; height: 14px; margin-left: -7px;
        border-radius: 50%; background: var(--gold);
        box-shadow: 0 0 0 5px rgba(242,183,5,0.18);
      }

      /* Cartes et pastilles flottantes */
      .cfx { position: absolute; }
      .cfx-in { animation: cfxFloat 6s ease-in-out infinite; }

      .cfx-card .cfx-in {
        display: flex; align-items: center; gap: 10px;
        background: var(--white); border: 1px solid rgba(13,27,61,0.07);
        border-radius: 14px; padding: 9px 14px 9px 10px;
        box-shadow: 0 10px 30px rgba(13,27,61,0.14);
        white-space: nowrap;
      }
      .cfx-ico {
        width: 30px; height: 30px; border-radius: 10px; flex-shrink: 0;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .cfx-ico.gold  { background: var(--gold-light);  color: var(--gold-ink); }
      .cfx-ico.green { background: var(--emerald-lt);  color: var(--emerald-ink); }
      .cfx-ico.navy  { background: var(--navy-light);  color: var(--navy); }
      .cfx-txt { display: flex; flex-direction: column; line-height: 1.2; }
      .cfx-txt strong { font-size: 12.5px; font-weight: 700; color: var(--text-dark); }
      .cfx-txt small  { font-size: 10.5px; color: var(--text-light); }

      .cfx-pill .cfx-in {
        width: 52px; height: 52px; border-radius: 18px;
        display: flex; align-items: center; justify-content: center;
        background: var(--white); border: 1px solid rgba(13,27,61,0.07);
        box-shadow: 0 10px 28px rgba(13,27,61,0.16);
      }
      .p1 .cfx-in { background: var(--gold); color: var(--navy); border-color: transparent; box-shadow: 0 10px 28px rgba(242,183,5,0.42); }
      .p2 .cfx-in { color: var(--rose); }
      .p3 .cfx-in { color: var(--navy); }

      /* Positions — en % de la colonne visible, jamais sur l'écran du téléphone */
      .c1 { top: 4%;     right: 0;    }
      .c2 { bottom: 6%;  left: -2%;   }
      .c3 { top: 32%;    right: -3%;  }
      .p1 { top: 12%;    left: -3%;   }
      .p2 { top: 50%;    right: 1%;   }
      .p3 { bottom: 26%; left: -4%;   }

      .cfx-card.c1 .cfx-in { animation-duration: 5.4s; }
      .cfx-card.c2 .cfx-in { animation-duration: 6.8s; animation-delay: -1.6s; }
      .cfx-card.c3 .cfx-in { animation-duration: 6.1s; animation-delay: -3.2s; }
      .p1 .cfx-in { animation-duration: 5s;   animation-delay: -0.8s; }
      .p2 .cfx-in { animation-duration: 7.2s; animation-delay: -2.4s; }
      .p3 .cfx-in { animation-duration: 5.8s; animation-delay: -4s; }
      @keyframes cfxFloat {
        0%, 100% { transform: translate3d(0, 0, 0); }
        50%      { transform: translate3d(0, -13px, 0); }
      }

      /* Points scintillants */
      .cfx-dot {
        position: absolute; width: 9px; height: 9px; border-radius: 50%;
        background: var(--gold);
        animation: cfxPulse 3.4s ease-in-out infinite;
      }
      .cfx-dot.d1 { top: 22%; right: 26%; }
      .cfx-dot.d2 { top: 64%; left: 5%;   background: var(--navy); animation-delay: -0.9s; }
      .cfx-dot.d3 { bottom: 18%; right: 32%; animation-delay: -1.8s; }
      .cfx-dot.d4 { top: 6%;  left: 30%;  background: var(--emerald); animation-delay: -2.6s; }
      @keyframes cfxPulse {
        0%, 100% { opacity: 0.25; transform: scale(0.6); }
        50%      { opacity: 1;    transform: scale(1); }
      }

      @media (max-width: 960px) {
        .client-layout { flex-direction: column-reverse; gap: 52px; }
        .client-text, .client-visual { width: 100%; flex: 1 1 auto; }
        .client-title { text-align: center !important; }
        .client-sub { text-align: center; }
        .client-text .section-badge { display: inline-flex; }
        .client-text { text-align: center; }
        .client-card { text-align: left; }
        .btn-navy { justify-content: center; }
        .note-ok { justify-content: center; }
        /* En colonne, la photo est calée à gauche et déborde à droite pour que
           la coupe du bras tombe hors de l'écran, comme en version large. */
        .client-visual { align-self: auto; justify-content: flex-start; }
        .client-shot { width: 118%; margin: 0; }
      }
      @media (max-width: 700px) {
        /* Les cartes deviendraient plus larges que la photo : on ne garde
           que les pastilles et les anneaux autour de la main. */
        .cfx-card { display: none; }
        .cfx-pill .cfx-in { width: 44px; height: 44px; border-radius: 15px; }
        .p1 { left: 0; } .p3 { left: 0; }
      }
      @media (max-width: 560px) {
        .client-section { padding: 70px 16px; }
        .client-grid { grid-template-columns: 1fr; }
        .btn-navy { width: 100%; }
        .client-shot { width: 124%; }
      }
    `}</style>
  </section>
);

export default ClientFeatures;
