import { Link, useLocation } from 'react-router-dom';
import { BadgeCheck, Menu, ShoppingCart, Star } from 'lucide-react';
import { usePanier } from './panierContexte';
import { LogoBoutique } from './IdentiteBoutique';
import { estPageActive, pagesBoutique } from './navigation';
import { formaterNote } from './outils';

/**
 * La barre du haut, la même sur toutes les pages.
 *
 * À gauche, la boutique : son logo, son nom (avec le badge « certifiée ») et,
 * dessous, sa note quand des clients en ont laissé une — sinon un mot
 * d'accueil. À droite, le panier avec son nombre d'articles, puis le menu.
 * Sur ordinateur, les pages (Accueil, Nos produits, Nos promos, À propos,
 * Contact) s'affichent au milieu et le menu disparaît.
 *
 * Le panier affiche toujours son nombre d'articles, zéro compris : le client
 * voit où ira ce qu'il ajoute avant même d'ajouter quoi que ce soit.
 */
export default function BarreHaut({ boutique, ouvrirPanier, ouvrirMenu, menuOuvert, aDesPromos }) {
  const base = `/b/${boutique.slug}`;
  const { pathname } = useLocation();
  const { nombreArticles } = usePanier();
  const pages = pagesBoutique(boutique.slug);
  const stats = boutique.stats || {};
  const note = stats.note != null && stats.avis > 0;

  return (
    <header className="bq-haut">
      <div className="bq-haut__interieur">
        <Link to={base} className="bq-haut__marque" aria-label={`${boutique.nom} — accueil de la boutique`}>
          <LogoBoutique boutique={boutique} className="bq-haut__logo" />
          <span className="bq-haut__identite">
            <span className="bq-haut__ligne">
              <span className="bq-haut__nom">{boutique.nom}</span>
              {boutique.verifiee && (
                <BadgeCheck size={17} strokeWidth={2.3} className="bq-haut__badge" aria-label="Boutique certifiée par SaamBiz" />
              )}
            </span>
            {note ? (
              <span className="bq-haut__accroche bq-haut__accroche--note">
                <Star size={13} className="bq-haut__etoile" aria-hidden="true" />
                <strong>{formaterNote(stats.note)}</strong>
                <span>· {stats.avis} avis</span>
              </span>
            ) : (
              <span className="bq-haut__accroche">Bienvenue dans ma boutique 👋</span>
            )}
          </span>
        </Link>

        <nav className="bq-nav" aria-label="Pages de la boutique">
          <ul className="bq-nav__liste">
            {pages.map((p) => {
              const active = estPageActive(p, pathname);
              return (
                <li key={p.cle}>
                  <Link to={p.a} className={`bq-nav__lien ${active ? 'est-actif' : ''}`}
                    aria-current={active ? 'page' : undefined}>
                    {p.libelle}
                    {/* Un point, pas un nombre : il dit seulement qu'il y a
                        des prix réduits en ce moment. */}
                    {p.cle === 'promos' && aDesPromos && (
                      <span className="bq-nav__point"><span className="sr-only"> (promos en cours)</span></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="bq-haut__outils">
          {boutique.commandeActivee && (
            <button type="button" className="bq-haut__panier" onClick={ouvrirPanier}
              aria-label={`Ouvrir le panier — ${nombreArticles} article${nombreArticles > 1 ? 's' : ''}`}>
              <ShoppingCart size={24} strokeWidth={2} aria-hidden="true" />
              {/* La clé relance le petit rebond à chaque ajout. */}
              <span key={nombreArticles} className={`bq-haut__nombre ${nombreArticles > 0 ? 'est-plein' : ''}`}
                aria-hidden="true">
                {nombreArticles > 99 ? '99+' : nombreArticles}
              </span>
            </button>
          )}

          <button type="button" className="bq-haut__menu" onClick={ouvrirMenu}
            aria-label="Ouvrir le menu" aria-expanded={menuOuvert} aria-controls={menuOuvert ? 'bq-menu' : undefined}>
            <Menu size={22} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
