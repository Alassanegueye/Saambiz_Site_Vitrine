import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, BadgeCheck, MapPin, Phone } from 'lucide-react';
import { usePanier } from './panierContexte';

/**
 * L'en-tête du site d'une boutique.
 *
 * Rien de SaamBiz ici : ni logo, ni menu de la marketplace. Le client est
 * chez son commerçant, la marque de la plateforme n'apparaît qu'en bas de
 * page. C'est ce qui fait la différence entre « un site de boutique » et
 * « une fiche sur un annuaire ».
 */
export default function Entete({ boutique }) {
  const { nombreArticles } = usePanier();
  const [ouvert, setOuvert] = useState(false);
  const base = `/b/${boutique.slug}`;

  /* Comment poser le logo : l'assistant a mesuré sa forme au moment du
     téléversement (voir logo.analyse.service.js). Un logo rond rogné dans un
     carré perd ses bords ; un logo qui porte déjà le nom écrit, réduit à une
     pastille de 42 px, devient illisible — et répéter le nom à côté fait
     doublon. D'où ces trois traitements plutôt qu'un cadre unique. */
  const forme = boutique.logoForme || 'libre';
  const estBandeau = forme === 'bandeau' && Boolean(boutique.logo);

  // Le menu mobile se referme sur le lien cliqué, et non dans un effet qui
  // observerait l'adresse : la fermeture appartient au geste du client, pas
  // à un rendu qui suit la navigation.
  const fermer = () => setOuvert(false);

  const liens = [
    { to: base, libelle: 'Accueil', end: true },
    { to: `${base}/catalogue`, libelle: 'Boutique' },
    { to: `${base}/suivi`, libelle: 'Suivre ma commande' },
  ];

  return (
    <header className="bq-entete">
      {/* Bandeau d'annonce du vendeur — « Livraison offerte à Dakar ». */}
      {boutique.annonce && (
        <div className="bq-annonce" role="status">{boutique.annonce}</div>
      )}

      <div className="bq-entete__barre">
        <Link to={base} className={`bq-identite ${estBandeau ? 'bq-identite--bandeau' : ''}`}>
          {boutique.logo
            ? (
              <img
                src={boutique.logo}
                /* Le logo porte le nom quand il fait bandeau : il n'est plus
                   décoratif, c'est lui qui identifie la boutique. */
                alt={estBandeau ? boutique.nom : ''}
                className={`bq-identite__logo bq-identite__logo--${forme}`}
              />
            )
            : (
              /* Sans logo, l'initiale sur l'accent du vendeur : plus digne
                 qu'une image cassée ou qu'un cadre vide. */
              <span className="bq-identite__initiale" aria-hidden="true">
                {boutique.nom.charAt(0).toUpperCase()}
              </span>
            )}

          {estBandeau ? (
            boutique.verifiee && (
              <BadgeCheck size={16} strokeWidth={2.4} className="bq-verifiee" aria-label="Boutique vérifiée" />
            )
          ) : (
            <span className="bq-identite__texte">
              <span className="bq-identite__nom">
                {boutique.nom}
                {boutique.verifiee && (
                  <BadgeCheck size={16} strokeWidth={2.4} className="bq-verifiee" aria-label="Boutique vérifiée" />
                )}
              </span>
              {boutique.slogan && <span className="bq-identite__slogan">{boutique.slogan}</span>}
            </span>
          )}
        </Link>

        <nav className="bq-nav" aria-label="Navigation de la boutique">
          {liens.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `bq-nav__lien ${isActive ? 'est-actif' : ''}`}
            >
              {l.libelle}
            </NavLink>
          ))}
        </nav>

        <div className="bq-entete__actions">
          <Link to={`${base}/catalogue`} className="bq-icone-bouton" aria-label="Rechercher un produit">
            <Search size={20} strokeWidth={2} />
          </Link>

          {boutique.commandeActivee && (
            <Link to={`${base}/panier`} className="bq-icone-bouton bq-panier-bouton" aria-label={`Panier — ${nombreArticles} article(s)`}>
              <ShoppingCart size={20} strokeWidth={2} />
              {nombreArticles > 0 && <span className="bq-panier-bouton__compteur">{nombreArticles}</span>}
            </Link>
          )}

          <button
            type="button"
            className="bq-icone-bouton bq-burger"
            onClick={() => setOuvert((v) => !v)}
            aria-expanded={ouvert}
            aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {ouvert ? <X size={21} strokeWidth={2.2} /> : <Menu size={21} strokeWidth={2.2} />}
          </button>
        </div>
      </div>

      {/* Menu mobile. Il porte aussi les informations de contact : sur un
          téléphone, appeler le vendeur est souvent le vrai objectif de la
          visite, et le faire chercher jusqu'au pied de page le perd. */}
      {ouvert && (
        <div className="bq-menu-mobile">
          {liens.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="bq-menu-mobile__lien" onClick={fermer}>
              {l.libelle}
            </NavLink>
          ))}
          {boutique.telephone && (
            <a href={`tel:${boutique.telephone}`} className="bq-menu-mobile__lien" onClick={fermer}>
              <Phone size={16} strokeWidth={2} aria-hidden="true" /> {boutique.telephone}
            </a>
          )}
          {(boutique.ville || boutique.localisation) && (
            <p className="bq-menu-mobile__info">
              <MapPin size={16} strokeWidth={2} aria-hidden="true" />
              {boutique.localisation || boutique.ville}
            </p>
          )}
        </div>
      )}
    </header>
  );
}
