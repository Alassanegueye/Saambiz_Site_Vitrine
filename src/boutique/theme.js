/**
 * Le thème d'une boutique, dérivé d'UNE seule décision du vendeur : sa
 * couleur d'accent.
 *
 * Le vendeur ne compose pas une palette. Il choisit une couleur — souvent
 * celle de son logo — et tout le reste en découle : les fonds tramés, la
 * couleur du texte sur un bouton, la teinte des bordures. C'est ce qui permet
 * de garder un site lisible quel que soit le choix, y compris un jaune vif ou
 * un noir. Laisser régler quinze couleurs, c'est garantir des sites illisibles.
 */

/** #RRGGBB → { r, g, b }. Retombe sur le bleu marine SaamBiz si illisible. */
function versRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!m) return { r: 13, g: 27, b: 61 };
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/**
 * Luminance relative (WCAG). Sert à trancher une seule question, mais la plus
 * importante : le texte posé sur cette couleur doit-il être blanc ou foncé ?
 * Un vendeur qui choisit un jaune or aurait sinon des boutons blancs sur
 * jaune, illisibles en plein soleil — le contexte d'usage réel ici.
 */
function luminance({ r, g, b }) {
  const c = [r, g, b].map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/** Assombrit une couleur vers le noir, en gardant sa teinte. */
function assombrir({ r, g, b }, part) {
  const f = (v) => Math.round(v * (1 - part));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

/**
 * Variables CSS à poser sur la racine du site de la boutique.
 * Le CSS ne connaît que ces noms : changer la dérivation ici suffit à
 * retoucher toutes les mises en page d'un coup.
 */
export function variablesTheme(accent) {
  const rgb = versRgb(accent);
  const { r, g, b } = rgb;
  const lum = luminance(rgb);

  // 0.55 plutôt que 0.5 : le point de bascule mesuré où le texte blanc
  // repasse sous le seuil de contraste AA sur les couleurs moyennes.
  const claire = lum > 0.55;

  return {
    '--bq-accent': `rgb(${r}, ${g}, ${b})`,
    '--bq-accent-rgb': `${r}, ${g}, ${b}`,

    // Texte posé SUR l'accent : blanc sur une couleur sombre, presque noir
    // sur une couleur claire. C'est ce qui rend un accent jaune utilisable.
    '--bq-sur-accent': claire ? '#12100A' : '#FFFFFF',

    // Version foncée pour les survols et les titres : la même teinte, jamais
    // un gris neutre, sinon le site perd la couleur du vendeur au survol.
    '--bq-accent-fonce': assombrir(rgb, claire ? 0.42 : 0.22),

    // Voiles : fonds de sections, bordures, puces. Exprimés en alpha pour
    // rester justes aussi bien sur blanc que sur une carte grise.
    '--bq-voile': `rgba(${r}, ${g}, ${b}, 0.08)`,
    '--bq-voile-fort': `rgba(${r}, ${g}, ${b}, 0.16)`,
    '--bq-bordure-accent': `rgba(${r}, ${g}, ${b}, 0.28)`,
    '--bq-ombre-accent': `0 10px 30px rgba(${r}, ${g}, ${b}, 0.22)`,

    // Le voile posé sur la bannière pour que le nom de la boutique reste
    // lisible quelle que soit la photo téléversée — et elles vont du studio
    // au cliché pris à contre-jour.
    '--bq-voile-banniere': claire
      ? 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.55) 100%)'
      : `linear-gradient(180deg, rgba(${r},${g},${b},0.35) 0%, rgba(0,0,0,0.62) 100%)`,
  };
}

/** Mises en page proposées. Les clés doivent rester alignées sur le backend. */
export const MODELES = {
  classique: {
    nom: 'Classique',
    resume: 'Bannière, catégories, puis les produits. Le choix sûr.',
  },
  galerie: {
    nom: 'Galerie',
    resume: 'De grandes images en premier. Pour la mode et la décoration.',
  },
  catalogue: {
    nom: 'Catalogue',
    resume: 'Une liste dense et rapide à parcourir. Pour les gros stocks.',
  },
};
