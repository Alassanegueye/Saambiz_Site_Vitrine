import { useCallback, useEffect, useState } from 'react';

const DELAI_NAVIGATION = 720;

/**
 * Transition vers une autre application (l'espace vendeur) : au clic, le
 * rideau s'ouvre, puis le navigateur suit le lien.
 *
 * Retourne `partir` (à poser sur le onClick du lien) et `depart` (position du
 * clic, ou null) pour afficher <RideauMarque />.
 *
 * Le lien reste un vrai lien : clic du milieu, Ctrl/Cmd + clic et mouvement
 * réduit gardent le comportement normal du navigateur.
 */
export default function useRideauMarque() {
  const [depart, setDepart] = useState(null);

  // Retour arrière depuis l'espace vendeur : la page peut sortir du cache du
  // navigateur telle qu'on l'a quittée, rideau fermé. On le retire.
  useEffect(() => {
    const auRetour = (e) => { if (e.persisted) setDepart(null); };
    window.addEventListener('pageshow', auRetour);
    return () => window.removeEventListener('pageshow', auRetour);
  }, []);

  useEffect(() => {
    if (!depart) return undefined;
    const t = setTimeout(() => window.location.assign(depart.href), DELAI_NAVIGATION);
    return () => clearTimeout(t);
  }, [depart]);

  const partir = useCallback((e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    const lien = e.currentTarget;
    const r = lien.getBoundingClientRect();
    // Page agrandie sur grand écran : les mesures sont en pixels d'écran, le
    // rideau se place en pixels de page. Le rapport entre les deux se lit sur
    // le lien lui-même (1 quand rien n'est agrandi).
    const echelle = lien.offsetWidth ? r.width / lien.offsetWidth : 1;
    setDepart({ x: (r.left + r.width / 2) / echelle, y: (r.top + r.height / 2) / echelle, href: lien.href });
  }, []);

  return { partir, depart };
}
