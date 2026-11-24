/**
 * Les options d'un produit (taille, couleur, pointure…), telles que le client
 * les choisit : sur la fiche, dans la fenêtre d'ajout rapide et dans le
 * panier, quand il change d'avis.
 *
 * Le vendeur enregistre ses options dans `attributs` sous deux formes :
 *   - une liste de textes : { tailles: ['S', 'M'], couleurs: ['Noir'] } ;
 *   - pour les couleurs, des objets : { couleurs: [{ code: '#000', nom: 'Noir' }] }.
 * Ici, tout est ramené à une seule forme. Ce qui part dans la commande est
 * toujours un TEXTE (le nom de la couleur), parce que l'API n'accepte que des
 * textes courts et que le vendeur lit « Couleur : Noir », pas un code.
 *
 * Fichier sans composant : voir l'en-tête de outils.js.
 */

/* Les couleurs saisies en toutes lettres, pour dessiner une pastille quand le
   vendeur n'a pas choisi de teinte exacte. Mêmes noms que le nuancier du
   tableau de bord. Une couleur inconnue s'affiche en texte, sans pastille
   inventée. */
const TEINTES = {
  noir: '#111111', blanc: '#FFFFFF', gris: '#9CA3AF', 'gris clair': '#D1D5DB', 'gris fonce': '#4B5563',
  rouge: '#DC2626', bordeaux: '#7F1D1D', rose: '#EC4899', 'rose pale': '#F9C9D9', fuchsia: '#C026D3',
  orange: '#F97316', jaune: '#FACC15', moutarde: '#CA8A04', dore: '#D4A017', or: '#D4A017', argent: '#C0C0C0',
  argente: '#C0C0C0', vert: '#16A34A', 'vert olive': '#6B7A2A', olive: '#6B7A2A', kaki: '#8A7F4A',
  'vert bouteille': '#0F5132', menthe: '#98E2C6', turquoise: '#14B8A6', bleu: '#2563EB', 'bleu ciel': '#7DD3FC',
  'bleu marine': '#1E2A55', marine: '#1E2A55', 'bleu nuit': '#0D1B3D', 'bleu roi': '#1D4ED8', violet: '#7C3AED',
  mauve: '#B08FD8', lilas: '#C8A2C8', marron: '#7C4A21', chocolat: '#4E2A14', camel: '#C19A6B', beige: '#E8D8B8',
  creme: '#F5EEDC', ecru: '#EFE7D2', ivoire: '#FFFFF0', saumon: '#FA8072', corail: '#FF7F50', prune: '#5B2A4E',
  multicolore: 'conic-gradient(#EF4444, #F59E0B, #22C55E, #3B82F6, #A855F7, #EF4444)',
};

const sansAccents = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Une clé d'options qui désigne des couleurs (couleurs, coloris, couleur). */
export const estCleCouleur = (cle) => /^(couleurs?|coloris|teintes?)$/i.test(sansAccents(cle));

/** La teinte d'un nom de couleur (« Bleu nuit » → #0D1B3D), ou null. */
export function teinteDuNom(nom) {
  const n = sansAccents(nom).replace(/-/g, ' ');
  if (TEINTES[n]) return TEINTES[n];
  // « Noir mat », « Rouge brique » : le premier mot suffit pour la pastille.
  const premier = n.split(/\s+/)[0];
  return TEINTES[premier] || null;
}

/** Une couleur claire, à cercler d'un trait pour qu'elle se voie sur fond blanc. */
export function estClaire(code) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(code || ''));
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) > 215;
}

/** « Tailles disponibles » → « Taille » ; sans libellé, la clé mise en forme. */
export function libelleOption(cle, libelles) {
  const brut = (libelles && libelles[cle]) || cle;
  const sans = String(brut).replace(/\s+disponibles?$/i, '').trim();
  const singulier = /^(tailles|couleurs|pointures|coloris)$/i.test(sans) ? sans.replace(/s$/i, '') : sans;
  return singulier.charAt(0).toUpperCase() + singulier.slice(1);
}

/** Une valeur saisie par le vendeur → { valeur (texte envoyé), code (pastille) }. */
function versChoix(v, couleur) {
  if (v && typeof v === 'object') {
    const nom = String(v.nom || v.libelle || v.code || '').trim();
    const code = /^#[0-9a-f]{3,8}$/i.test(String(v.code || '')) ? v.code : (couleur ? teinteDuNom(nom) : null);
    return nom ? { valeur: nom, code } : null;
  }
  const texte = String(v ?? '').trim();
  if (!texte) return null;
  if (couleur && /^#[0-9a-f]{6}$/i.test(texte)) return { valeur: texte, code: texte };
  return { valeur: texte, code: couleur ? teinteDuNom(texte) : null };
}

/**
 * Les groupes d'options d'un produit, prêts à afficher :
 * [{ cle, libelle, couleur: bool, choix: [{ valeur, code }] }].
 * Les couleurs passent en dernier : on choisit sa taille, puis sa couleur.
 */
export function groupesOptions(produit) {
  const groupes = [];
  for (const [cle, valeurs] of Object.entries(produit?.attributs || {})) {
    if (!Array.isArray(valeurs) || !valeurs.length) continue;
    const couleur = estCleCouleur(cle) || valeurs.some((v) => v && typeof v === 'object' && v.code);
    const vus = new Set();
    const choix = [];
    for (const v of valeurs) {
      const c = versChoix(v, couleur);
      if (c && !vus.has(c.valeur)) { vus.add(c.valeur); choix.push(c); }
    }
    if (choix.length) groupes.push({ cle, libelle: libelleOption(cle, produit.libelles), couleur, choix });
  }
  return groupes.sort((a, b) => Number(a.couleur) - Number(b.couleur));
}

/**
 * Les choix de départ : une option qui n'a qu'une valeur est déjà choisie —
 * demander au client de cliquer « Taille unique » n'apporte rien.
 */
export function choixParDefaut(groupes, actuels = null) {
  const depart = {};
  for (const g of groupes) {
    const actuel = actuels?.[g.cle];
    if (actuel != null && g.choix.some((c) => c.valeur === String(actuel))) depart[g.cle] = String(actuel);
    else if (g.choix.length === 1) depart[g.cle] = g.choix[0].valeur;
  }
  return depart;
}

/** Les groupes encore sans choix. */
export const optionsManquantes = (groupes, choix) => groupes.filter((g) => !choix?.[g.cle]);

/**
 * Les variantes d'une ligne pour l'affichage : « Taille : M · Couleur : Noir »,
 * avec la pastille de la couleur. Une ligne d'avant cette version n'a pas
 * gardé les options du produit : on retombe sur la clé brute.
 */
export function detailLigne(ligne) {
  const libelles = ligne.libelles || null;
  return Object.entries(ligne.variantes || {}).map(([cle, valeur]) => {
    const couleur = estCleCouleur(cle);
    let code = null;
    if (couleur) {
      const groupe = groupesOptions({ attributs: ligne.attributs || {}, libelles })
        .find((g) => g.cle === cle);
      code = groupe?.choix.find((c) => c.valeur === valeur)?.code || teinteDuNom(valeur);
    }
    return { cle, libelle: libelleOption(cle, libelles), valeur: String(valeur), code };
  });
}

/** « Taille : M · Couleur : Noir » — les options d'une ligne, en une phrase. */
export const texteLigne = (ligne) => detailLigne(ligne).map((d) => `${d.libelle} : ${d.valeur}`).join(' · ');
