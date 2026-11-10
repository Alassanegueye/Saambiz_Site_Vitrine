/**
 * Petites fonctions partagées par les pages du site d'une boutique.
 * À part des composants : un fichier de composants qui exporte aussi des
 * fonctions perd le rechargement à chaud de Vite.
 */

/** Un produit à options (taille, couleur, pointure) se choisit sur sa fiche. */
export const aDesOptions = (produit) => Object.values(produit?.attributs || {})
  .some((v) => Array.isArray(v) && v.length > 0);

/** « 4,6 » et non « 4.6 » : la clientèle lit des décimales à virgule. */
export const formaterNote = (note) => Number(note).toLocaleString('fr-FR', { maximumFractionDigits: 1 });

/** « 28 oct. 2026 » — la date d'un avis, sans l'heure. */
export const formaterDate = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

/** Lien WhatsApp — le canal réel de la vente au Sénégal. */
export function lienWhatsapp(numero, texte) {
  const propre = String(numero || '').replace(/\D/g, '');
  if (!propre) return null;
  return `https://wa.me/${propre}${texte ? `?text=${encodeURIComponent(texte)}` : ''}`;
}

/** L'adresse de la boutique sur une carte. */
export const lienCarte = (adresse) => (adresse
  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresse)}`
  : null);

/** Numéro composable : « +221 77 123 45 67 » → « tel:+221771234567 ». */
export const lienTelephone = (numero) => `tel:${String(numero || '').replace(/[^\d+]/g, '')}`;

/** « tailles : M » → « Tailles : M » ; plusieurs options séparées par une virgule. */
export const libelleVariantes = (variantes) => Object.entries(variantes || {})
  .map(([k, v]) => `${k.charAt(0).toUpperCase()}${k.slice(1)} : ${v}`)
  .join(', ');

/**
 * « +221771234567 » → « +221 77 123 45 67 ». Un numéro sénégalais se lit
 * par paires ; un autre format est rendu tel quel.
 */
export function formaterTelephone(numero) {
  const brut = String(numero || '').trim();
  const m = /^(?:\+?221)?\s*(\d{2})\s*(\d{3})\s*(\d{2})\s*(\d{2})$/.exec(brut.replace(/[.\s-]/g, ''));
  if (!m) return brut;
  return `${brut.startsWith('+') || brut.startsWith('221') ? '+221 ' : ''}${m[1]} ${m[2]} ${m[3]} ${m[4]}`;
}
