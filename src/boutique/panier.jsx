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

export function FournisseurPanier({ slug, ouvrirPanier = null, children }) {
  const [lignes, setLignes] = useState(() => lireStockage(slug));
  // Le produit dont le client choisit les options (fenêtre d'ajout rapide).
  const [produitEnChoix, setProduitEnChoix] = useState(null);
  // Le dernier ajout, pour le petit message « Ajouté au panier ».
  const [annonce, setAnnonce] = useState(null);

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
          l.cle === cle ? { ...l, quantite: Math.min(l.quantite + quantite, 99), exclue: false } : l
        );
      }
      // On enregistre une photographie du produit : nom, prix et image au
      // moment de l'ajout. Le panier reste donc lisible hors ligne, sans
      // recharger la fiche. Les prix sont revérifiés côté serveur au passage
      // en caisse — un panier vieux d'une semaine ne fige aucun prix.
      // Les options du produit (attributs, libellés) voyagent aussi : le
      // client peut changer de taille ou de couleur depuis le panier.
      return [...actuelles, {
        cle,
        // Repère stable de la ligne : `cle` change quand le client change de
        // taille, `uid` reste — la ligne garde sa place et son état à l'écran.
        uid: `${cle}~${Date.now().toString(36)}`,
        id: produit.id,
        nom: produit.nom,
        prix: produit.prix,
        image: produit.image,
        attributs: produit.attributs || null,
        libelles: produit.libelles || null,
        variantes: variantes || null,
        quantite,
      }];
    });
    setAnnonce({ n: Date.now(), nom: produit.nom, image: produit.image, quantite });
  }, []);

  const choisirOptions = useCallback((produit) => setProduitEnChoix(produit), []);
  const fermerChoix = useCallback(() => setProduitEnChoix(null), []);
  const effacerAnnonce = useCallback(() => setAnnonce(null), []);

  const changerQuantite = useCallback((cle, quantite) => {
    const q = Math.max(0, Math.min(Number(quantite) || 0, 99));
    setLignes((actuelles) =>
      q === 0
        ? actuelles.filter((l) => l.cle !== cle)
        : actuelles.map((l) => (l.cle === cle ? { ...l, quantite: q } : l))
    );
  }, []);

  /**
   * Changer la taille ou la couleur d'une ligne. Si le panier contient déjà
   * ce produit avec ces options-là, les deux lignes fusionnent : deux lignes
   * identiques côte à côte laisseraient croire à une erreur.
   */
  const changerVariantes = useCallback((cle, variantes) => {
    setLignes((actuelles) => {
      const ligne = actuelles.find((l) => l.cle === cle);
      if (!ligne) return actuelles;
      const nouvelle = cleLigne(ligne.id, variantes);
      if (nouvelle === cle) return actuelles;
      const jumelle = actuelles.find((l) => l.cle === nouvelle);
      if (jumelle) {
        return actuelles
          .filter((l) => l.cle !== cle)
          .map((l) => (l.cle === nouvelle
            ? { ...l, quantite: Math.min(l.quantite + ligne.quantite, 99), exclue: false }
            : l));
      }
      return actuelles.map((l) => (l.cle === cle ? { ...l, cle: nouvelle, variantes } : l));
    });
  }, []);

  const retirer = useCallback((cle) => {
    setLignes((actuelles) => actuelles.filter((l) => l.cle !== cle));
  }, []);

  /**
   * Cocher ou décocher une ligne. Une ligne décochée reste dans le panier
   * mais ne part pas dans la commande : le client met un article de côté
   * sans le perdre. On stocke `exclue` plutôt que `choisie` pour que les
   * paniers enregistrés avant cette option restent entièrement cochés.
   */
  const basculer = useCallback((cle) => {
    setLignes((actuelles) => actuelles.map((l) => (l.cle === cle ? { ...l, exclue: !l.exclue } : l)));
  }, []);

  const toutCocher = useCallback((coche) => {
    setLignes((actuelles) => actuelles.map((l) => ({ ...l, exclue: !coche })));
  }, []);

  const vider = useCallback(() => setLignes([]), []);

  /** Après la commande : seules les lignes commandées quittent le panier. */
  const retirerCommandees = useCallback(() => {
    setLignes((actuelles) => actuelles.filter((l) => l.exclue));
  }, []);

  const choisies = useMemo(() => lignes.filter((l) => !l.exclue), [lignes]);

  // Une ligne par jeu d'options : le vendeur reçoit « 2 × Jus — Parfum :
  // Bissap » au lieu d'un total par produit qu'il devait démêler dans la note.
  // Seules les lignes cochées partent.
  const versItems = useCallback(() => choisies.map((l) => ({
    produitId: l.id,
    quantite: l.quantite,
    ...(l.variantes && Object.keys(l.variantes).length ? { options: l.variantes } : {}),
  })), [choisies]);

  /**
   * Le détail des variantes, en texte, pour la note de la commande.
   *
   * La ligne de commande enregistrée en base fige le nom du produit tel qu'il
   * est au catalogue : la taille choisie n'y a aucune place. Sans ce
   * récapitulatif dans la note, le vendeur reçoit « Boubou brodé × 1 » et doit
   * rappeler son client pour savoir quelle taille préparer.
   */
  const detailVariantes = useCallback(() => {
    const avecOptions = choisies.filter((l) => l.variantes && Object.keys(l.variantes).length);
    if (!avecOptions.length) return '';
    return avecOptions
      .map((l) => {
        const options = Object.entries(l.variantes).map(([k, v]) => `${k} : ${v}`).join(', ');
        return `${l.nom} × ${l.quantite} — ${options}`;
      })
      .join(' ; ');
  }, [choisies]);

  const valeur = useMemo(() => ({
    lignes,
    produitEnChoix,
    choisirOptions,
    fermerChoix,
    annonce,
    effacerAnnonce,
    ouvrirPanier,
    // Les lignes cochées : celles qui partiront dans la commande.
    lignesChoisies: choisies,
    ajouter,
    changerQuantite,
    changerVariantes,
    retirer,
    basculer,
    toutCocher,
    vider,
    retirerCommandees,
    versItems,
    detailVariantes,
    // Le compteur de la barre et de la bulle : tout ce qui est dans le panier.
    nombreArticles: lignes.reduce((s, l) => s + l.quantite, 0),
    // Le total et le nombre à commander : les lignes cochées seulement.
    nombreChoisis: choisies.reduce((s, l) => s + l.quantite, 0),
    sousTotal: choisies.reduce((s, l) => s + l.prix * l.quantite, 0),
  }), [lignes, produitEnChoix, choisirOptions, fermerChoix, annonce, effacerAnnonce, ouvrirPanier,
    choisies, ajouter, changerQuantite, changerVariantes, retirer, basculer, toutCocher,
    vider, retirerCommandees, versItems, detailVariantes]);

  return <ContextePanier.Provider value={valeur}>{children}</ContextePanier.Provider>;
}
