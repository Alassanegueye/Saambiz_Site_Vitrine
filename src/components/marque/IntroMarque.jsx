import { useEffect, useState } from 'react';
import LogoAnime from './LogoAnime';

const CLE = 'saambiz.intro-vue';
const DUREE_LOGO = 1450;   // le logo a fini de se dessiner
const DUREE_SORTIE = 700;  // le rideau blanc remonte

/* Montrer l'écran d'arrivée ? Une seule fois par session, et jamais à qui a
   demandé moins d'animations : revenir sur l'accueil ne doit pas coûter une
   seconde et demie à chaque fois. */
function doitSeMontrer() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return !window.sessionStorage.getItem(CLE);
  } catch {
    return false;
  }
}

/**
 * Écran d'arrivée de saambiz.com : le logo se dessine sur fond blanc, puis le
 * rideau remonte et découvre la page. L'entrée du texte du hero est mise en
 * pause pendant ce temps (voir marque.css) pour se jouer au lever du rideau.
 *
 * Réservé à la page de SaamBiz : les sites des boutiques (/b/…) n'affichent
 * jamais la marque SaamBiz à leurs clients.
 */
export default function IntroMarque() {
  const [visible, setVisible] = useState(doitSeMontrer);
  const [sortie, setSortie] = useState(false);

  useEffect(() => {
    if (!visible) return undefined;
    const racine = document.documentElement;
    racine.dataset.intro = 'en-cours';
    try { window.sessionStorage.setItem(CLE, '1'); } catch { /* navigation privée */ }

    const t1 = setTimeout(() => {
      setSortie(true);
      delete racine.dataset.intro;
    }, DUREE_LOGO);
    const t2 = setTimeout(() => setVisible(false), DUREE_LOGO + DUREE_SORTIE);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      delete racine.dataset.intro;
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`intro-marque${sortie ? ' intro-marque--sortie' : ''}`} aria-hidden="true">
      <div className="intro-marque__centre">
        <LogoAnime taille={116} variante="couleur" mode="entree" />
        <p className="intro-marque__nom">Saam<span>Biz</span></p>
      </div>
    </div>
  );
}
