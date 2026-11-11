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

/** Le numéro sur lequel écrire à la boutique : son WhatsApp, à défaut son téléphone. */
export const numeroWhatsapp = (boutique) => boutique.whatsapp || boutique.telephone || null;

/** La discussion WhatsApp avec la boutique, ouverte sur un premier message. */
export const lienWhatsappBoutique = (boutique, texte) => lienWhatsapp(
  numeroWhatsapp(boutique),
  texte || `Bonjour ${boutique.nom}, je vous contacte depuis votre site.`,
);

/**
 * La fin d'une promo, pour la carte du produit : « Jusqu'au 23 nov. », ou
 * « Dernier jour ». Rien si la date manque ou est déjà passée — une promo
 * annoncée comme finie alors que le prix est encore barré sèmerait le doute.
 */
export function finDePromo(date) {
  const d = new Date(date);
  if (!date || Number.isNaN(d.getTime())) return null;
  const reste = d.getTime() - Date.now();
  if (reste < 0) return null;
  if (reste < 864e5) return 'Dernier jour';
  return `Jusqu'au ${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
}

/**
 * Les produits en promo que la page d'accueil a déjà sous la main.
 *
 * L'API les envoie à part (`promos`) ; une API plus ancienne ne le fait pas,
 * et l'aperçu du tableau de bord n'a que le catalogue. On les retrouve alors
 * parmi les produits déjà chargés, la plus forte remise d'abord.
 */
export function promosDeLAccueil(donnees) {
  if (Array.isArray(donnees.promos)) return donnees.promos;
  const vus = new Map();
  const sources = [
    donnees.catalogue, donnees.produitsVedettes, donnees.derniersProduits, donnees.nouveautes,
    ...(donnees.sections || []).map((s) => s.produits),
  ];
  for (const liste of sources) {
    for (const p of liste || []) {
      if (p.prixBarre != null && !vus.has(p.id)) vus.set(p.id, p);
    }
  }
  return [...vus.values()].sort((a, b) => (b.remise || 0) - (a.remise || 0)).slice(0, 12);
}

/**
 * Trois produits avec photo pour la vitrine du haut de l'accueil : les plus
 * vendus d'abord, puis les derniers arrivés. Moins de trois, pas de vitrine :
 * une seule photo isolée à côté du nom ferait une bannière bancale.
 */
export function produitsEnVitrine(donnees) {
  const vus = new Map();
  const sources = [donnees.produitsVedettes, donnees.derniersProduits, donnees.catalogue];
  for (const liste of sources) {
    for (const p of liste || []) {
      if (p.image && p.disponible !== false && !vus.has(p.id)) vus.set(p.id, p);
    }
  }
  const choix = [...vus.values()].slice(0, 3);
  return choix.length === 3 ? choix : [];
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
