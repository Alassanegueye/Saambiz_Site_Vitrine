import { createPortal } from 'react-dom';
import LogoAnime from './LogoAnime';

/**
 * Rideau bleu marine posé entre le site et l'espace vendeur : il s'ouvre en
 * disque depuis le point (x, y) — l'icône de connexion — et le logo s'y
 * dessine pendant que la page suivante se charge.
 *
 * Rendu dans <body> : la barre de navigation a un fond flouté, et un
 * élément `position: fixed` placé à l'intérieur serait calé sur elle et non
 * sur la fenêtre.
 */
export default function RideauMarque({ x, y }) {
  return createPortal(
    <div className="rideau-marque" style={{ '--x': `${x}px`, '--y': `${y}px` }} role="status" aria-live="polite">
      <div className="rideau-marque__centre">
        <LogoAnime taille={96} variante="clair" mode="entree" />
        <p className="rideau-marque__texte">
          Espace vendeur
          <small>Ouverture…</small>
        </p>
      </div>
    </div>,
    document.body
  );
}
