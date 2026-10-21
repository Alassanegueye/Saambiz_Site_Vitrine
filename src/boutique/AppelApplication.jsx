import { useState } from 'react';
import { Apple, Play, Bell, X } from 'lucide-react';
// Le pictogramme SaamBiz en blanc, réduit à 96 px (voir assets/brand).
import pictoBlanc from '../assets/brand/picto-blanc-96.png';

/**
 * L'encart de bas de page qui invite le client à installer l'application
 * pour SUIVRE cette boutique : être prévenu de ses nouveautés et de ses
 * promotions. Court, une seule idée, et les deux boutons des stores.
 *
 * Toujours en bas de page, jamais en fenêtre surgissante : un client venu
 * par un lien WhatsApp veut d'abord voir les produits et les prix.
 *
 * Une croix le ferme. Rien n'est mémorisé : il revient à chaque
 * rechargement de la page.
 */

// Liens des stores, à renseigner au déploiement (VITE_LIEN_ANDROID /
// VITE_LIEN_IOS). Pour Android, l'identifiant de l'application suffit à
// construire le lien du Play Store ; pour l'App Store, il faut l'adresse
// donnée par Apple à la publication — en attendant, le bouton annonce
// « Bientôt » au lieu de mener nulle part.
const LIEN_ANDROID = import.meta.env.VITE_LIEN_ANDROID
  || 'https://play.google.com/store/apps/details?id=com.saambiz.app';
const LIEN_IOS = import.meta.env.VITE_LIEN_IOS || '';

export default function AppelApplication({ boutique, contexte = 'site' }) {
  const nom = boutique?.nom || 'cette boutique';
  const [ferme, setFerme] = useState(false);

  if (ferme) return null;

  return (
    <section className="bq-app" aria-labelledby="bq-app-titre">
      <button
        type="button"
        className="bq-app__fermer"
        onClick={() => setFerme(true)}
        aria-label="Fermer"
        title="Fermer"
      >
        <X size={20} strokeWidth={2.2} aria-hidden="true" />
      </button>
      <div className="bq-app__contenu bq-app__contenu--compact">
        <div className="bq-app__texte">
          <div className="bq-app__entete">
            <img src={pictoBlanc} alt="" className="bq-app__picto" aria-hidden="true" />
            <p className="bq-app__sur-titre">Application SaamBiz — gratuite</p>
          </div>

          <h2 id="bq-app-titre">
            {contexte === 'commande'
              ? <>Merci ! Suivez <span className="bq-app__nom">{nom}</span> pour ne rien manquer</>
              : <>Suivez <span className="bq-app__nom">{nom}</span></>}
          </h2>

          <p className="bq-app__intro">
            <Bell size={17} strokeWidth={2.2} aria-hidden="true" className="bq-app__cloche" />
            Téléchargez l'application et suivez cette boutique pour être informé
            de ses nouveautés, de ses promotions et de l'avancement de vos commandes.
          </p>
        </div>

        <div className="bq-app__stores">
          <a className="bq-store" href={LIEN_ANDROID} target="_blank" rel="noopener noreferrer">
            <Play size={20} strokeWidth={2} aria-hidden="true" />
            <span><small>Télécharger sur</small><strong>Google Play</strong></span>
          </a>
          {LIEN_IOS ? (
            <a className="bq-store" href={LIEN_IOS} target="_blank" rel="noopener noreferrer">
              <Apple size={20} strokeWidth={2} aria-hidden="true" />
              <span><small>Télécharger sur</small><strong>App Store</strong></span>
            </a>
          ) : (
            <span className="bq-store bq-store--bientot">
              <Apple size={20} strokeWidth={2} aria-hidden="true" />
              <span><small>Bientôt sur</small><strong>App Store</strong></span>
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
