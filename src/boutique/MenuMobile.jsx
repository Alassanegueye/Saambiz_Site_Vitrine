import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Package, Phone, X } from 'lucide-react';
import { LogoBoutique } from './IdentiteBoutique';
import { estPageActive, pagesBoutique } from './navigation';
import { lienTelephone, lienWhatsappBoutique } from './outils';

/**
 * Le menu du téléphone : les pages de la boutique, le suivi de commande, et
 * les deux façons de joindre le vendeur. Il glisse depuis la droite, au-dessus
 * de la page ; Échap, la croix ou un appui à côté le referment.
 */
export default function MenuMobile({ boutique, ouvert, fermer, aDesPromos }) {
  const { pathname } = useLocation();
  const premier = useRef(null);

  useEffect(() => {
    if (!ouvert) return undefined;
    const touche = (e) => { if (e.key === 'Escape') fermer(); };
    document.addEventListener('keydown', touche);
    // Le défilement est bloqué sur <html> et non sur <body> : un <body> en
    // overflow hidden devient le conteneur de la barre collante, qui
    // remonterait alors d'autant que la page avait défilé.
    const racine = document.documentElement;
    const avant = racine.style.overflow;
    racine.style.overflow = 'hidden';
    premier.current?.focus();
    return () => {
      document.removeEventListener('keydown', touche);
      racine.style.overflow = avant;
    };
  }, [ouvert, fermer]);

  if (!ouvert) return null;

  const base = `/b/${boutique.slug}`;
  const wa = lienWhatsappBoutique(boutique);
  const telephone = boutique.telephone || boutique.whatsapp;

  return (
    <div className="bq-menu__voile" onClick={fermer} role="presentation">
      <div id="bq-menu" className="bq-menu" role="dialog" aria-modal="true" aria-label="Menu de la boutique"
        onClick={(e) => e.stopPropagation()}>
        <div className="bq-menu__entete">
          <span className="bq-menu__marque">
            <LogoBoutique boutique={boutique} className="bq-menu__logo" />
            <span>{boutique.nom}</span>
          </span>
          <button type="button" className="bq-menu__fermer" onClick={fermer} aria-label="Fermer le menu">
            <X size={20} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Pages de la boutique">
          <ul className="bq-menu__liens">
            {pagesBoutique(boutique.slug).map((p, i) => {
              const active = estPageActive(p, pathname);
              const Icone = p.icone;
              return (
                <li key={p.cle}>
                  <Link ref={i === 0 ? premier : undefined} to={p.a} onClick={fermer}
                    className={`bq-menu__lien ${active ? 'est-actif' : ''}`} aria-current={active ? 'page' : undefined}>
                    <Icone size={21} strokeWidth={2} aria-hidden="true" />
                    <span>{p.libelle}</span>
                    {p.cle === 'promos' && aDesPromos && (
                      <span className="bq-nav__point"><span className="sr-only"> (promos en cours)</span></span>
                    )}
                  </Link>
                </li>
              );
            })}
            <li className="bq-menu__separe">
              <Link to={`${base}/suivi`} onClick={fermer}
                className={`bq-menu__lien ${pathname.startsWith(`${base}/suivi`) ? 'est-actif' : ''}`}>
                <Package size={21} strokeWidth={2} aria-hidden="true" />
                <span>Suivre ma commande</span>
              </Link>
            </li>
          </ul>
        </nav>

        {(wa || telephone) && (
          <div className="bq-menu__contact">
            {wa && (
              <a className="bq-bouton bq-bouton--wa bq-bouton--bloc" href={wa} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} strokeWidth={2.2} aria-hidden="true" /> Écrire sur WhatsApp
              </a>
            )}
            {telephone && (
              <a className="bq-bouton bq-bouton--doux bq-bouton--bloc" href={lienTelephone(telephone)}>
                <Phone size={18} strokeWidth={2.2} aria-hidden="true" /> Appeler
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
