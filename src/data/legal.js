// Textes légaux de SaamBiz, ouverts en fenêtre (modale) depuis le pied de page.
// Le contenu des deux textes est dans components/layout/LegalModal.jsx.

export const company = {
  name: 'SaamBiz',
  site: 'saambiz.com',
  email: 'contact@saambiz.com',
  phone: '+221 77 592 93 90',
  phoneHref: '+221775929390',
  whatsapp: '221775929390',
  address: 'Dakar, Sénégal',
};

export const legalDocs = {
  conditions: 'Conditions générales d’utilisation',
  confidentialite: 'Politique de confidentialité',
};

// Date affichée en tête des deux textes : à modifier à chaque mise à jour
// du texte.
export const legalUpdated = '14 octobre 2026';

// Informations légales de l'entreprise. Elles n'ont pas été fournies :
// tant qu'un champ est vide, la ligne correspondante n'est pas affichée.
// Les compléter avant la mise en ligne.
export const legalIdentity = {
  legalName: '', // ex. raison sociale et forme juridique
  rccm: '',      // numéro au Registre du commerce et du crédit mobilier
  ninea: '',     // numéro d'identification fiscale
  director: '',  // directeur ou directrice de la publication
  host: '',      // hébergeur du site : nom, adresse, site web
};
