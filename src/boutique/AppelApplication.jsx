import { useLayoutEffect, useRef, useState } from 'react';
import { Bell, Store, LayoutGrid, X } from 'lucide-react';
import imageTelephone from '../assets/telephone-app.webp';
import { LIEN_ANDROID, LIEN_IOS, estIos } from './stores';
import { LogoGooglePlay, LogoApple } from './LogosStores';

/**
 * L'encart « Téléchargez l'application SaamBiz » — le même visuel partout.
 * Il est dessiné à une largeur fixe puis réduit pour tenir dans l'écran :
 * sur ordinateur, une carte en bas de page ; sur téléphone, la même carte en
 * miniature, en bande fixée en bas de l'écran (jamais plein écran), qu'on
 * touche pour aller au store du téléphone. Une croix le ferme ; rien n'est
 * mémorisé, il revient à chaque rechargement.
 *
 * Les deux boutons mènent aux stores. Liens réglables au déploiement
 * (VITE_LIEN_ANDROID, VITE_LIEN_IOS).
 */
/** Largeur à laquelle la carte est dessinée, avant réduction. */
const LARGEUR_CARTE = 1180;
const SEUIL_TELEPHONE = 640;

export default function AppelApplication({ boutique, contexte = 'site' }) {
  const nom = boutique?.nom || 'cette boutique';
  const [ferme, setFerme] = useState(false);
  const [ios] = useState(estIos);
  const carte = useRef(null);
  const [mesure, setMesure] = useState({ largeur: typeof window !== 'undefined' ? window.innerWidth : 1440, hauteur: 0 });

  // Réduction : la carte garde sa mise en page et rétrécit avec l'écran.
  useLayoutEffect(() => {
    if (ferme) return undefined;
    const mesurer = () => setMesure({
      largeur: document.documentElement.clientWidth || window.innerWidth,
      hauteur: carte.current?.offsetHeight || 0,
    });
    mesurer();
    window.addEventListener('resize', mesurer);
    return () => window.removeEventListener('resize', mesurer);
  }, [ferme]);

  const surTelephoneBrut = mesure.largeur <= SEUIL_TELEPHONE;
  const hauteurBande = !ferme && surTelephoneBrut
    ? Math.round(mesure.hauteur * (mesure.largeur / LARGEUR_CARTE)) : 0;

  // La bulle du panier se pose au-dessus de la bande.
  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--bq-bande-h', `${hauteurBande}px`);
    return () => document.documentElement.style.setProperty('--bq-bande-h', '0px');
  }, [hauteurBande]);

  if (ferme) return null;

  const surTelephone = mesure.largeur <= SEUIL_TELEPHONE;
  const echelle = surTelephone
    ? mesure.largeur / LARGEUR_CARTE
    : Math.min(1, (mesure.largeur - 40) / LARGEUR_CARTE);
  const hauteur = Math.round(mesure.hauteur * echelle);
  const lienStore = ios ? LIEN_IOS : LIEN_ANDROID;

  return (
    <>
    {/* Téléphone : la bande est fixe ; on réserve sa hauteur en bas de page. */}
    {surTelephone && <div style={{ height: hauteur }} aria-hidden="true" />}

    <section className={`bq-pop${surTelephone ? ' bq-pop--bande' : ''}`} aria-labelledby="bq-pop-titre">
      <div className="bq-pop__cadre" style={{ height: hauteur || undefined }}>
      <div className="bq-pop__carte" ref={carte}
        style={{ width: LARGEUR_CARTE, transform: echelle < 1 ? `scale(${echelle})` : undefined }}>
        {!surTelephone && (
          <button type="button" className="bq-pop__fermer" onClick={() => setFerme(true)} aria-label="Fermer" title="Fermer">
            <X size={22} strokeWidth={2.6} aria-hidden="true" />
          </button>
        )}

        <div className="bq-pop__texte">
          <h2 id="bq-pop-titre">
            {contexte === 'commande' ? 'Merci ! ' : ''}Téléchargez l'application{' '}
            <span>SaamBiz</span> dès maintenant !
          </h2>
          <p className="bq-pop__intro">
            Suivez {nom}, découvrez d'autres vendeurs et soyez informé des nouveautés.
          </p>
          <ul className="bq-pop__atouts">
            <li>
              <span className="bq-pop__pastille bq-pop__pastille--or"><Bell size={20} strokeWidth={2.2} fill="currentColor" /></span>
              <span><strong>Notifications</strong>des nouveautés</span>
            </li>
            <li>
              <span className="bq-pop__pastille bq-pop__pastille--bleu"><Store size={20} strokeWidth={2.2} /></span>
              <span><strong>Suivez</strong>vos boutiques préférées</span>
            </li>
            <li>
              <span className="bq-pop__pastille bq-pop__pastille--violet"><LayoutGrid size={20} strokeWidth={2.2} /></span>
              <span><strong>Découvrez</strong>plus de boutiques autour de vous</span>
            </li>
          </ul>
        </div>

        <img className="bq-pop__telephone" src={imageTelephone} alt="L'application SaamBiz sur un téléphone" loading="lazy" />

        <div className="bq-pop__stores">
          <a className="bq-pop__store" href={LIEN_ANDROID} target="_blank" rel="noopener noreferrer"
            aria-label="Télécharger SaamBiz sur Google Play">
            <LogoGooglePlay />
            <span><small>Disponible sur</small><strong>Google Play</strong></span>
          </a>
          <a className="bq-pop__store" href={LIEN_IOS} target="_blank" rel="noopener noreferrer"
            aria-label="Télécharger SaamBiz sur l'App Store">
            <LogoApple />
            <span><small>Télécharger sur</small><strong>App Store</strong></span>
          </a>
        </div>
      </div>
      </div>

      {/* Téléphone : la miniature entière mène au store du téléphone ; la
          croix garde une taille qu'on peut toucher. */}
      {surTelephone && (
        <>
          <a className="bq-pop__toucher" href={lienStore} target="_blank" rel="noopener noreferrer"
            aria-label={ios ? "Télécharger SaamBiz sur l'App Store" : 'Télécharger SaamBiz sur Google Play'} />
          <button type="button" className="bq-pop__fermer-bande" onClick={() => setFerme(true)} aria-label="Fermer">
            <X size={16} strokeWidth={2.8} aria-hidden="true" />
          </button>
        </>
      )}
    </section>
    </>
  );
}
