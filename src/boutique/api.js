/**
 * Accès réseau du site des boutiques.
 *
 * Pas d'axios ici, contrairement aux dashboards : ces routes sont publiques,
 * il n'y a ni jeton à porter, ni session à prolonger, ni file d'attente de
 * rafraîchissement. `fetch` suffit, et c'est une dépendance de moins dans un
 * bundle que des clients téléchargent sur un forfait mobile.
 */

// En développement, Vite proxifie /saambiz vers localhost:5000 : le
// navigateur ne voit qu'une seule origine et il n'y a aucun CORS à régler.
// En production, VITE_API_BASE_URL porte l'adresse réelle de l'API.
const BASE = `${(import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')}/saambiz/v1`;

/**
 * Erreur portant le message du serveur.
 *
 * L'API répond `{ success, message }` sur toute la chaîne d'erreur : c'est ce
 * message, écrit en français et sans jargon, qu'on montre au client. Inventer
 * un texte côté front reviendrait à masquer « Stock insuffisant pour "Boubou
 * brodé" (reste 2) » derrière un « une erreur est survenue » inutile.
 */
export class ErreurApi extends Error {
  constructor(message, statut) {
    super(message);
    this.name = 'ErreurApi';
    this.statut = statut;
  }
}

async function appeler(chemin, options = {}) {
  let reponse;
  try {
    reponse = await fetch(`${BASE}${chemin}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    // Panne réseau : le fetch a échoué avant d'obtenir un statut. Fréquent
    // sur une connexion mobile qui décroche entre deux quartiers.
    throw new ErreurApi('Connexion impossible. Vérifiez votre réseau et réessayez.', 0);
  }

  // Une réponse sans corps JSON (204, passerelle en panne, HTML d'erreur)
  // n'est pas une anomalie : `corps` reste nul et le statut tranche.
  let corps = null;
  try {
    corps = await reponse.json();
  } catch { /* corps illisible — déjà nul */ }

  if (!reponse.ok || (corps && corps.success === false)) {
    throw new ErreurApi(
      (corps && corps.message) || 'Une erreur est survenue.',
      reponse.status
    );
  }

  // Format unique de l'API : { success, message, data }.
  return corps ? corps.data : null;
}

/** Page d'accueil : boutique, thème, catégories, produits et avis. */
export const chargerBoutique = (slug) =>
  appeler(`/vitrine/${encodeURIComponent(slug)}`);

/** Catalogue paginé, filtré, trié. */
export const chargerProduits = (slug, params = {}) => {
  const q = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );
  return appeler(`/vitrine/${encodeURIComponent(slug)}/produits?${q}`);
};

/** Fiche d'un produit + produits similaires de la même boutique. */
export const chargerProduit = (slug, produitId) =>
  appeler(`/vitrine/${encodeURIComponent(slug)}/produits/${encodeURIComponent(produitId)}`);

/** Passage en caisse — aucun compte requis. */
export const envoyerCommande = (slug, corps) =>
  appeler(`/vitrine/${encodeURIComponent(slug)}/commande`, {
    method: 'POST',
    body: JSON.stringify(corps),
  });

/** Suivi d'une commande par sa référence et le numéro qui l'a passée. */
export const suivreCommande = (reference, telephone) =>
  appeler(
    `/vitrine/commande/${encodeURIComponent(reference)}?telephone=${encodeURIComponent(telephone)}`
  );

/** Formatage des montants — le franc CFA n'a pas de décimales. */
export const formaterPrix = (montant) =>
  `${Math.round(Number(montant) || 0).toLocaleString('fr-FR')} FCFA`;
