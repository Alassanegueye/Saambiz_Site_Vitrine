import { Link, useLocation } from 'react-router-dom';
import { Menu, Package, ShoppingBag } from 'lucide-react';
import { usePanier } from './panierContexte';
import { LogoBoutique } from './IdentiteBoutique';
import { estPageActive, pagesBoutique } from './navigation';

/**
 * La barre du haut, la même sur toutes les pages.
 *
 * Sur ordinateur : la boutique à gauche, les pages au milieu (Accueil, Nos
 * produits, Nos promos, À propos, Contact), le suivi de commande et le
 * panier à droite. Sur téléphone, les pages passent dans un menu : la barre
 * garde la place pour le nom de la boutique et le panier.
 *
 * Le panier affiche toujours son nombre d'articles, zéro compris : le client
 * voit où ira ce qu'il ajoute avant même d'ajouter quoi que ce soit.
 */
export default function BarreHaut({ boutique, ouvrirPanier, ouvrirMenu, menuOuvert, aDesPromos }) {
  const base = `/b/${boutique.slug}`;
  const { pathname } = useLocation();
  const { nombreArticles } = usePanier();
  const pages = pagesBoutique(boutique.slug);

  return (
    <header className="bq-haut">
      <div className="bq-haut__interieur">
        <Link to={base} className="bq-haut__marque" aria-label={`${boutique.nom} — accueil de la boutique`}>
          <LogoBoutique boutique={boutique} className="bq-haut__logo" />
          <span className="bq-haut__nom">{boutique.nom}</span>
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
          <Link to={`${base}/suivi`} className={`bq-haut__suivi ${pathname.startsWith(`${base}/suivi`) ? 'est-actif' : ''}`}>
            <Package size={18} strokeWidth={2} aria-hidden="true" />
            Suivre ma commande
          </Link>

          {boutique.commandeActivee && (
            <button type="button" className="bq-haut__panier" onClick={ouvrirPanier}
              aria-label={`Ouvrir le panier — ${nombreArticles} article${nombreArticles > 1 ? 's' : ''}`}>
              <ShoppingBag size={22} strokeWidth={2} aria-hidden="true" />
              <span className="bq-haut__panier-texte" aria-hidden="true">Panier</span>
              {/* Sur téléphone, une pastille sur le sac ; sur ordinateur, le
                  nombre après le libellé. La clé relance le petit rebond à
                  chaque ajout. */}
              <span key={nombreArticles} className={`bq-haut__nombre ${nombreArticles > 0 ? 'est-plein' : ''}`}
                aria-hidden="true">
                {nombreArticles > 99 ? '99+' : nombreArticles}
              </span>
            </button>
          )}

          <button type="button" className="bq-haut__icone bq-haut__menu" onClick={ouvrirMenu}
            aria-label="Ouvrir le menu" aria-expanded={menuOuvert} aria-controls={menuOuvert ? 'bq-menu' : undefined}>
            <Menu size={23} strokeWidth={2.1} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
