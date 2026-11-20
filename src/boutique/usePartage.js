import { useState } from 'react';

/**
 * Partager le lien de la boutique : le menu de partage du téléphone
 * (WhatsApp, SMS…) quand il existe, sinon le lien est copié et `copie`
 * passe à vrai deux secondes, le temps de le dire.
 */
export function usePartageBoutique(boutique) {
  const [copie, setCopie] = useState(false);

  const partager = async () => {
    const url = `${window.location.origin}/b/${boutique.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: boutique.nom, text: boutique.slogan || boutique.nom, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopie(true);
      setTimeout(() => setCopie(false), 2200);
    } catch {
      // Partage annulé par le client, ou presse-papier refusé : rien à dire.
    }
  };

  return { partager, copie };
}
