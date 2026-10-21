import { useEffect, useMemo, useState } from 'react';
import { CoquilleBoutique } from './BoutiqueLayout';
import { appliquerBrouillon, origineAutorisee } from './apercuOutils';

/**
 * Aperçu du site dans le tableau de bord du vendeur (/apercu, dans une
 * iframe). Le tableau de bord envoie les données de la boutique et les
 * réglages en cours d'édition par postMessage ; la page les affiche avec
 * les vrais composants du site, sans rien enregistrer.
 *
 * Seules les origines du tableau de bord sont écoutées, et la page ne
 * s'affiche que dans un cadre : elle ne peut pas servir à publier une
 * fausse boutique sous l'adresse de SaamBiz.
 */
export default function Apercu() {
  const [message, setMessage] = useState(null);
  const [cible, setCible] = useState('');
  const encadre = typeof window !== 'undefined' && window.parent !== window;

  useEffect(() => {
    if (!encadre) return undefined;
    const recevoir = (e) => {
      if (e.source !== window.parent || !origineAutorisee(e.origin)) return;
      if (e.data?.type === 'saambiz-apercu' && e.data.donnees?.boutique) {
        setMessage({ donnees: e.data.donnees, brouillon: e.data.brouillon });
      }
      if (e.data?.type === 'saambiz-apercu-cible') setCible(String(e.data.cible || ''));
    };
    window.addEventListener('message', recevoir);
    // Prévient le tableau de bord que la page est prête à recevoir.
    window.parent.postMessage({ type: 'saambiz-apercu-pret' }, '*');
    return () => window.removeEventListener('message', recevoir);
  }, [encadre]);

  // Les liens ne mènent nulle part dans l'aperçu : la page reste sur place.
  useEffect(() => {
    const bloquer = (e) => {
      const lien = e.target.closest?.('a[href]');
      if (lien) e.preventDefault();
    };
    document.addEventListener('click', bloquer, true);
    return () => document.removeEventListener('click', bloquer, true);
  }, []);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  // Descend jusqu'à la partie du site en cours de réglage.
  useEffect(() => {
    if (!cible || !message) return undefined;
    const t = setTimeout(() => {
      const el = document.querySelector(`[data-apercu~="${CSS.escape(cible)}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 60);
    return () => clearTimeout(t);
  }, [cible, message]);

  const donnees = useMemo(
    () => (message ? appliquerBrouillon(message.donnees, message.brouillon) : null),
    [message],
  );

  if (!encadre) {
    return <p style={{ padding: 24, fontFamily: 'sans-serif' }}>Cette page sert d'aperçu dans le tableau de bord SaamBiz.</p>;
  }
  if (!donnees) {
    return (
      <div className="vitrine-attente" role="status" aria-live="polite">
        <span className="vitrine-attente__rond" aria-hidden="true" />
      </div>
    );
  }
  return <CoquilleBoutique donnees={donnees} apercu />;
}
