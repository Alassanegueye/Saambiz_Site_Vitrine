import { useEffect, useState } from 'react';
import { Heart, Bell, X } from 'lucide-react';
import { LIEN_ANDROID, LIEN_IOS } from './stores';
import { LogoGooglePlay, LogoApple } from './LogosStores';

const TEXTES = {
  favori: {
    icone: Heart,
    titre: 'Gardez vos coups de cœur',
    texte: "Les favoris se retrouvent dans l'application SaamBiz. Téléchargez-la gratuitement pour enregistrer ce produit.",
  },
  suivre: {
    icone: Bell,
    titre: 'Suivez cette boutique',
    texte: "Suivez {nom} dans l'application SaamBiz : vous serez prévenu de ses nouveautés et de ses promotions.",
  },
};

/**
 * Fenêtre « Téléchargez l'application », ouverte par le cœur d'un produit
 * ou le bouton « Suivre » : sur le site, ces deux actions passent par
 * l'application.
 */
export default function InviteApplication({ boutique }) {
  const [raison, setRaison] = useState(null);

  useEffect(() => {
    const ouvrir = (e) => setRaison(e.detail?.raison === 'suivre' ? 'suivre' : 'favori');
    window.addEventListener('saambiz:inviter-app', ouvrir);
    return () => window.removeEventListener('saambiz:inviter-app', ouvrir);
  }, []);

  useEffect(() => {
    if (!raison) return undefined;
    const touche = (e) => { if (e.key === 'Escape') setRaison(null); };
    document.addEventListener('keydown', touche);
    return () => document.removeEventListener('keydown', touche);
  }, [raison]);

  if (!raison) return null;
  const t = TEXTES[raison];
  const Icone = t.icone;

  return (
    <div className="bq-invite__voile" onClick={() => setRaison(null)} role="presentation">
      <div className="bq-invite" role="dialog" aria-modal="true" aria-labelledby="bq-invite-titre" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="bq-invite__fermer" onClick={() => setRaison(null)} aria-label="Fermer">
          <X size={20} strokeWidth={2.4} aria-hidden="true" />
        </button>
        <span className="bq-invite__icone"><Icone size={26} strokeWidth={2.2} aria-hidden="true" /></span>
        <h2 id="bq-invite-titre">{t.titre}</h2>
        <p>{t.texte.replace('{nom}', boutique?.nom || 'cette boutique')}</p>
        <div className="bq-invite__stores">
          <a className="bq-pop__store" href={LIEN_ANDROID} target="_blank" rel="noopener noreferrer">
            <LogoGooglePlay />
            <span><small>Disponible sur</small><strong>Google Play</strong></span>
          </a>
          <a className="bq-pop__store" href={LIEN_IOS} target="_blank" rel="noopener noreferrer">
            <LogoApple />
            <span><small>Télécharger sur</small><strong>App Store</strong></span>
          </a>
        </div>
      </div>
    </div>
  );
}
