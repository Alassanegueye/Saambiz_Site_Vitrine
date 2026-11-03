import { useLayoutEffect } from 'react';

/* Largeur pour laquelle la page d'accueil est dessinée : celle d'un portable. */
const LARGEUR_REFERENCE = 1440;
/* Au-delà (écran de plus de 3600 px affiché à 100 %), on n'agrandit plus. */
const ECHELLE_MAX = 2.5;

/**
 * Grands écrans : la page d'accueil garde le rendu d'un écran de 1440 px,
 * simplement plus grand.
 *
 * Sans cela, sur un écran de 1920 ou 2560 px, tout gardait sa taille en
 * pixels : les colonnes restaient au milieu, et le texte du hero, centré
 * dans son bloc, se décollait du bord gauche pendant que l'illustration,
 * elle, s'étirait jusqu'au bord droit — d'où le grand vide à gauche. Au-delà
 * de 1440 px, la page entière est donc agrandie dans la même proportion
 * (propriété CSS `zoom` sur <html>) : mêmes marges, mêmes alignements.
 *
 * Les media queries lisent toujours la vraie largeur de l'écran : aucun
 * palier n'existe au-dessus de 1440 px, rien ne change de ce côté.
 *
 * --hauteur-ecran remplace 100vh là où une section doit remplir l'écran :
 * une unité vh grossit avec le zoom, la vraie hauteur se calcule donc ici.
 * Elle n'est posée que lorsque la page est agrandie ; sur téléphone, les
 * unités vh/svh restent en place.
 *
 * Réservé à la page de SaamBiz : les sites des boutiques (/b/…) ont leur
 * propre mise en page.
 */
export default function useEchelleEcran() {
  useLayoutEffect(() => {
    const racine = document.documentElement;

    const appliquer = () => {
      const echelle = Math.min(Math.max(window.innerWidth / LARGEUR_REFERENCE, 1), ECHELLE_MAX);
      if (echelle > 1.001) {
        racine.style.zoom = String(echelle);
        racine.style.setProperty('--hauteur-ecran', `${window.innerHeight / echelle}px`);
      } else {
        racine.style.removeProperty('zoom');
        racine.style.removeProperty('--hauteur-ecran');
      }
    };

    appliquer();
    window.addEventListener('resize', appliquer);
    return () => {
      window.removeEventListener('resize', appliquer);
      racine.style.removeProperty('zoom');
      racine.style.removeProperty('--hauteur-ecran');
    };
  }, []);
}
