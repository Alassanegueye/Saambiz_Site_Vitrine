/**
 * Outils de l'aperçu : quelles origines peuvent piloter la page, et comment
 * poser les réglages en cours d'édition sur les données de la boutique.
 */
const ORIGINES = (import.meta.env.VITE_ORIGINES_APERCU || 'https://app.saambiz.com')
  .split(',').map((o) => o.trim()).filter(Boolean);

export function origineAutorisee(origine) {
  if (ORIGINES.includes(origine)) return true;
  // Le tableau de bord en développement.
  return import.meta.env.DEV && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origine);
}

export function appliquerBrouillon(donnees, b) {
  if (!b) return donnees;
  const boutique = donnees.boutique;
  const catalogue = donnees.catalogue || [];
  const parId = new Map(catalogue.map((p) => [p.id, p]));
  const blocs = b.blocs || {};

  const sections = Array.isArray(b.sectionsPerso)
    ? b.sectionsPerso.map((s) => ({
      id: s.id,
      titre: s.titre || 'Section sans nom',
      produits: (s.produitIds || []).map((id) => parId.get(id)).filter(Boolean),
    }))
    : donnees.sections;

  return {
    ...donnees,
    sections,
    boutique: {
      ...boutique,
      apropos: b.apropos ?? boutique.apropos,
      horaires: b.horaires ?? boutique.horaires,
      reseaux: b.reseaux ?? boutique.reseaux,
      theme: {
        ...boutique.theme,
        accent: b.accent || boutique.theme.accent,
        modele: b.modele || boutique.theme.modele,
        sections: { ...boutique.theme.sections, ...(b.sections || {}) },
      },
      blocs: b.blocs ? {
        icones: blocs.icones || {},
        avantages: (blocs.avantages || []).filter((a) => a.titre),
      } : boutique.blocs,
    },
  };
}
