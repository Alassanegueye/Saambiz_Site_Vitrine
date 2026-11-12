/**
 * Le thème d'une boutique, dérivé d'UNE seule décision du vendeur : sa
 * couleur d'accent.
 *
 * Le vendeur ne compose pas une palette. Il choisit une couleur — souvent
 * celle de son logo — et le reste en découle : la couleur des boutons, des
 * liens, des icônes et du pied de page. Toutes les boutiques partagent la
 * même mise en page, sobre, sur fond blanc.
 *
 * Chaque teinte est vérifiée au contraste (WCAG) avant d'être utilisée : un
 * vendeur qui choisit un jaune or ne doit pas se retrouver avec des prix
 * jaunes sur blanc, illisibles en plein soleil — le contexte d'usage réel.
 *
 * Les couleurs sont calculées ici plutôt qu'avec color-mix() en CSS : une
 * partie des téléphones de la clientèle tourne sur un Chrome trop ancien
 * pour cette fonction.
 */

const NOIR = { r: 0, g: 0, b: 0 };
const BLANC = { r: 255, g: 255, b: 255 };
// Base de l'encre : un presque-noir neutre, que l'accent vient teinter.
const ENCRE_BASE = { r: 18, g: 20, b: 24 };

/** #RRGGBB → { r, g, b }. Retombe sur le bleu marine SaamBiz si illisible. */
function versRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!m) return { r: 13, g: 27, b: 61 };
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

const css = ({ r, g, b }) => `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
const rgba = ({ r, g, b }, a) => `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;

