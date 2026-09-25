import { createContext, useContext } from 'react';

/**
 * Le contexte du panier, séparé de son fournisseur.
 *
 * Même découpage que `contexts/authContexte.js` dans le dashboard vendeur, et
 * pour la même raison : le rafraîchissement à chaud de Vite ne fonctionne que
 * si un fichier n'exporte que des composants. Mettre le hook à côté du
 * fournisseur casse le rechargement de toutes les pages qui l'utilisent.
 */
export const ContextePanier = createContext(null);

export function usePanier() {
  const ctx = useContext(ContextePanier);
  if (!ctx) throw new Error('usePanier doit être utilisé dans un FournisseurPanier');
  return ctx;
}
