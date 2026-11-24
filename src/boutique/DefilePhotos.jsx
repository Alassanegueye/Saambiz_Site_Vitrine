import { useCallback, useEffect, useRef, useState } from 'react';
import { imageALaLargeur, taillesImage } from './outils';

/** Temps d'affichage d'une photo avant de passer à la suivante. */
const DELAI = 5000;
/** Durée du glissement — la même que la transition de .bq-defile__piste. */
const DUREE = 650;
/** Glissé du doigt (en pixels) à partir duquel on change de photo. */
const SEUIL = 40;

/**
 * Les photos du haut du site, qui défilent toutes seules et en boucle.
 *
 * La boucle est continue : après la dernière photo vient une copie de la
 * première ; une fois le glissement fini, la piste revient sans animation sur
 * la vraie première photo. Le client voit toujours la photo suivante arriver
 * par la droite, jamais la piste repartir en arrière.
 *
 * Le défilement s'arrête quand la souris survole le bandeau ou qu'un élément
 * y a le focus (le temps de lire, de viser le bouton), quand le bandeau sort
 * de l'écran ou que l'onglet est caché. Au doigt, on glisse d'une photo à
 * l'autre ; les points en bas mènent directement à une photo.
 *
 * `children` : ce qui se pose sur les photos (titre, bouton).
 */
