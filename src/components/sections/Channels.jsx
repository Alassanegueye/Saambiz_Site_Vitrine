import {
  Monitor, Smartphone, Globe, BellRing, Link2, Share2, Download,
  Copy, ShoppingBag, CheckCircle2, Layers, Megaphone, Package,
} from 'lucide-react';

/* Cette section existe pour une raison précise : la boutique n'est plus
   seulement dans l'application. À sa création, elle reçoit une adresse web
   publique, et c'est ce lien qui amène les premiers clients — ils commandent
   depuis leur navigateur, sans rien installer, puis l'application prend le
   relais pour suivre plusieurs boutiques et recevoir les notifications.
   La matrice ci-dessous dit tout en un coup d'œil : deux publics (vous, vos
   clients) × deux supports (web, mobile). */

const canaux = [
  {
    ligne: 'vendeur',
    support: 'web',
    icon: <Monitor size={20} />,
    tag: 'Sur ordinateur',
    title: 'Votre tableau de bord web',
    desc: "Au clavier et sur grand écran : catalogue, stocks, commandes, promotions et statistiques, sans quitter votre bureau.",
    points: ['Produits & stocks', 'Commandes', 'Publicités', 'Statistiques'],
    offre: 'Inclus, gratuitement',
  },
  {
    ligne: 'vendeur',
    support: 'mobile',
    icon: <Smartphone size={20} />,
    tag: "Dans l'application",
    title: 'Votre tableau de bord mobile',
    desc: "Le même pilotage dans la poche : confirmez une commande, réapprovisionnez un article ou lancez une promo depuis n'importe où.",
    points: ['Alertes en direct', 'Statut en 1 geste', 'Promo en 1 minute'],
  },
  {
    ligne: 'client',
    support: 'web',
    icon: <Globe size={20} />,
    tag: 'Sur le web',
    title: 'Votre boutique en ligne',
    desc: "Un lien public créé avec votre boutique. Vos clients l'ouvrent dans leur navigateur, parcourent votre catalogue et commandent directement — sans rien installer.",
    points: ['Lien unique', 'Commande en ligne', 'Aucun téléchargement'],
    offre: 'Créé depuis votre téléphone, gratuitement',
    highlight: true,
  },
  {
    ligne: 'client',
    support: 'mobile',
    icon: <BellRing size={20} />,
    tag: "Dans l'application",
    title: "Votre boutique dans l'app",
    desc: "Vos clients s'abonnent, suivent plusieurs boutiques à la fois et reçoivent vos nouveautés et vos promotions quand ils le souhaitent.",
    points: ['Abonnement', 'Plusieurs boutiques', 'Notifications'],
  },
];

/* Le chemin que parcourt un client : du lien partagé à l'application. */
const parcours = [
  {
    num: '01',
    icon: <Share2 size={24} strokeWidth={2} />,
    title: 'Vous partagez votre lien',
    desc: 'Sur WhatsApp, en story Instagram, dans votre bio ou sur le QR code de votre boutique.',
  },
  {
    num: '02',
    icon: <ShoppingBag size={24} strokeWidth={2} />,
    title: 'Le client commande sur le web',
    desc: "Il ouvre la boutique dans son navigateur et passe commande dès la première visite.",
  },
  {
    num: '03',
    icon: <Download size={24} strokeWidth={2} />,
    title: "Puis il installe l'application",
    desc: 'Pour suivre plusieurs boutiques au même endroit et être prévenu de vos nouveautés.',
  },
];

