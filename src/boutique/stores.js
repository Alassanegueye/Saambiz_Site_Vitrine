/** Liens des stores et détection du téléphone, partagés par le site. */
export const LIEN_ANDROID = import.meta.env.VITE_LIEN_ANDROID
  || 'https://play.google.com/store/apps/details?id=com.saambiz.app';
// À remplacer par l'adresse donnée par Apple à la publication
// (https://apps.apple.com/app/id…) : en attendant, la recherche « SaamBiz ».
export const LIEN_IOS = import.meta.env.VITE_LIEN_IOS
  || 'https://apps.apple.com/search?term=SaamBiz';

/** iPhone / iPad → App Store ; tout le reste → Google Play. */
export const estIos = () => typeof navigator !== 'undefined'
  && (/iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

/** Ouvre l'invitation à installer l'application (voir InviteApplication). */
export function inviterApplication(raison) {
  window.dispatchEvent(new CustomEvent('saambiz:inviter-app', { detail: { raison } }));
}