export default function DefilePhotos({ photos, etiquette, className = '', children, ...attributs }) {
  const n = photos.length;
  const plusieurs = n > 1;

  // Position sur la piste : 0..n-1 les photos, n la copie de la première.
  const [index, setIndex] = useState(0);
  const [anime, setAnime] = useState(true);
  const [survol, setSurvol] = useState(false);
  const [focus, setFocus] = useState(false);
  const [visible, setVisible] = useState(true);
  const [glisse, setGlisse] = useState(false);
  const [decalage, setDecalage] = useState(0);
  // Les photos suivantes se chargent un instant après la première : elle
  // seule compte pour le premier affichage, sur un forfait mobile.
  const [chargerTout, setChargerTout] = useState(false);

  const cadre = useRef(null);
  const doigt = useRef(null);
  const aGlisse = useRef(false);

  useEffect(() => {
    if (!plusieurs) return undefined;
    const t = setTimeout(() => setChargerTout(true), 1500);
    return () => clearTimeout(t);
  }, [plusieurs]);

  // Hors de l'écran ou onglet caché : on ne fait pas tourner pour personne.
  useEffect(() => {
    const el = cadre.current;
    if (!el || !plusieurs) return undefined;
    let dansLEcran = true;
    const maj = () => setVisible(dansLEcran && document.visibilityState === 'visible');
    const obs = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(([e]) => { dansLEcran = e.isIntersecting; maj(); }, { threshold: 0.25 });
    obs?.observe(el);
    document.addEventListener('visibilitychange', maj);
    return () => {
      obs?.disconnect();
      document.removeEventListener('visibilitychange', maj);
    };
  }, [plusieurs]);

  // Défilement automatique. Le minuteur repart à chaque changement de photo,
  // y compris quand le client en a choisi une.
  const arrete = survol || focus || glisse || !visible;
  useEffect(() => {
    if (!plusieurs || arrete) return undefined;
    const t = setTimeout(() => {
      setAnime(true);
      setIndex((i) => (i >= n ? i : i + 1));
    }, DELAI);
    return () => clearTimeout(t);
  }, [index, n, plusieurs, arrete]);

  // Arrivé sur la copie de la première photo : retour sans animation sur la
  // vraie, une fois le glissement terminé. Un minuteur plutôt que
  // `transitionend`, qui ne vient pas quand l'onglet est caché.
  useEffect(() => {
    if (!plusieurs || index < n) return undefined;
    const t = setTimeout(() => {
      setAnime(false);
      setIndex(0);
    }, DUREE + 40);
    return () => clearTimeout(t);
  }, [index, n, plusieurs]);

  // L'animation revient deux images plus tard : le saut a eu le temps
  // d'être dessiné sans elle.
  useEffect(() => {
    if (anime) return undefined;
    let r2;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setAnime(true)); });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [anime]);

  const aller = useCallback((cible) => {
    setAnime(true);
    setIndex(cible);
  }, []);

  // Saut invisible vers `depart` (même image à l'écran), puis glissement vers
  // `cible` : c'est ce qui rend la boucle continue dans les deux sens.
  const sauterPuisAller = useCallback((depart, cible) => {
    setAnime(false);
    setIndex(depart);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setAnime(true);
      setIndex(cible);
    }));
  }, []);

  const suivant = () => (index >= n ? sauterPuisAller(0, 1) : aller(index + 1));
  const precedent = () => (index <= 0 ? sauterPuisAller(n, n - 1) : aller(index - 1));
  const montrer = (k) => (index >= n ? sauterPuisAller(0, k) : aller(k));

  // ── Le doigt (ou la souris) qui fait glisser les photos ──────────────
  const surAppui = (e) => {
    if (!plusieurs || (e.pointerType === 'mouse' && e.button !== 0)) return;
    doigt.current = { x: e.clientX, y: e.clientY, id: e.pointerId, actif: false, dx: 0 };
  };
  const surMouvement = (e) => {
    const d = doigt.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.actif) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      // Un geste plutôt vertical : c'est la page qu'on fait défiler.
      if (Math.abs(dy) > Math.abs(dx)) {
        doigt.current = null;
        return;
      }
      d.actif = true;
      cadre.current?.setPointerCapture?.(d.id);
      setGlisse(true);
    }
    d.dx = dx;
    setDecalage(dx);
  };
  const surRelache = () => {
    const d = doigt.current;
    doigt.current = null;
    if (!d?.actif) return;
    // Le clic qui suit un glissé n'ouvre pas le bouton posé sur la photo.
    aGlisse.current = true;
    setTimeout(() => { aGlisse.current = false; }, 0);
    setGlisse(false);
    setDecalage(0);
    if (d.dx <= -SEUIL) suivant();
    else if (d.dx >= SEUIL) precedent();
  };
  const surAnnulation = () => {
    doigt.current = null;
    setGlisse(false);
    setDecalage(0);
  };
  const surClic = (e) => {
    if (!aGlisse.current) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const actuelle = index % n;
  const piste = plusieurs ? [...photos, photos[0]] : photos;

  return (
    <div
      ref={cadre}
      className={`${className} bq-defile${glisse ? ' est-glisse' : ''}`}
      role="region"
      aria-roledescription="carrousel"
      aria-label={etiquette}
      onPointerDown={surAppui}
      onPointerMove={surMouvement}
      onPointerUp={surRelache}
      onPointerCancel={surAnnulation}
      onClickCapture={surClic}
      onDragStart={(e) => e.preventDefault()}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setSurvol(true); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setSurvol(false); }}
      onFocus={() => setFocus(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false); }}
      {...attributs}
    >
      <div
        className="bq-defile__piste"
        style={{
          transform: `translate3d(calc(${-index * 100}% + ${decalage}px), 0, 0)`,
          transition: anime && !glisse ? undefined : 'none',
        }}
      >
        {piste.map((url, k) => (
          <div
            key={k}
            className="bq-defile__diapo"
            role="group"
            aria-roledescription="photo"
            aria-label={`${(k % n) + 1} sur ${n}`}
            aria-hidden={k !== index ? true : undefined}
          >
            <img
              src={imageALaLargeur(url, 1280)}
              srcSet={taillesImage(url)}
              sizes="(min-width: 1248px) 1200px, 100vw"
              alt=""
              draggable={false}
              decoding="async"
              loading={k === 0 || chargerTout ? 'eager' : 'lazy'}
              fetchPriority={k === 0 ? 'high' : 'auto'}
            />
          </div>
        ))}
      </div>

      {children}

      {plusieurs && (
        <div className="bq-defile__points">
          {photos.map((_, k) => (
            <button
              key={k}
              type="button"
              className={`bq-defile__point${k === actuelle ? ' est-actif' : ''}`}
              onClick={() => montrer(k)}
              aria-label={`Photo ${k + 1} sur ${n}`}
              aria-current={k === actuelle ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
