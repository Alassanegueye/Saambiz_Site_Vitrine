import {
  Store, Package, ShoppingCart, Star, Lock, MessageCircle, Rocket, Smartphone,
  Wallet, Target, BarChart3, CreditCard, Bell, RefreshCw, Globe, Handshake,
  Link2, Monitor,
} from 'lucide-react';

/* Marquee KPI strip — une seule ligne défilante */
const kpis = [
  { Icon: Store,         value: '500+',    label: 'Vendeurs actifs'      },
  { Icon: Package,       value: '10 000+', label: 'Produits listés'      },
  { Icon: ShoppingCart,  value: '3 500+',  label: 'Commandes traitées'   },
  { Icon: Star,          value: '4.9/5',   label: 'Note moyenne'         },
  { Icon: Lock,          value: '100%',    label: 'Paiements sécurisés'  },
  { Icon: MessageCircle, value: '7j/7',    label: 'Support disponible'   },
  { Icon: Rocket,        value: '<5 min',  label: 'Boutique créée en'    },
  { Icon: Smartphone,    value: '2 stores',label: 'iOS & Android'        },
  { Icon: Wallet,        value: '0 XOF',   label: 'Inscription gratuite' },
  { Icon: Target,        value: '128',     label: 'Notifs par promo'     },
  { Icon: BarChart3,     value: 'Live',    label: 'Dashboard temps réel' },
  { Icon: CreditCard,    value: 'QR Card', label: 'Carte professionnelle'},
  { Icon: Bell,          value: 'Push',    label: 'Notifications client' },
  { Icon: RefreshCw,     value: '48h',     label: 'Délai remboursement'  },
  { Icon: Link2,         value: 'Lien',    label: 'Boutique web à partager' },
  { Icon: Monitor,       value: 'Web+App', label: 'Pilotage sur 2 écrans'  },
  { Icon: Globe,         value: 'SN',      label: 'Made in Sénégal'      },
  { Icon: Handshake,     value: '∞',       label: 'Abonnés par boutique' },
];

const KpiItem = ({ item }) => (
  <div className="kpi-item">
    <span className="kpi-icon"><item.Icon size={20} strokeWidth={2.2} /></span>
    <div className="kpi-text">
      <span className="kpi-val">{item.value}</span>
      <span className="kpi-lbl">{item.label}</span>
    </div>
  </div>
);

const Separator = () => <div className="kpi-sep" />;

const StatsBar = () => (
  <section className="statsbar-section" aria-label="SaamBiz en chiffres">
    {/* Ligne unique — scroll left. La seconde série n'est là que pour boucler
        visuellement : elle est masquée aux lecteurs d'écran. */}
    <div className="marquee-row">
      <div className="marquee-track track-left">
        {kpis.map((k, i) => (
          <span key={i}><KpiItem item={k} /><Separator /></span>
        ))}
        {kpis.map((k, i) => (
          <span key={`dup-${i}`} aria-hidden="true">
            <KpiItem item={k} />{i < kpis.length - 1 && <Separator />}
          </span>
        ))}
      </div>
    </div>

    <style>{`
      .statsbar-section {
        background: linear-gradient(135deg, #060F26 0%, #0D1B3D 60%, #0A1530 100%);
        padding: 20px 0; overflow: hidden; position: relative;
      }
      .statsbar-section::before,
      .statsbar-section::after {
        content: '';
        position: absolute; top: 0; bottom: 0; width: 120px; z-index: 2;
        pointer-events: none;
      }
      .statsbar-section::before {
        left: 0;
        background: linear-gradient(90deg, #060F26, transparent);
      }
      .statsbar-section::after {
        right: 0;
        background: linear-gradient(-90deg, #060F26, transparent);
      }

      .marquee-row {
        overflow: hidden; width: 100%;
        padding: 6px 0;
      }
      .marquee-track {
        display: flex; align-items: center;
        width: max-content; will-change: transform;
      }
      .track-left  { animation: scrollLeft  55s linear infinite; }
      .track-left:hover { animation-play-state: paused; }

      @keyframes scrollLeft {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }

      .kpi-item {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 6px 18px; white-space: nowrap;
      }
      .kpi-icon  { display: inline-flex; align-items: center; color: #F2B705; }
      .kpi-text  { display: flex; flex-direction: column; line-height: 1.2; }
      .kpi-val   { font-size: 14px; font-weight: 900; color: #F2B705; }
      .kpi-lbl   { font-size: 11px; color: rgba(255,255,255,0.60); font-weight: 500; }

      .kpi-sep {
        display: inline-block; width: 1px; height: 28px;
        background: rgba(255,255,255,0.12); vertical-align: middle;
        margin: 0 2px; flex-shrink: 0;
      }

      @media (max-width: 480px) {
        .kpi-item { padding: 4px 12px; }
        .kpi-val  { font-size: 13px; }
        .kpi-lbl  { font-size: 10px; }
      }
    `}</style>
  </section>
);

export default StatsBar;
