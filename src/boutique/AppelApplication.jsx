import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Bell, Package, Store, X } from 'lucide-react';
import imageTelephone from '../assets/telephone-app.webp';
import pictoBlanc from '../assets/brand/picto-blanc-96.png';
import { LIEN_ANDROID, LIEN_IOS, estIos } from './stores';
import { LogoGooglePlay, LogoApple } from './LogosStores';

/**
 * L'invitation à installer l'application SaamBiz.
 *
 * C'est le seul endroit du site où la plateforme parle en son nom : il porte
 * donc ses couleurs, pas celles du vendeur.
 *
 * Sur ordinateur, une carte en bas de page. Sur téléphone, sur les pages où
 * l'on parcourt (`bande`), une bande compacte fixée en bas de l'écran — on la
 * touche pour aller au store du téléphone, une croix la ferme pour la visite.
 * Ailleurs sur téléphone, la même invitation reste dans la page, pour ne pas
 * recouvrir le bouton d'achat.
 *
 * Les liens des stores se règlent au déploiement (VITE_LIEN_ANDROID,
 * VITE_LIEN_IOS).
 */

const REQUETE_TELEPHONE = '(max-width: 640px)';
function abonner(rappel) {
  const mq = window.matchMedia(REQUETE_TELEPHONE);
  mq.addEventListener('change', rappel);
  return () => mq.removeEventListener('change', rappel);
}
const surTelephone = () => window.matchMedia(REQUETE_TELEPHONE).matches;

function BoutonsStores() {
  return (
    <div className="bq-app__stores">
      <a className="bq-store-bouton" href={LIEN_ANDROID} target="_blank" rel="noopener noreferrer"
        aria-label="Télécharger SaamBiz sur Google Play">
        <LogoGooglePlay />
        <span><small>Disponible sur</small><strong>Google Play</strong></span>
      </a>
      <a className="bq-store-bouton" href={LIEN_IOS} target="_blank" rel="noopener noreferrer"
        aria-label="Télécharger SaamBiz sur l'App Store">
        <LogoApple />
        <span><small>Télécharger sur</small><strong>App Store</strong></span>
      </a>
    </div>
  );
}

export default function AppelApplication({ boutique, contexte = 'site', bande = false }) {
  const nom = boutique?.nom || 'cette boutique';
  const [ferme, setFerme] = useState(false);
  const [ios] = useState(estIos);
  const telephone = useSyncExternalStore(abonner, surTelephone, () => false);
  const enBande = bande && telephone && !ferme;
  const refBande = useRef(null);

  // La bulle du panier se pose au-dessus de la bande.
  useLayoutEffect(() => {
    const h = enBande ? refBande.current?.offsetHeight || 0 : 0;
    document.documentElement.style.setProperty('--bq-bande-h', `${h}px`);
    return () => document.documentElement.style.setProperty('--bq-bande-h', '0px');
  }, [enBande]);

  if (ferme) return null;

  if (enBande) {
    const lienStore = ios ? LIEN_IOS : LIEN_ANDROID;
    // La bande est fixe : le site réserve sa hauteur en bas de page
    // (--bq-bande-h, voir vitrine.css).
    return (
      <aside className="bq-bande" ref={refBande} aria-label="Application SaamBiz">
        <a className="bq-bande__lien" href={lienStore} target="_blank" rel="noopener noreferrer">
          <span className="bq-bande__icone"><img src={pictoBlanc} alt="" /></span>
          <span className="bq-bande__texte">
            <strong>Suivez {nom}</strong>
            <span>Sur l’application SaamBiz, gratuite</span>
          </span>
          <span className="bq-bande__installer">Installer</span>
        </a>
        <button type="button" className="bq-bande__fermer" onClick={() => setFerme(true)} aria-label="Fermer">
          <X size={16} strokeWidth={2.6} aria-hidden="true" />
        </button>
      </aside>
    );
  }

  return (
    <section className="bq-section bq-app" aria-labelledby="bq-app-titre">
      <div className="bq-app__carte">
        <button type="button" className="bq-app__fermer" onClick={() => setFerme(true)} aria-label="Fermer">
          <X size={18} strokeWidth={2.6} aria-hidden="true" />
        </button>

        <div className="bq-app__texte">
          <span className="bq-app__icone"><img src={pictoBlanc} alt="" /></span>
          <h2 id="bq-app-titre">
            {contexte === 'commande'
              ? 'Suivez votre commande dans l’application SaamBiz'
              : `Suivez ${nom} sur l’application SaamBiz`}
          </h2>
          <ul className="bq-app__atouts">
            <li><Bell size={18} strokeWidth={2.2} aria-hidden="true" /> Les nouveautés et les promos de {nom}, dès leur sortie</li>
            <li><Package size={18} strokeWidth={2.2} aria-hidden="true" /> Vos commandes et leur suivi, au même endroit</li>
            <li><Store size={18} strokeWidth={2.2} aria-hidden="true" /> D’autres boutiques près de chez vous</li>
          </ul>
          <BoutonsStores />
        </div>

        <img className="bq-app__telephone" src={imageTelephone} alt="" loading="lazy" />
      </div>
    </section>
  );
}
