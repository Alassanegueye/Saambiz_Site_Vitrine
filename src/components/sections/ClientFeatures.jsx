import { BellRing, Search, Heart, ShoppingCart, Star, Wallet, Users, ArrowRight, CheckCircle2, Smartphone } from 'lucide-react';
import clientVisual from '../../assets/client-shopping.webp';
// Composition complète (téléphone en main, cartes « Promotion reçue »,
// « Nouvelle commande », note 4,9…) : aucune carte HTML n'est ajoutée autour.

/* Section côté acheteurs : elle leur parle directement. L'argumentaire
   vendeur est porté par les sections Vendeurs et Tarifs. */
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

        {/* VISUEL */}
        <div className="client-visual sr-r">
          <div className="client-shot">
            <img
              src={clientVisual}
              alt="Une main tient un téléphone ouvert sur l'application SaamBiz côté client : offre flash à -20 %, promotions pour vous et notifications récentes."
              className="client-hand"
              width="1151"
              height="1026"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>

    <style>{`
      .client-section {
        --client-pad: clamp(64px, 11vh, 100px);
        padding: var(--client-pad) 32px;
        background: var(--gray-bg);
        overflow: hidden;
      }
      .client-inner { max-width: 1140px; margin: 0 auto; }
      /* Le texte occupe la plus grande part ; l'image, recadrée au ras de la
         main, se colle contre lui (même fond, la jonction ne se voit pas) et
         descend jusqu'au bas de la section, d'où la main semble sortir. */
      .client-layout { display: flex; align-items: stretch; gap: 0; }
      .client-text { flex: 1 1 0; min-width: 0; position: relative; z-index: 1; padding-right: 8px; }
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
      .client-visual {
        flex: 0 0 46%; min-width: 0;
        position: relative;
      }
      .client-shot {
        position: absolute; left: 40px; bottom: calc(-1 * var(--client-pad));
        width: 108%; z-index: 0;
        /* Bord gauche adouci sur 24 px (avant les doigts) : aucun trait
           visible entre l'image et le fond de la section. */
        -webkit-mask-image: linear-gradient(to right, transparent 0, #000 24px);
        mask-image: linear-gradient(to right, transparent 0, #000 24px);
      }
      .client-hand {
        position: relative; z-index: 1;
        display: block; width: 100%; max-width: none; height: auto;
      }

      @media (max-width: 960px) {
        .client-layout { flex-direction: column; gap: 36px; }
        .client-text, .client-visual { width: 100%; flex: 1 1 auto; }
        .client-text { padding-right: 0; }
        .client-title { text-align: center !important; }
        .client-sub { text-align: center; }
        .client-text .section-badge { display: inline-flex; }
        .client-text { text-align: center; }
        .client-card { text-align: left; }
        .btn-navy { justify-content: center; }
        .note-ok { justify-content: center; }
        /* En colonne : texte d'abord, l'image en dessous, posée sur le bas
           de la section. */
        .client-shot {
          position: relative; left: 12%; bottom: auto;
          width: 100%; max-width: 560px; margin: 0 auto calc(-1 * var(--client-pad));
        }
      }
      @media (max-width: 560px) {
        .client-section { --client-pad: 70px; padding: var(--client-pad) 16px; }
        .client-grid { grid-template-columns: 1fr; }
        .btn-navy { width: 100%; }
      }
    `}</style>
  </section>
);

export default ClientFeatures;
