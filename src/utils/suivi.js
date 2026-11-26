// Fréquentation de la page de présentation de SaamBiz (saambiz.com), envoyée
// à l'API — POST /sites/saambiz/evenements — et lue dans l'administration
// SaamBiz (page « Site vitrine »). Les boutiques (/b/<slug>) ont leur propre
// compteur, côté API, à l'ouverture de leur page.
//
// Ce qui part : la page, d'où vient le visiteur (site précédent, utm_*), la
// taille d'écran, la langue, le temps passé, et les clics qui comptent
// (espace vendeur, application, WhatsApp, téléphone, e-mail). Aucun cookie,
// aucun identifiant durable : la visite a un numéro tiré au hasard, gardé
// dans l'onglet seulement (sessionStorage), et oublié à sa fermeture.

const BASE = `${(import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')}/saambiz/v1`;
const ADRESSE = `${BASE}/sites/saambiz/evenements`;
const CLE_SESSION = 'saambiz.visite';

// En développement, rien n'est envoyé : les visites de test ne doivent pas se
// mêler aux vraies.
const actif = typeof window !== 'undefined' && !import.meta.env.DEV;

function numeroDeVisite() {
  try {
    let n = sessionStorage.getItem(CLE_SESSION);
    if (!n) {
      const octets = crypto.getRandomValues(new Uint8Array(12));
      n = Array.from(octets, (o) => o.toString(36).padStart(2, '0')).join('').slice(0, 20);
      sessionStorage.setItem(CLE_SESSION, n);
    }
    return n;
  } catch {
    return `sans-stockage-${Math.random().toString(36).slice(2, 12)}`;
  }
}

let premierePage = true;
let pageCourante = null;
let debutPage = 0;

// En texte brut : pour le navigateur, un envoi « simple » vers l'API, sans
// requête préalable (OPTIONS) — rien de perdu quand l'onglet se ferme.
function envoyer(donnees) {
  if (!actif) return;
  const corps = JSON.stringify({ s: numeroDeVisite(), ...donnees });
  try {
    const blob = new Blob([corps], { type: 'text/plain;charset=UTF-8' });
    if (navigator.sendBeacon && navigator.sendBeacon(ADRESSE, blob)) return;
  } catch {
    /* repli ci-dessous */
  }
  fetch(ADRESSE, {
    method: 'POST',
    body: corps,
    keepalive: true,
    credentials: 'omit',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
  }).catch(() => {});
}

function fermerPage() {
  if (!pageCourante || !debutPage) return;
  const ms = Date.now() - debutPage;
  if (ms > 500) envoyer({ t: 'duree', c: pageCourante, v: ms });
  debutPage = 0;
}

/** Une page vue. */
export function pageVue(chemin, titre) {
  fermerPage();
  pageCourante = chemin;
  debutPage = Date.now();
  const d = { t: 'page', c: chemin, ti: titre };
  if (premierePage) {
    premierePage = false;
    const p = new URLSearchParams(window.location.search);
    const utm = { source: p.get('utm_source'), medium: p.get('utm_medium'), campagne: p.get('utm_campaign') };
    Object.assign(d, {
      e: 1,
      r: document.referrer || null,
      u: Object.values(utm).some(Boolean) ? utm : undefined,
      sc: `${window.screen.width}x${window.screen.height}`,
      l: navigator.language,
      f: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }
  envoyer(d);
}

/** Un clic qui compte. */
export function clic(cible) {
  envoyer({ t: 'clic', c: pageCourante, ci: cible });
}

const ESPACE_VENDEUR = (import.meta.env.VITE_DASHBOARD_URL || '').replace(/\/+$/, '');

// Les liens qui comptent sont repérés à leur adresse : pas besoin de toucher
// à chaque composant.
function surClic(e) {
  if (!pageCourante) return;
  const a = e.target.closest?.('a[href], button[data-suivi]');
  if (!a) return;
  if (a.dataset?.suivi) return clic(a.dataset.suivi);
  const href = a.getAttribute('href') || '';
  if (ESPACE_VENDEUR && href.startsWith(ESPACE_VENDEUR)) clic('espace_vendeur');
  else if (/play\.google\.com|apps\.apple\.com/i.test(href)) clic('application');
  else if (/wa\.me|whatsapp/i.test(href)) clic('whatsapp');
  else if (href.startsWith('tel:')) clic('telephone');
  else if (href.startsWith('mailto:')) clic('email');
}

if (actif) {
  document.addEventListener('click', surClic, { capture: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') fermerPage();
    else if (pageCourante && !debutPage) debutPage = Date.now();
  });
  window.addEventListener('pagehide', fermerPage);
}
