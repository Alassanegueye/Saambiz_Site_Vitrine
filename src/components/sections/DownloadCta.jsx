import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Check, Bell } from 'lucide-react';

const AppStoreIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);
const PlayStoreIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/>
  </svg>
);

const DownloadCta = () => {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState('idle'); // idle · error · done
  const inputRef = useRef(null);

  // L'application n'est pas encore publiée : un clic sur un badge de store
  // amène à la liste d'attente plutôt que sur un lien mort.
  const focusForm = () => {
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const submit = (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    if (!valid) { setStatus('error'); inputRef.current?.focus(); return; }
    // Pas encore de back-office : on confirme localement l'inscription.
    setStatus('done');
  };

  return (
  <section id="download" className="dl-section">
    <div className="dl-bg" aria-hidden="true">
      <div className="dl-blob dl-b1" />
      <div className="dl-blob dl-b2" />
      <div className="dl-blob dl-b3" />
    </div>

    <div className="dl-inner">
      <motion.div className="dl-content sr"
        initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }} transition={{ duration:0.7 }}>

        <div className="dl-badge">
          <Zap size={14} fill="#F2B705" color="#F2B705" />
          <span>Bientôt disponible</span>
        </div>

        <h2 className="dl-title">
          Prêt à transformer<br/>votre business ?
        </h2>

        <p className="dl-sub">
          Rejoignez les centaines de vendeurs sénégalais qui utilisent SaamBiz pour développer leur boutique mobile. Téléchargez l'application gratuitement.
        </p>

        <div className="dl-stores">
          <button type="button" className="dl-store ios-dl" onClick={focusForm}>
            <AppStoreIcon/>
            <div><small>Bientôt sur</small><strong>App Store</strong></div>
          </button>
          <button type="button" className="dl-store play-dl" onClick={focusForm}>
            <PlayStoreIcon/>
            <div><small>Bientôt sur</small><strong>Google Play</strong></div>
          </button>
        </div>

        <div className="dl-or-row">
          <div className="dl-sep"/><span>soyez prévenu dès le lancement</span><div className="dl-sep"/>
        </div>

        {status === 'done' ? (
          <div className="dl-success" role="status">
            <span className="dl-success-icon"><Check size={16} strokeWidth={3}/></span>
            <div>
              <strong>C'est noté !</strong>
              <span>Nous vous écrivons à {email.trim()} dès l'ouverture des téléchargements.</span>
            </div>
          </div>
        ) : (
          <form className="dl-notify-form" onSubmit={submit} noValidate>
            <label className="sr-only" htmlFor="dl-email">Votre adresse email</label>
            <input
              id="dl-email"
              ref={inputRef}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="votre@email.com"
              className={`dl-email ${status === 'error' ? 'invalid' : ''}`}
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
              aria-invalid={status === 'error'}
              aria-describedby="dl-email-help"
            />
            <button type="submit" className="dl-notify-btn">
              <Bell size={15} strokeWidth={2.5} />
              Me prévenir
            </button>
          </form>
        )}
        <p id="dl-email-help" className={`dl-privacy ${status === 'error' ? 'is-error' : ''}`} role={status === 'error' ? 'alert' : undefined}>
          {status === 'error'
            ? 'Adresse email invalide — vérifiez la saisie.'
            : 'Aucun spam · Votre email ne sera jamais partagé.'}
        </p>
      </motion.div>
    </div>

    <style>{`
      .dl-section {
        padding: clamp(72px, 12vh, 110px) 32px;
        position: relative; overflow: hidden;
        background: #0D1B3D;
        text-align: center; color: white;
      }
      .dl-bg { position: absolute; inset: 0; pointer-events: none; }
      .dl-blob { display: none; }
      .dl-b1 { width: 500px; height: 500px; background: rgba(13,27,61,0.50); top: -100px; right: -100px; }
      .dl-b2 { width: 400px; height: 400px; background: rgba(242,183,5,0.18); bottom: -80px; left: -80px; }
      .dl-b3 { width: 300px; height: 300px; background: rgba(34,197,94,0.10); top: 50%; left: 50%; transform: translate(-50%,-50%); }
      .dl-inner { position: relative; z-index: 2; max-width: 660px; margin: 0 auto; }
      .dl-content { display: flex; flex-direction: column; align-items: center; }
      .dl-badge {
        display: inline-flex; align-items: center; gap: 7px;
        padding: 0;
        font-size: 13px; font-weight: 600; color: #FFC93C; margin-bottom: 24px;
      }
      .dl-title {
        font-size: clamp(26px,3.2vw,40px); font-weight: 600;
        line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 20px;
        color: #FFFFFF;
      }
      .dl-sub { font-size: 17px; opacity: 0.70; line-height: 1.7; max-width: 520px; margin: 0 auto 28px; }
      .dl-stores { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; margin-bottom: 28px; }
      .dl-store {
        display: flex; align-items: center; gap: 12px;
        padding: 13px 22px; border-radius: 8px; min-width: 170px;
        border: none; font: inherit; text-align: left; cursor: pointer;
        transition: all 0.28s ease;
      }
      .dl-store:hover { opacity: 0.88; }
      .dl-store div { display: flex; flex-direction: column; line-height: 1.1; }
      .dl-store small { font-size: 11px; opacity: 0.65; }
      .dl-store strong { font-size: 16px; font-weight: 800; }
      .ios-dl  { background: white; color: #0D1B3D; box-shadow: none; }
      .play-dl { background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.22); color: white; }
      .dl-or-row {
        display: flex; align-items: center; gap: 14px;
        width: 100%; max-width: 460px; margin: 0 auto 18px;
        font-size: 13px; opacity: 0.50;
      }
      .dl-sep { flex: 1; height: 1px; background: rgba(255,255,255,0.15); }
      .dl-notify-form { display: flex; gap: 10px; width: 100%; max-width: 460px; margin-bottom: 10px; }
      .dl-email {
        flex: 1; padding: 13px 18px; border-radius: 12px;
        border: 1.5px solid rgba(255,255,255,0.18);
        background: rgba(255,255,255,0.10); color: white;
        font-size: 14px; font-family: inherit; transition: border-color 0.2s;
      }
      .dl-email::placeholder { opacity: 0.45; color: white; }
      .dl-email:focus { border-color: rgba(242,183,5,0.60); }
      .dl-email.invalid { border-color: #EF4444; background: rgba(239,68,68,0.10); }
      .dl-notify-btn {
        display: inline-flex; align-items: center; gap: 8px;
        background: #F2B705;
        color: #0D1B3D; border: none; padding: 13px 22px;
        border-radius: 8px; font-size: 14px; font-weight: 800;
        cursor: pointer; white-space: nowrap;
                transition: all 0.25s ease;
      }
      .dl-notify-btn:hover { background: #FFC93C; }
      .dl-success {
        display: flex; align-items: center; gap: 14px; text-align: left;
        width: 100%; max-width: 460px; margin-bottom: 10px;
        background: rgba(34,197,94,0.12); border: 1.5px solid rgba(34,197,94,0.35);
        border-radius: 14px; padding: 14px 18px;
      }
      .dl-success-icon {
        width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
        background: #22C55E; color: #06210F;
        display: flex; align-items: center; justify-content: center;
      }
      .dl-success div { display: flex; flex-direction: column; gap: 2px; }
      .dl-success strong { font-size: 14px; font-weight: 800; color: white; }
      .dl-success span { font-size: 12.5px; color: rgba(255,255,255,0.65); line-height: 1.5; }
      .dl-privacy { font-size: 12px; opacity: 0.40; margin-top: 6px; }
      .dl-privacy.is-error { opacity: 1; color: #FCA5A5; font-weight: 600; }
      @media (max-width: 520px) {
        .dl-section { padding: 80px 16px; }
        .dl-stores { flex-direction: column; align-items: center; }
        .dl-store { width: 100%; max-width: 280px; }
        .dl-notify-form { flex-direction: column; }
        .dl-notify-btn { width: 100%; justify-content: center; }
      }
    `}</style>
  </section>
  );
};

export default DownloadCta;
