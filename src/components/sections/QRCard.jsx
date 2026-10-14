import { motion } from 'framer-motion';
import { Globe, CheckCircle2, CreditCard as CardIcon, Sparkles, Smartphone, QrCode, ScanLine, Clock, Bell } from 'lucide-react';
import carteQr from '../../assets/carte-qr.png';

const Instagram = ({ size=16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const perks = [
  { icon:<Globe size={17}/>,      title:'Lien de boutique',  desc:'URL personnalisée saambiz.com/votre-boutique' },
  { icon:<Instagram size={17}/>,  title:'Réseaux sociaux',   desc:'Instagram, Facebook, WhatsApp — tout en un'  },
  { icon:<Smartphone size={17}/>, title:'Contact direct',    desc:'Numéro de téléphone ou WhatsApp'             },
  { icon:<Sparkles size={17}/>,   title:'Design premium',    desc:'Impression haute qualité, finition mate ou brillante' },
  { icon:<CardIcon size={17}/>,   title:'Livraison incluse', desc:'Livré chez vous dans les 5 à 7 jours ouvrés' },
];

const QRCard = ({ scrollTo }) => (
  <section id="qrcard" className="qrcard-section on-dark">
    <div className="qrcard-inner">
      {/* VISUEL */}
      <div className="qrcard-left sr-l">
        <div className="qrcard-visual-wrap">
          <span className="qr-glow" aria-hidden="true" />
          <motion.img src={carteQr}
            alt="Carte QR professionnelle SaamBiz — Boutique Fatou"
            className="qrcard-img"
            initial={{ opacity: 0, y: 24, rotate: -4 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }} />

          <span className="qr-soon-tape" aria-hidden="true">
            <Clock size={13} strokeWidth={2.4} />
            Bientôt disponible
          </span>

          <span className="float-chip chip-scan" aria-hidden="true">
            <ScanLine size={13} />
            Scannez, c'est ouvert
          </span>
          <span className="float-chip chip-deliver" aria-hidden="true">
            <CheckCircle2 size={13} />
            Livrée en 5–7 jours
          </span>
        </div>
      </div>

      {/* TEXTE */}
      <div className="qrcard-text sr-r">
        <div className="qr-badges">
          <div className="section-badge">
            <QrCode size={12} aria-hidden="true" />
            Carte Professionnelle
          </div>
          <div className="section-badge soon">
            <Clock size={12} aria-hidden="true" />
            Bientôt
          </div>
        </div>
        <h2 className="section-title qrcard-title">
          Votre boutique dans la poche<br />
          <em className="title-accent">de vos clients</em>
        </h2>
        <p className="qrcard-sub">
          <strong className="qr-soon-line">La carte QR n'est pas encore commandable — elle arrive bientôt.</strong>
          Elle portera un QR code unique lié à votre boutique : à partager lors des marchés, des
          événements ou avec vos clients, qui n'auront qu'à scanner pour accéder à vos produits.
        </p>

        <ul className="perks-grid">
          {perks.map((p,i) => (
            <li key={i} className={`perk-item rich-item sr sr-d${(i%3)+1}`}>
              <span className="rich-ico" aria-hidden="true">{p.icon}</span>
              <span className="rich-body">
                <strong>{p.title}</strong>
                <small>{p.desc}</small>
              </span>
            </li>
          ))}
        </ul>

        <button className="btn-gold" type="button" onClick={() => scrollTo?.('download')}>
          <Bell size={16} strokeWidth={2.4} aria-hidden="true" />
          Me prévenir du lancement
        </button>
        <p className="note-ok">
          <CheckCircle2 size={14} strokeWidth={2.4} aria-hidden="true" />
          Offerte à toutes les boutiques le jour du lancement
        </p>
      </div>
    </div>

    <style>{`
      .qrcard-section {
        padding: 100px 32px;
        position: relative; overflow: hidden;
        background: #0D1B3D;
      }
      .qrcard-inner {
        max-width: 1280px; margin: 0 auto;
        display: flex; align-items: center; gap: 72px;
        position: relative; z-index: 1;
      }

      /* ─── VISUEL ─── */
      .qrcard-left { flex: 1 1 480px; display: flex; justify-content: center; min-width: 0; }
      .qrcard-visual-wrap { position: relative; width: 100%; max-width: 460px; }
      .qr-glow {
        position: absolute; width: 380px; height: 380px;
        display: none;
        border-radius: 50%; top: 50%; left: 50%;
        transform: translate(-50%,-50%); z-index: 0; pointer-events: none;
      }
      .qrcard-img {
        position: relative; z-index: 1;
        width: 100%; height: auto;
        border-radius: 18px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.30);
      }
      /* Bandeau « bientôt » posé en travers de la carte : impossible de croire
         qu'elle est déjà commandable. */
      .qr-soon-tape {
        position: absolute; z-index: 2; top: 6px; right: -12px;
        display: inline-flex; align-items: center; gap: 7px;
        background: var(--gold);
        color: var(--navy); border-radius: 8px; padding: 7px 14px;
        font-size: 11.5px; font-weight: 800; letter-spacing: 0.3px;
        transform: rotate(6deg);
        box-shadow: none;
      }
      .qr-badges { display: flex; flex-wrap: wrap; gap: 8px; }
      .section-badge.soon {
        color: var(--gold-mid);
      }
      .qr-soon-line { display: block; color: var(--gold-mid); font-weight: 600; margin-bottom: 6px; }

      .chip-scan    { top: -16px; left: -10px; animation-delay: 0.15s; }
      .chip-scan svg { color: var(--navy-mid); }
      .chip-deliver { bottom: -18px; right: -8px; animation-delay: 0.3s; }
      .chip-deliver svg { color: var(--emerald); }

      /* ─── TEXTE ─── */
      .qrcard-text { flex: 1 1 520px; min-width: 0; }
      .qrcard-title { color: var(--white) !important; text-align: left !important; }
      .qrcard-sub { font-size: 15px; color: rgba(255,255,255,0.65); line-height: 1.75; margin: 0 0 28px; }

      .perks-grid {
        list-style: none;
        display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
        margin-bottom: 30px;
      }
      .perk-item {
        background: rgba(255,255,255,0.06); border-radius: 14px; padding: 13px 14px;
        border: 1px solid rgba(255,255,255,0.09);
        transition: background 0.25s ease, border-color 0.25s ease;
      }
      .perk-item:hover { background: rgba(255,255,255,0.11); border-color: rgba(242,183,5,0.25); }

      @media (max-width: 960px) {
        .qrcard-section { padding: 70px 20px; }
        .qrcard-inner { flex-direction: column; gap: 60px; }
        .qrcard-left, .qrcard-text { flex: 1 1 auto; width: 100%; }
        .qrcard-title { text-align: center !important; }
        .qrcard-sub { text-align: center; }
        .qrcard-text { text-align: center; }
        .qr-badges { justify-content: center; }
        .perk-item { text-align: left; }
        .btn-gold { width: 100%; justify-content: center; }
        .note-ok { justify-content: center; }
      }
      @media (max-width: 560px) {
        .perks-grid { grid-template-columns: 1fr; }
        .qr-soon-tape { right: 0; top: -10px; }
        .chip-scan { left: 0; }
        .chip-deliver { right: 0; }
      }
    `}</style>
  </section>
);

export default QRCard;