/** Mélange deux couleurs : t = 0 rend `a`, t = 1 rend `b`. */
function melanger(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

/** Luminance relative (WCAG). */
function luminance({ r, g, b }) {
  const c = [r, g, b].map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function contraste(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Rapproche `couleur` de `vers` (le noir par défaut) jusqu'à atteindre le
 * contraste demandé sur `fond`. La teinte est conservée : un vert reste un
 * vert, simplement plus profond.
 */
function rendreLisible(couleur, fond, cible, vers = NOIR) {
  if (contraste(couleur, fond) >= cible) return couleur;
  for (let t = 0.04; t <= 1; t += 0.04) {
    const essai = melanger(couleur, vers, t);
    if (contraste(essai, fond) >= cible) return essai;
  }
  return vers;
}

/**
 * Variables CSS à poser sur la racine du site de la boutique.
 * Le CSS ne connaît que ces noms : changer la dérivation ici suffit à
 * retoucher toutes les pages d'un coup.
 */
export function variablesTheme(accentHex, secondaireHex = null) {
  // Une couleur presque blanche ne laisserait pas voir les
  // boutons : on la fonce, en gardant sa teinte, jusqu'à ce qu'elle tienne.
  const accent = rendreLisible(versRgb(accentHex), BLANC, 1.9);

  // La page est blanche et les neutres sont fixes : un site sobre, où la
  // couleur du vendeur n'apparaît que sur ce qui se touche (boutons, liens,
  // icônes) et sur le pied de page.
  const papier = BLANC;
  const papierFonce = { r: 245, g: 246, b: 248 };
  const encre = ENCRE_BASE;
  const encreDouce = { r: 92, g: 98, b: 108 };
  const encrePale = { r: 138, g: 144, b: 154 };
  const ligne = { r: 228, g: 231, b: 236 };

  // Le bouton principal. Trois cas :
  //   – le blanc se lit sur l'accent : on garde l'accent tel quel ;
  //   – l'accent est clair (or, jaune, rose pâle) : texte foncé dessus ;
  //   – entre les deux (un bleu moyen) : on fonce l'accent jusqu'à ce que
  //     le blanc s'y lise, plutôt que d'écrire en noir sur du bleu.
  let bouton = accent;
  let surBouton = BLANC;
  if (contraste(BLANC, accent) < 4.5) {
    if (contraste(encre, accent) >= 7) surBouton = encre;
    else bouton = rendreLisible(accent, BLANC, 4.5);
  }
  const boutonSurvol = melanger(bouton, surBouton === BLANC ? NOIR : BLANC, surBouton === BLANC ? 0.16 : 0.18);

  // L'accent quand il sert de texte ou d'icône sur le papier (prix, liens).
  const accentTexte = rendreLisible(accent, papier, 4.6);

  // Le pied de page : l'accent, assombri jusqu'à une profondeur fixe. Une
  // couleur déjà sombre l'est donc moins qu'une claire : le pied garde la
  // teinte du vendeur au lieu de virer au noir.
  let pied = accent;
  for (let t = 0; t <= 1 && luminance(pied) > 0.016; t += 0.02) pied = melanger(accent, NOIR, t);

  // Le fond du haut des pages (identité de la boutique, titre des pages) :
  // l'accent fondu dans le blanc. Assez pour que chaque boutique ait sa
  // couleur dès le premier écran, assez peu pour que le texte noir reste
  // net dessus — un jaune donne un crème, un vert un vert d'eau.
  const teinte = melanger(BLANC, accent, 0.07);
  const teinteLigne = melanger(BLANC, accent, 0.16);

  // La seconde couleur choisie à la création (relevée dans le logo). Sans
  // elle, on dérive une couleur voisine de l'accent, plus claire.
  // Sans seconde couleur, les badges gardent l'orange des remises, commun à
  // toutes les boutiques, et le dégradé s'éclaircit simplement.
  const secondaireBrute = secondaireHex ? versRgb(secondaireHex) : { r: 194, g: 65, b: 12 };
  // Fond de badge : lisible avec un texte blanc ou foncé, au choix du contraste.
  const secondaire = secondaireBrute;
  const surSecondaire = contraste(BLANC, secondaire) >= 3.2 ? BLANC : encre;

  // Le grand bandeau du haut de la boutique : la couleur du vendeur, assez
  // profonde pour qu'un texte blanc s'y lise, en dégradé vers sa seconde
  // couleur. Un jaune vif devient un ambre profond, un rose un framboise.
  const haut1 = rendreLisible(accent, BLANC, 4.6);
  const haut2 = rendreLisible(
    secondaireHex ? melanger(haut1, secondaireBrute, 0.45) : melanger(haut1, BLANC, 0.22),
    BLANC,
    4.6,
  );

  return {
    '--bq-accent': css(accent),
    '--bq-accent-rgb': `${Math.round(accent.r)}, ${Math.round(accent.g)}, ${Math.round(accent.b)}`,
    '--bq-accent-texte': css(accentTexte),

    '--bq-bouton': css(bouton),
    '--bq-bouton-survol': css(boutonSurvol),
    '--bq-sur-bouton': css(surBouton),
    // Ancien nom, encore lu par quelques règles : le texte posé sur l'accent.
    '--bq-sur-accent': css(surBouton),

    '--bq-papier': css(papier),
    '--bq-papier-fonce': css(papierFonce),
    '--bq-encre': css(encre),
    '--bq-encre-douce': css(encreDouce),
    '--bq-encre-pale': css(encrePale),
    '--bq-ligne': css(ligne),

    // Voiles : fonds de pastilles, survols, anneaux.
    '--bq-voile': rgba(accent, 0.08),
    '--bq-voile-fort': rgba(accent, 0.15),
    '--bq-bordure-accent': rgba(accent, 0.32),

    '--bq-secondaire': css(secondaire),
    '--bq-sur-secondaire': css(surSecondaire),
    '--bq-haut-1': css(haut1),
    '--bq-haut-2': css(haut2),
    // Fond de page : l'accent à peine posé, pour que les cartes blanches
    // ressortent et que la boutique garde sa couleur partout.
    '--bq-fond': css(melanger(BLANC, accent, 0.045)),

    '--bq-pied': css(pied),
    '--bq-teinte': css(teinte),
    '--bq-teinte-ligne': css(teinteLigne),
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
