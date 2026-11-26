/**
 * Les étapes d'une commande, telles que le client les lit.
 *
 * Le serveur a plus de statuts que le client n'a d'étapes : « acceptée »,
 * « payée » et « confirmée » disent toutes trois « la boutique a dit oui ».
 * Un retrait sur place ne passe pas par « En route ».
 */

const LIVRAISON = [
  { cle: 'recue', libelle: 'Reçue' },
  { cle: 'confirmee', libelle: 'Confirmée' },
  { cle: 'preparation', libelle: 'En préparation' },
  { cle: 'prete', libelle: 'Prête' },
  { cle: 'route', libelle: 'En route' },
  { cle: 'livree', libelle: 'Livrée' },
];

const RETRAIT = [
  { cle: 'recue', libelle: 'Reçue' },
  { cle: 'confirmee', libelle: 'Confirmée' },
  { cle: 'preparation', libelle: 'En préparation' },
  { cle: 'prete', libelle: 'Prête' },
  { cle: 'livree', libelle: 'Récupérée' },
];

const ETAPE_DU_STATUT = {
  en_attente: 'recue',
  acceptee: 'confirmee',
  payee: 'confirmee',
  confirmee: 'confirmee',
  en_preparation: 'preparation',
  prete: 'prete',
  en_livraison: 'route',
  livree: 'livree',
};

export const etapesDe = (modeLivraison) => (modeLivraison === 'retrait' ? RETRAIT : LIVRAISON);

/** Position de la commande sur son parcours : -1 si elle en est sortie. */
export function positionDe(commande) {
  const etapes = etapesDe(commande.modeLivraison);
  return etapes.findIndex((e) => e.cle === ETAPE_DU_STATUT[commande.statut]);
}

export const estTerminee = (commande) => ['annulee', 'rejetee'].includes(commande.statut);

/** Titre et phrase de l'état courant. */
export function etatDe(commande) {
  const retrait = commande.modeLivraison === 'retrait';
  switch (commande.statut) {
    case 'en_attente':
      return { titre: 'Commande reçue', texte: 'La boutique a reçu votre commande. Elle va la confirmer, souvent par un appel.' };
    case 'acceptee':
    case 'confirmee':
      return { titre: 'Commande confirmée', texte: 'La boutique a accepté votre commande et va la préparer.' };
    case 'payee':
      return { titre: 'Paiement reçu', texte: 'Votre paiement est bien arrivé. La boutique va préparer votre commande.' };
    case 'en_preparation':
      return { titre: 'En préparation', texte: 'La boutique rassemble et emballe vos articles.' };
    case 'prete':
      return retrait
        ? { titre: 'Prête à retirer', texte: 'Votre commande vous attend à la boutique.' }
        : { titre: 'Prête à partir', texte: 'Votre colis est prêt et attend le livreur.' };
    case 'en_livraison':
      return { titre: 'En route', texte: 'Le livreur est en chemin vers votre adresse.' };
    case 'livree':
      return retrait
        ? { titre: 'Commande récupérée', texte: 'Merci pour votre achat !' }
        : { titre: 'Commande livrée', texte: 'Bonne réception, et merci pour votre achat !' };
    case 'annulee':
      return { titre: 'Commande annulée', texte: commande.annulationMotif || 'Cette commande a été annulée.' };
    case 'rejetee':
      return { titre: 'Commande refusée', texte: 'La boutique n’a pas pu accepter cette commande. Vous ne serez pas débité.' };
    default:
      return { titre: 'Commande', texte: '' };
  }
}

/** Forme lisible d'un numéro saisi : majuscules, tirets aux bons endroits. */
export function mettreEnFormeNumero(saisie) {
  const brut = String(saisie || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
  // Ancien format (CMD + année + 6) : laissé tel quel, tirets compris.
  if (/^CMD20\d{2}[0-9A-Z]{0,6}$/.test(brut) && brut.length > 7) {
    return `CMD-${brut.slice(3, 7)}-${brut.slice(7)}`;
  }
  const corps = (brut.startsWith('CMD') ? brut.slice(3) : brut).slice(0, 12);
  const groupes = corps.match(/.{1,4}/g) || [];
  return brut.length ? ['CMD', ...groupes].join('-') : '';
}


export const formaterDateHeure = (date) => {
  try {
    return new Date(date).toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};