const Channels = ({ scrollTo }) => (
  <section id="channels" className="ch-section">
    <div className="ch-inner">
      <div className="section-header sr">
        <div className="section-badge navy">
          <Layers size={12} aria-hidden="true" />
          Web &amp; mobile
        </div>
        <h2 className="section-title">
          Une boutique, <em className="title-accent">quatre portes d&apos;entrée</em>
        </h2>
        <p className="section-sub">
          Vous pilotez votre commerce depuis un ordinateur ou votre téléphone. Vos clients,
          eux, entrent par votre lien web ou par l&apos;application — c&apos;est la même boutique,
          les mêmes produits, les mêmes commandes.
        </p>
      </div>

      {/* ── Le lien de boutique, ce qui change tout ── */}
      <div className="ch-link sr">
        <div className="ch-link-head">
          <span className="ch-link-ico" aria-hidden="true"><Link2 size={18} /></span>
          <div className="ch-link-copy">
            <strong>Votre lien est créé avec votre boutique</strong>
            <small>Rien à configurer : il existe dès la première minute, et il se partage partout.</small>
          </div>
        </div>
        <div className="ch-url" role="img" aria-label="Exemple d'adresse de boutique : saambiz.com slash boutique-fatou">
          <span className="ch-url-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="ch-url-text">saambiz.com/<strong>boutique-fatou</strong></span>
          <span className="ch-url-copy" aria-hidden="true"><Copy size={13} />Copier</span>
        </div>
      </div>

      {/* ── La matrice : deux publics × deux supports ── */}
      <div className="ch-matrix">
        <div className="ch-row-label vendor sr">
          <span className="ch-row-tag"><Package size={13} aria-hidden="true" />Pour vous, le vendeur</span>
          <span className="ch-row-line" aria-hidden="true" />
        </div>
        <div className="ch-grid">
          {canaux.filter(c => c.ligne === 'vendeur').map((c, i) => (
            <article key={c.title} className={`ch-card sr sr-d${i + 1}`}>
              <header className="ch-card-head">
                <span className="ch-card-ico" aria-hidden="true">{c.icon}</span>
                <span className="ch-card-tag">{c.tag}</span>
              </header>
              <h3 className="ch-card-title">{c.title}</h3>
              <p className="ch-card-desc">{c.desc}</p>
              <ul className="ch-points">
                {c.points.map(p => (
                  <li key={p}><CheckCircle2 size={13} aria-hidden="true" />{p}</li>
                ))}
              </ul>
              {c.offre && <p className="ch-card-offre">{c.offre}</p>}
            </article>
          ))}
        </div>

        <div className="ch-row-label client sr">
          <span className="ch-row-tag"><Megaphone size={13} aria-hidden="true" />Pour vos clients, la boutique</span>
          <span className="ch-row-line" aria-hidden="true" />
        </div>
        <div className="ch-grid">
          {canaux.filter(c => c.ligne === 'client').map((c, i) => (
            <article key={c.title} className={`ch-card ${c.highlight ? 'is-highlight' : ''} sr sr-d${i + 1}`}>
              <header className="ch-card-head">
                <span className="ch-card-ico" aria-hidden="true">{c.icon}</span>
                <span className="ch-card-tag">{c.tag}</span>
                {c.highlight && <span className="ch-card-new">Nouveau</span>}
              </header>
              <h3 className="ch-card-title">{c.title}</h3>
              <p className="ch-card-desc">{c.desc}</p>
              <ul className="ch-points">
                {c.points.map(p => (
                  <li key={p}><CheckCircle2 size={13} aria-hidden="true" />{p}</li>
                ))}
              </ul>
              {c.offre && <p className="ch-card-offre">{c.offre}</p>}
            </article>
          ))}
        </div>
      </div>

      {/* ── Du lien partagé à l'application ── */}
      <div className="ch-funnel sr">
        <div className="ch-funnel-head">
          <h3 className="ch-funnel-title">Du lien partagé à l&apos;application</h3>
          <p className="ch-funnel-sub">
            La boutique web fait entrer le client ; l&apos;application le fait revenir.
          </p>
        </div>
        <ol className="ch-steps">
          {parcours.map((p, i) => (
            <li key={p.num} className={`ch-step sr sr-d${i + 1}`}>
              <span className="ch-step-ico" aria-hidden="true">
                {p.icon}
                <span className="ch-step-num">{i + 1}</span>
              </span>
              <span className="ch-step-body">
                <strong>{p.title}</strong>
                <small>{p.desc}</small>
              </span>
              {/* Trait vers l'étape suivante : il se dessine en or quand
                  l'étape apparaît à l'écran. */}
              {i < parcours.length - 1 && <span className="ch-step-arrow" aria-hidden="true" />}
            </li>
          ))}
        </ol>
        <div className="ch-funnel-cta">
          <button className="btn-gold" type="button" onClick={() => scrollTo?.('download')}>
            <Globe size={16} strokeWidth={2.4} aria-hidden="true" />
            Ouvrir ma boutique et obtenir mon lien
          </button>
          <p className="note-ok">
            <CheckCircle2 size={14} strokeWidth={2.4} aria-hidden="true" />
            Lien inclus dans toutes les offres, dès la création de la boutique
          </p>
        </div>
      </div>
    </div>

    <style>{`
      .ch-section {
        padding: clamp(64px, 11vh, 100px) 32px;
        background: var(--white);
        position: relative; overflow: hidden;
      }
      .ch-inner { max-width: 1140px; margin: 0 auto; position: relative; z-index: 1; }

      /* ─── LE LIEN ─── */
      .ch-link {
        display: flex; align-items: center; justify-content: space-between;
        flex-wrap: wrap; gap: 22px;
        margin-bottom: 44px; padding: 22px 26px;
        border-radius: var(--radius-lg);
        background: #0D1B3D;
      }
      .ch-link-head { display: flex; align-items: center; gap: 14px; min-width: 0; }
      .ch-link-ico {
        width: 42px; height: 42px; flex-shrink: 0;
        border-radius: 13px; display: grid; place-items: center;
        background: rgba(242,183,5,0.16); color: var(--gold-mid);
      }
      .ch-link-copy { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
      .ch-link-copy strong { font-size: 14.5px; font-weight: 700; color: var(--white); }
      .ch-link-copy small { font-size: 12.5px; line-height: 1.6; color: rgba(255,255,255,0.62); }

      /* Fausse barre d'adresse : on montre le lien, on ne le fait pas cliquer —
         chaque boutique a le sien, celui-ci n'est qu'un exemple. */
      .ch-url {
        display: flex; align-items: center; gap: 12px;
        padding: 10px 12px 10px 14px;
        border-radius: 12px; flex: 0 1 auto; min-width: 0;
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.12);
      }
      .ch-url-dots { display: flex; gap: 5px; flex-shrink: 0; }
      .ch-url-dots i {
        width: 8px; height: 8px; border-radius: 50%;
        background: rgba(255,255,255,0.22);
      }
      .ch-url-text {
        font-family: var(--font-body);
        font-size: 14px; color: rgba(255,255,255,0.66);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .ch-url-text strong { color: var(--gold-mid); font-weight: 700; }
      .ch-url-copy {
        display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;
        padding: 7px 12px; border-radius: 9px;
        background: var(--gold); color: var(--navy);
        font-size: 12px; font-weight: 700;
      }

      /* ─── MATRICE ─── */
      .ch-row-label { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
      .ch-row-tag {
        display: inline-flex; align-items: center; gap: 7px;
        padding: 8px 18px; border-radius: var(--radius-full);
        font-size: 13px; font-weight: 700; flex-shrink: 0;
        border: 1px solid transparent;
      }
      .ch-row-label.vendor .ch-row-tag {
        background: var(--navy-light); color: var(--navy); border-color: rgba(13,27,61,0.10);
      }
      .ch-row-label.client .ch-row-tag {
        background: var(--gold-light); color: var(--gold-ink); border-color: rgba(242,183,5,0.32);
      }
      .ch-row-line { flex: 1; height: 1px; background: var(--gray); }

      .ch-grid {
        display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 20px; margin-bottom: 34px;
      }
      .ch-card {
        position: relative; overflow: hidden;
        background: var(--white); border-radius: var(--radius-lg);
        border: 1px solid rgba(13,27,61,0.08);
        box-shadow: var(--shadow-xs);
        padding: 24px 24px 22px;
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      }
      .ch-card:hover {
        box-shadow: var(--shadow-sm);
        border-color: rgba(13,27,61,0.14);
      }
      /* La boutique web est la nouveauté : c'est elle qu'on doit regarder en premier. */
      .ch-card.is-highlight {
        border-color: rgba(242,183,5,0.42);
        background: var(--gold-ultra);
      }
      .ch-card.is-highlight::before {
        content: ''; position: absolute; inset: 0 0 auto 0; height: 3px;
        background: var(--gold);
      }

      .ch-card-head { display: flex; align-items: center; gap: 11px; margin-bottom: 14px; }
      .ch-card-ico {
        width: 42px; height: 42px; flex-shrink: 0;
        border-radius: 13px; display: grid; place-items: center;
        background: var(--navy-light); color: var(--navy);
      }
      .ch-card.is-highlight .ch-card-ico { background: var(--gold-light); color: var(--gold-ink); }
      .ch-card-tag {
        font-size: 11.5px; font-weight: 700; letter-spacing: 0.02em;
        color: var(--text-muted); text-transform: uppercase;
      }
      .ch-card-new {
        margin-left: auto; flex-shrink: 0;
        padding: 5px 11px; border-radius: var(--radius-full);
        background: var(--gold); color: var(--navy);
        font-size: 11px; font-weight: 800;
      }
      .ch-card-title {
        font-size: 17px; font-weight: 700; letter-spacing: -0.3px;
        color: var(--text-dark); margin-bottom: 8px;
      }
      .ch-card-desc {
        font-size: 13.5px; line-height: 1.65; color: var(--text-light);
        margin-bottom: 16px; text-wrap: pretty;
      }
      .ch-points { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; }
      .ch-points li {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 6px 11px; border-radius: var(--radius-full);
        background: var(--gray-light); color: var(--text-mid);
        font-size: 12px; font-weight: 600;
      }
      .ch-points svg { color: var(--emerald); flex-shrink: 0; }
      /* Rappel : ces deux-là sont ceux dont un commerçant doute qu'ils soient
         inclus — un tableau de bord sur ordinateur et un site web ressemblent
         à des options payantes. Autant le dire à l'endroit où on les découvre. */
      .ch-card-offre {
        margin-top: 14px; padding-top: 12px;
        border-top: 1px dashed rgba(13,27,61,0.12);
        font-size: 12px; font-weight: 600; color: var(--text-muted);
      }
      .ch-card.is-highlight .ch-card-offre { color: var(--gold-ink); }

      /* ─── PARCOURS ───
         Posé directement sur le fond blanc, sans bloc ni cartes. Trois
         étapes centrées, alignées sur le titre et le bouton : une pastille
         ronde par étape, son numéro en médaillon, et un trait qui relie
         chaque pastille à la suivante. Le trait se dessine en or quand les
         étapes apparaissent — de gauche à droite, du lien vers l'appli.
         La dernière pastille, l'application, est en or : c'est l'arrivée. */
      .ch-funnel { margin-top: 88px; }
      .ch-funnel-head { text-align: center; margin-bottom: 52px; }
      .ch-funnel-title {
        font-size: clamp(24px, 2.2vw, 32px); font-weight: 700; letter-spacing: -0.6px;
        line-height: 1.2; color: var(--text-dark); margin-bottom: 10px;
      }
      .ch-funnel-sub { font-size: 15px; color: var(--text-light); }

      .ch-steps {
        --ch-rond: 68px;
        list-style: none;
        display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 48px;
        max-width: 1020px; margin: 0 auto 52px;
      }
      .ch-step {
        position: relative;
        display: flex; flex-direction: column; align-items: center; gap: 22px;
        text-align: center;
      }
      .ch-step-ico {
        position: relative; z-index: 1;
        width: var(--ch-rond); height: var(--ch-rond); flex-shrink: 0;
        border-radius: 50%; display: grid; place-items: center;
        background: var(--navy); color: var(--gold);
        /* L'anneau blanc dégage la pastille du trait qui la rejoint. */
        box-shadow: 0 0 0 10px var(--white), 0 18px 32px -14px rgba(13, 27, 61, 0.6);
      }
      .ch-step-num {
        position: absolute; top: -3px; right: -3px;
        width: 26px; height: 26px; border-radius: 50%;
        display: grid; place-items: center;
        background: var(--gold); color: var(--navy);
        font-family: var(--font-display); font-size: 12.5px; font-weight: 700; line-height: 1;
        box-shadow: 0 0 0 3px var(--white);
      }
      /* L'arrivée : l'application, en or. */
      .ch-step:last-child .ch-step-ico {
        background: var(--gold); color: var(--navy);
        box-shadow: 0 0 0 10px var(--white), 0 18px 32px -14px rgba(176, 133, 11, 0.85);
      }
      .ch-step:last-child .ch-step-num { background: var(--navy); color: var(--gold); }

      .ch-step-body { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 0; }
      .ch-step-body strong {
        font-family: var(--font-display);
        font-size: 18px; font-weight: 600; letter-spacing: -0.3px; line-height: 1.3;
        color: var(--text-dark);
      }
      /* Lignes équilibrées : pas de mot seul sur la dernière ligne. */
      .ch-step-body small {
        font-size: 14px; line-height: 1.7; color: var(--text-light);
        max-width: 30ch; text-wrap: balance;
      }

      /* Trait d'une pastille à la suivante : il part du bord de l'anneau et
         s'arrête avant l'anneau suivant (centre à centre : une colonne plus
         une gouttière). Le rail gris est là d'emblée, l'or s'y dessine. */
      .ch-step-arrow {
        position: absolute; height: 2px; border-radius: 2px;
        top: calc(var(--ch-rond) / 2 - 1px);
        left: calc(50% + var(--ch-rond) / 2 + 16px);
        right: calc(-50% - 48px + var(--ch-rond) / 2 + 16px);
        background: var(--gray);
      }
      .ch-step-arrow::after {
        content: ''; position: absolute; inset: 0; border-radius: inherit;
        background: var(--gold);
        transform: scaleX(0); transform-origin: left center;
        transition: transform 0.9s cubic-bezier(0.65, 0, 0.25, 1) 0.45s;
      }
      .ch-step:nth-child(2) .ch-step-arrow::after { transition-delay: 1.25s; }
      .ch-step.sr-in .ch-step-arrow::after { transform: scaleX(1); }

      .ch-funnel-cta { display: flex; flex-direction: column; align-items: center; gap: 14px; }

      /* ─── RESPONSIVE ─── */
      @media (max-width: 900px) {
        .ch-section { padding: 70px 20px; }
        .ch-link { flex-direction: column; align-items: flex-start; padding: 20px; }
        .ch-url { width: 100%; }
        .ch-grid { grid-template-columns: 1fr; gap: 16px; }
        /* Sur téléphone, frise verticale : la pastille à gauche, le texte à
           droite, le trait descend d'une pastille à la suivante. */
        .ch-funnel { margin-top: 64px; }
        .ch-funnel-head { margin-bottom: 36px; }
        .ch-steps { --ch-rond: 54px; grid-template-columns: 1fr; gap: 34px; max-width: 520px; margin-bottom: 40px; }
        .ch-step { flex-direction: row; align-items: flex-start; gap: 20px; text-align: left; }
        .ch-step-ico { box-shadow: 0 0 0 7px var(--white), 0 14px 26px -12px rgba(13, 27, 61, 0.6); }
        .ch-step:last-child .ch-step-ico { box-shadow: 0 0 0 7px var(--white), 0 14px 26px -12px rgba(176, 133, 11, 0.85); }
        .ch-step-body { align-items: flex-start; gap: 6px; padding-top: 4px; }
        .ch-step-body strong { font-size: 17px; }
        .ch-step-body small { max-width: none; }
        .ch-step-arrow {
          width: 2px; height: auto; right: auto;
          left: calc(var(--ch-rond) / 2 - 1px);
          top: calc(var(--ch-rond) + 12px);
          bottom: -22px;
        }
        .ch-step-arrow::after { transform: scaleY(0); transform-origin: center top; }
        .ch-step.sr-in .ch-step-arrow::after { transform: scaleY(1); }
        .ch-funnel-cta .btn-gold { width: 100%; justify-content: center; }
      }
      @media (max-width: 560px) {
        .ch-section { padding: 60px 16px; }
        .ch-card { padding: 20px 18px 18px; border-radius: 18px; }
        .ch-url-text { font-size: 13px; }
        .ch-url-copy { padding: 6px 10px; }
        .ch-funnel-title { font-size: 22px; }
      }
    `}</style>
  </section>
);

export default Channels;
