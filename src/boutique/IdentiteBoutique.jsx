/**
 * Le logo de la boutique, posé selon la forme mesurée à son téléversement :
 * 'rond' (pastille), 'carre' (tuile arrondie), 'bandeau' (large, le nom est
 * déjà écrit dedans) ou 'libre' (tel quel, sur une plaque blanche). Sans
 * logo, l'initiale de la boutique, dans sa couleur.
 *
 * Le haut de l'accueil (bandeau photo et infos) est dans UneBoutique.jsx.
 */
export function LogoBoutique({ boutique, className = '' }) {
  const forme = boutique.logoForme || 'libre';
  if (boutique.logo) {
    return (
      <span className={`bq-logo bq-logo--${forme} ${className}`}>
        {/* Texte alternatif vide : le nom de la boutique est écrit juste à côté. */}
        <img src={boutique.logo} alt="" />
      </span>
    );
  }
  const initiale = (boutique.nom || '?').trim().charAt(0).toUpperCase();
  return <span className={`bq-logo bq-logo--initiale ${className}`} aria-hidden="true">{initiale}</span>;
}
