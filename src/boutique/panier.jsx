import { useEffect, useMemo, useState, useCallback } from 'react';
import { ContextePanier } from './panierContexte';

/**
 * Le panier du client, sur le site d'une boutique.
 *
 * Trois décisions qui portent tout le reste :
 *
 *   1. Un panier PAR BOUTIQUE. La clé de stockage contient le slug. Le
 *      backend refuse déjà une commande qui mélange deux vendeurs ; un panier
 *      global laisserait le client remplir dix articles avant de se le voir
 *      dire au moment de payer.
 *
 *   2. localStorage et non sessionStorage — l'inverse du choix fait dans les
 *      dashboards. Sur un poste partagé, une session d'administration qui
 *      survit à la fermeture du navigateur est un risque ; un panier qui
 *      survit, lui, est un service. Le client qui ferme son navigateur pour
 *      demander un avis, ou dont le téléphone s'éteint faute de batterie,
 *      retrouve sa sélection. Il n'y a rien de sensible dedans : des
 *      identifiants de produits et des quantités.
 *
 *   3. Une ligne par produit ET par jeu de variantes. Deux tailles d'un même
 *      boubou sont deux lignes, sinon choisir « L » après « M » écraserait le
 *      premier choix sans que rien ne le signale.
 *
 * Le fournisseur est monté avec `key={slug}` par BoutiqueLayout : changer de
 * boutique le remonte, et l'état repart du stockage de la nouvelle. C'est la
 * façon dont React remet un état à zéro — pas un effet qui le réécrit après
 * coup, lequel rendrait d'abord le panier de la boutique précédente.
 */

const ClePanier = (slug) => `saambiz.panier.${slug}`;

/** Identifie une ligne : le produit, plus les variantes choisies. */
function cleLigne(produitId, variantes) {
  const suffixe = Object.entries(variantes || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('|');
  return suffixe ? `${produitId}#${suffixe}` : produitId;
}

function lireStockage(slug) {
  try {
    const brut = localStorage.getItem(ClePanier(slug));
    const lignes = brut ? JSON.parse(brut) : [];
    return Array.isArray(lignes) ? lignes : [];
  } catch {
    // Stockage indisponible (navigation privée sur iOS, quota plein) ou
    // contenu corrompu : le panier repart vide plutôt que de casser la page.
    return [];
  }
}

export function FournisseurPanier({ slug, children }) {
  const [lignes, setLignes] = useState(() => lireStockage(slug));

  useEffect(() => {
    try {
      localStorage.setItem(ClePanier(slug), JSON.stringify(lignes));
    } catch {
      // Quota dépassé : le panier reste utilisable en mémoire pour cette
      // visite. Échouer ici bloquerait une commande pour une raison que le
      // client ne peut ni comprendre ni corriger.
    }
  }, [slug, lignes]);

  const ajouter = useCallback((produit, quantite = 1, variantes = null) => {
    const cle = cleLigne(produit.id, variantes);
    setLignes((actuelles) => {
      const existante = actuelles.find((l) => l.cle === cle);
      if (existante) {
        return actuelles.map((l) =>
          l.cle === cle ? { ...l, quantite: Math.min(l.quantite + quantite, 99) } : l
        );
      }
      // On enregistre une photographie du produit : nom, prix et image au
      // moment de l'ajout. Le panier reste donc lisible hors ligne, sans
      // recharger la fiche. Les prix sont revérifiés côté serveur au passage
      // en caisse — un panier vieux d'une semaine ne fige aucun prix.
      return [...actuelles, {
        cle,
        id: produit.id,
        nom: produit.nom,
        prix: produit.prix,
        image: produit.image,
        variantes: variantes || null,
        quantite,
      }];
    });
  }, []);

  const changerQuantite = useCallback((cle, quantite) => {
    const q = Math.max(0, Math.min(Number(quantite) || 0, 99));
    setLignes((actuelles) =>
      q === 0
        ? actuelles.filter((l) => l.cle !== cle)
        : actuelles.map((l) => (l.cle === cle ? { ...l, quantite: q } : l))
    );
  }, []);

  const retirer = useCallback((cle) => {
    setLignes((actuelles) => actuelles.filter((l) => l.cle !== cle));
  }, []);

  const vider = useCallback(() => setLignes([]), []);

  /**
   * Forme attendue par l'API. Les lignes sont REGROUPÉES par produit :
   * l'API reçoit une quantité totale par produitId, et vérifie le stock une
   * seule fois par produit. Envoyer deux lignes du même article ferait passer
   * deux contrôles de stock indépendants — deux fois « il en reste 3, tu en
   * demandes 2 » — et laisserait sortir 4 pièces d'un stock de 3.
   */
  // Une ligne par jeu d'options : le vendeur reçoit « 2 × Jus — Parfum :
  // Bissap » au lieu d'un total par produit qu'il devait démêler dans la note.
  const versItems = useCallback(() => lignes.map((l) => ({
    produitId: l.id,
    quantite: l.quantite,
    ...(l.variantes && Object.keys(l.variantes).length ? { options: l.variantes } : {}),
  })), [lignes]);

  /**
   * Le détail des variantes, en texte, pour la note de la commande.
   *
   * La ligne de commande enregistrée en base fige le nom du produit tel qu'il
   * est au catalogue : la taille choisie n'y a aucune place. Sans ce
   * récapitulatif dans la note, le vendeur reçoit « Boubou brodé × 1 » et doit
   * rappeler son client pour savoir quelle taille préparer.
   */
  const detailVariantes = useCallback(() => {
    const avecOptions = lignes.filter((l) => l.variantes && Object.keys(l.variantes).length);
    if (!avecOptions.length) return '';
    return avecOptions
      .map((l) => {
        const options = Object.entries(l.variantes).map(([k, v]) => `${k} : ${v}`).join(', ');
        return `${l.nom} × ${l.quantite} — ${options}`;
      })
      .join(' ; ');
  }, [lignes]);

  const valeur = useMemo(() => ({
    lignes,
    ajouter,
    changerQuantite,
    retirer,
    vider,
    versItems,
    detailVariantes,
    nombreArticles: lignes.reduce((s, l) => s + l.quantite, 0),
    sousTotal: lignes.reduce((s, l) => s + l.prix * l.quantite, 0),
  }), [lignes, ajouter, changerQuantite, retirer, vider, versItems, detailVariantes]);

  return <ContextePanier.Provider value={valeur}>{children}</ContextePanier.Provider>;
}
