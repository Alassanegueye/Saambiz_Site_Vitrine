/**
 * Les trois logos de réseaux sociaux dont la vitrine a besoin.
 *
 * lucide-react ne fournit plus d'icônes de marque depuis la version 1 : ni
 * Facebook, ni Instagram, ni TikTok. Les remplacer par un globe générique
 * rendrait les trois liens indistinguables, et un client qui cherche la page
 * Instagram d'une boutique cherche un logo Instagram — pas un rond.
 *
 * Les glyphes sont donc redessinés ici, à l'échelle de lucide (24 unités,
 * `currentColor`), pour se poser au milieu des autres icônes sans réglage.
 */

/* Le « f » dans son rond — un aplat, comme le logo officiel. */
export function Facebook({ size = 18, ...reste }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="currentColor" aria-hidden="true" focusable="false" {...reste}
    >
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

/* L'appareil photo stylisé : cadre arrondi, objectif, témoin. Tracé au trait
   pour s'accorder à l'épaisseur des icônes lucide qui l'entourent. */
export function Instagram({ size = 18, ...reste }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" focusable="false" {...reste}
    >
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* La note de musique de TikTok. */
export function TikTok({ size = 18, ...reste }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="currentColor" aria-hidden="true" focusable="false" {...reste}
    >
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06V9.69a5.67 5.67 0 0 0-.77-.05A5.68 5.68 0 1 0 15.54 15.4V9.01a7.35 7.35 0 0 0 4.31 1.38V7.3a4.29 4.29 0 0 1-3.25-1.48Z" />
    </svg>
  );
}
