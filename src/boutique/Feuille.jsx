import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

/**
 * Une fenêtre posée par-dessus la page : le panier, le choix des options.
 *
 * - Sur ordinateur, `tiroir` glisse depuis la droite, sur une largeur
 *   raisonnable (le panier n'a pas à couvrir l'écran) ; `fenetre` s'ouvre au
 *   centre.
 * - Sur téléphone, les deux deviennent un volet qui monte du bas, sans
 *   couvrir tout l'écran : on voit encore la page derrière, et on le ferme
 *   en le faisant glisser vers le bas avec le pouce, comme dans les
 *   applications.
 *
 * Échap ferme, un appui sur le voile aussi, et la page derrière ne défile
 * pas pendant l'ouverture.
 */

// Mêmes bornes que vitrine.css (.bq-feuille, max-width: 719px).
const TELEPHONE = '(max-width: 719px)';
// Au-delà de cette distance (px) — ou d'un geste rapide —, le volet se ferme.
const SEUIL_FERMETURE = 110;
const DUREE_SORTIE = 220;

export default function Feuille({
  ouvert, onFermer, mode = 'tiroir', etiquette, titre, sousTitre, pied, children, className = '',
}) {
  const panneau = useRef(null);
  const geste = useRef(null);
  const [sortie, setSortie] = useState(false);
  const minuterie = useRef(null);

  const fermer = useCallback(() => {
    if (minuterie.current) return;
    setSortie(true);
    minuterie.current = setTimeout(() => {
      minuterie.current = null;
      setSortie(false);
      onFermer();
    }, DUREE_SORTIE);
  }, [onFermer]);

  useEffect(() => () => clearTimeout(minuterie.current), []);

  useEffect(() => {
    if (!ouvert) return undefined;
    const touche = (e) => { if (e.key === 'Escape') fermer(); };
    document.addEventListener('keydown', touche);
    // Le défilement est bloqué sur <html> et non sur <body> : un <body> en
    // overflow hidden devient le conteneur de la barre collante, qui
    // remonterait alors d'autant que la page avait défilé.
    const racine = document.documentElement;
    const avant = racine.style.overflow;
    racine.style.overflow = 'hidden';
    // Le focus entre dans la fenêtre : un lecteur d'écran l'annonce, et Tab
    // ne se promène pas dans la page cachée derrière.
    const precedent = document.activeElement;
    panneau.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener('keydown', touche);
      racine.style.overflow = avant;
      if (precedent && typeof precedent.focus === 'function') precedent.focus({ preventScroll: true });
    };
  }, [ouvert, fermer]);

  /* ── Glisser vers le bas pour fermer (téléphone) ───────────────────
     Le geste part de la poignée ou de l'en-tête. On déplace le panneau
     directement (style.transform) : passer par l'état de React rendrait
     tout le contenu à chaque pixel. */
  const debut = (e) => {
    if (!window.matchMedia(TELEPHONE).matches) return;
    if (e.target.closest('button, a, input, select, textarea')) return;
    geste.current = { y: e.clientY, t: Date.now(), dy: 0, id: e.pointerId };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    if (panneau.current) panneau.current.style.transition = 'none';
  };
  const bouger = (e) => {
    const g = geste.current;
    if (!g || g.id !== e.pointerId) return;
    g.dy = Math.max(0, e.clientY - g.y);
    if (panneau.current) panneau.current.style.transform = `translateY(${g.dy}px)`;
  };
  const finir = (e) => {
    const g = geste.current;
    if (!g || g.id !== e.pointerId) return;
    geste.current = null;
    const el = panneau.current;
    if (!el) return;
    const vitesse = g.dy / Math.max(1, Date.now() - g.t);
    el.style.transition = '';
    if (g.dy > SEUIL_FERMETURE || (g.dy > 40 && vitesse > 0.6)) {
      el.style.transform = 'translateY(100%)';
      fermer();
    } else {
      el.style.transform = '';
    }
  };

  if (!ouvert) return null;

  return (
    <div className={`bq-feuille__voile ${sortie ? 'est-sortant' : ''}`} onClick={fermer} role="presentation">
      <div
        ref={panneau}
        className={`bq-feuille bq-feuille--${mode} ${sortie ? 'est-sortant' : ''} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={etiquette || (typeof titre === 'string' ? titre : undefined)}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bq-feuille__prise" onPointerDown={debut} onPointerMove={bouger}
          onPointerUp={finir} onPointerCancel={finir}>
          <span className="bq-feuille__poignee" aria-hidden="true" />
          <header className="bq-feuille__entete">
            <div className="bq-feuille__titres">
              {titre && <h2>{titre}</h2>}
              {sousTitre && <p>{sousTitre}</p>}
            </div>
            <button type="button" className="bq-feuille__fermer" onClick={fermer} aria-label="Fermer">
              <X size={19} strokeWidth={2.3} aria-hidden="true" />
            </button>
          </header>
        </div>

        <div className="bq-feuille__corps">{children}</div>
        {pied && <footer className="bq-feuille__pied">{pied}</footer>}
      </div>
    </div>
  );
}
