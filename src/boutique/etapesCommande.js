
/**
 * Le parcours d'une commande, vu par le client.
 *
 * Le backend connaît dix statuts ; le client n'a pas à en apprendre dix. Ils
 * sont donc ramenés à six étapes, et trois d'entre eux — `acceptee`, `payee`,
 * `confirmee` — tombent sur la même : « le vendeur a dit oui ». Ils décrivent
 * la même avancée, par des chemins différents (accord simple, paiement en
 * ligne, paiement à la livraison), et le backend les fait tous converger vers
 * « en préparation ».
 *
 * Cette liste en comptait six et n'en connaissait que six : `acceptee`,
 * `rejetee` et `payee` n'y figuraient pas. Une commande acceptée par le
 * vendeur n'allumait donc AUCUNE étape — le client voyait une barre vide et
 * pouvait croire que rien ne bougeait.
 */

export const ETAPES = [
  { cle: 'recue', libelle: 'Commande reçue', texte: 'Le vendeur a été prévenu.' },
  { cle: 'acceptee', libelle: 'Acceptée', texte: 'Le vendeur a accepté votre commande.' },
  { cle: 'en_preparation', libelle: 'En préparation', texte: 'Vos articles sont rassemblés.' },
  { cle: 'prete', libelle: 'Prête', texte: 'Votre commande est prête.' },
  { cle: 'en_livraison', libelle: 'En route', texte: 'Le livreur est en chemin.' },
  { cle: 'livree', libelle: 'Livrée', texte: 'Bonne réception !' },
];

/** Du statut du backend vers l'étape montrée au client. */
export const ETAPE_DU_STATUT = {
  en_attente: 'recue',
  acceptee: 'acceptee',
  payee: 'acceptee',
  confirmee: 'acceptee',
  en_preparation: 'en_preparation',
  prete: 'prete',
  en_livraison: 'en_livraison',
  livree: 'livree',
};

/** Les deux fins qui ne sont pas des étapes du parcours. */
export const ARRETS = {
  annulee: 'Cette commande a été annulée. Contactez le vendeur si c’est une erreur.',
  rejetee: 'Le vendeur n’a pas pu accepter cette commande. Vous ne serez pas débité.',
};

/** Le mot juste pour un statut, y compris ceux qui arrêtent le parcours. */
export function libelleStatut(statut) {
  if (ARRETS[statut]) return statut === 'annulee' ? 'Annulée' : 'Refusée';
  const etape = ETAPES.find((e) => e.cle === ETAPE_DU_STATUT[statut]);
  if (!etape) return 'En cours';
  // « Payée » mérite son mot : le client veut lire que son argent est arrivé.
  if (statut === 'payee') return 'Payée';
  return etape.libelle;
}
