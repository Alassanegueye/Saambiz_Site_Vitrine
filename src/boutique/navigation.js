import { House, LayoutGrid, BadgePercent, Store, MessageCircle } from 'lucide-react';

/**
 * Les pages du site d'une boutique, dans l'ordre du menu. Partagées par la
 * barre du haut, le menu du téléphone et le pied de page : une page ajoutée
 * ici apparaît partout à la fois.
 *
 * `aussi` : les adresses qui allument le même lien. Une fiche produit fait
 * partie de « Nos produits » ; /catalogue est l'ancienne adresse de la même
 * page, encore présente dans des liens partagés sur WhatsApp.
 */
export function pagesBoutique(slug) {
  const base = `/b/${slug}`;
  return [
    { cle: 'accueil', a: base, libelle: 'Accueil', icone: House },
    { cle: 'produits', a: `${base}/produits`, libelle: 'Nos produits', icone: LayoutGrid,
      aussi: [`${base}/catalogue`, `${base}/produit/`] },
    { cle: 'promos', a: `${base}/promos`, libelle: 'Nos promos', icone: BadgePercent },
    { cle: 'apropos', a: `${base}/a-propos`, libelle: 'À propos', icone: Store },
    { cle: 'contact', a: `${base}/contact`, libelle: 'Contact', icone: MessageCircle },
  ];
}

/** Le lien de la page affichée. L'accueil ne s'allume que sur lui-même. */
export function estPageActive(page, chemin) {
  const ici = chemin.replace(/\/+$/, '');
  if (page.cle === 'accueil') return ici === page.a;
  return ici === page.a || ici.startsWith(`${page.a}/`)
    || (page.aussi || []).some((a) => ici === a || ici.startsWith(a));
}
