import { MessageCircle } from 'lucide-react';
import { lienWhatsappBoutique } from './outils';

/**
 * Le bouton WhatsApp, en bas à droite de toutes les pages : la conversation
 * avec le vendeur s'ouvre en un appui, avec un premier message déjà écrit.
 * C'est là que se vend la plus grande partie des commandes au Sénégal ; le
 * bouton reste donc sous le pouce, où que le client soit dans le site.
 *
 * Une pastille ronde ; sur ordinateur, elle se déroule au survol et
 * affiche « Discuter sur WhatsApp ». Sans numéro renseigné, rien : un bouton qui n'ouvre rien ferait
 * douter du reste du site.
 */
export default function BoutonWhatsapp({ boutique }) {
  const lien = lienWhatsappBoutique(boutique);
  if (!lien) return null;

  return (
    <a className="bq-wa" href={lien} target="_blank" rel="noopener noreferrer"
      aria-label={`Écrire à ${boutique.nom} sur WhatsApp`}>
      <span className="bq-wa__disque">
        <MessageCircle size={26} strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="bq-wa__texte" aria-hidden="true">Discuter sur WhatsApp</span>
    </a>
  );
}
