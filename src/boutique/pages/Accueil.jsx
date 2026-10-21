import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TitreSection, Etoiles, GrilleProduits, CarteProduit } from '../composants';
import IdentiteBoutique from '../IdentiteBoutique';
import Catalogue from './Catalogue';

/**
 * La page du site d'une boutique : une seule page, faite pour être partagée
 * aux clients et commander sans compte.
 *   1. En haut, l'identité : logo, nom, adresse, téléphone, réseaux.
 *   2. Dessous, « Nos produits » : tout le catalogue, avec recherche, rayons
 *      et tri ; la mise en page choisie par le vendeur règle l'aspect des
 *      cartes produit.
 *   3. Puis, si le vendeur les affiche, « À propos » et les avis.
 * Le panier est un bouton flottant (voir PanierFlottant).
 */

/* ── À propos ────────────────────────────────────────────────────── */
function APropos({ boutique }) {
  const texte = boutique.apropos || boutique.description;
  if (!texte) return null;
  return (
    <section className="bq-section bq-apropos">
      <TitreSection>À propos</TitreSection>
      {/* Le texte du vendeur est rendu paragraphe par paragraphe : React
          échappe chaque chaîne, aucun HTML saisi dans le champ ne s'exécute. */}
      {texte.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
    </section>
  );
}

/* ── Avis ────────────────────────────────────────────────────────── */
function Avis({ avis, stats }) {
  if (!avis.length) return null;
  return (
    <section className="bq-section">
      <TitreSection>Ce qu'en disent les clients</TitreSection>

      {stats?.note != null && (
        <p className="bq-note-globale">
          <strong>{stats.note}</strong>/5
          <Etoiles note={stats.note} taille={17} />
          <span>{stats.avis} avis</span>
        </p>
      )}

      <div className="bq-avis">
        {avis.map((a) => (
          <blockquote key={a.id} className="bq-avis__carte">
            <Etoiles note={a.note} />
            {a.commentaire && <p>{a.commentaire}</p>}
            <cite>{a.auteur}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

/* ── Section créée par le vendeur ─────────────────────────────────── */
/* Titre en haut, « Voir plus » à droite, produits sur une seule ligne qui
   défile à gauche et à droite. « Voir plus » déplie la section en grille. */
function SectionPerso({ section, slug, format }) {
  const rangee = useRef(null);
  const [toutVoir, setToutVoir] = useState(false);
  const [deborde, setDeborde] = useState(false);

  // « Voir plus » et les flèches n'ont de sens que si la ligne déborde.
  useEffect(() => {
    const el = rangee.current;
    if (!el || toutVoir) return undefined;
    const mesurer = () => setDeborde(el.scrollWidth > el.clientWidth + 4);
    mesurer();
    const obs = new ResizeObserver(mesurer);
    obs.observe(el);
    return () => obs.disconnect();
  }, [toutVoir, section.produits.length]);

  const defiler = (sens) => {
    const el = rangee.current;
    if (el) el.scrollBy({ left: sens * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="bq-section bq-section-perso">
      <div className="bq-section-perso__entete">
        <h2 className="bq-titre-section">{section.titre}</h2>
        {(deborde || toutVoir) && (
          <div className="bq-section-perso__actions">
            {!toutVoir && (
              <>
                <button type="button" className="bq-fleche" onClick={() => defiler(-1)} aria-label="Produits précédents">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" className="bq-fleche" onClick={() => defiler(1)} aria-label="Produits suivants">
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            <button type="button" className="bq-voir-plus" onClick={() => setToutVoir((v) => !v)} aria-expanded={toutVoir}>
              {toutVoir ? 'Voir moins' : 'Voir plus'}
            </button>
          </div>
        )}
      </div>

      {toutVoir
        ? <GrilleProduits produits={section.produits} slug={slug} format={format} />
        : (
          <div className="bq-rangee" ref={rangee}>
            {section.produits.map((p) => (
              <div key={p.id} className="bq-rangee__item">
                <CarteProduit produit={p} slug={slug} format={format === 'ligne' ? 'carte' : format} />
              </div>
            ))}
          </div>
        )}
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function Accueil({ donnees }) {
  const { boutique, categories, avis } = donnees;
  const sections = boutique.theme.sections;
  const format = boutique.theme.modele === 'catalogue' ? 'ligne'
    : boutique.theme.modele === 'galerie' ? 'grande' : 'carte';

  return (
    <>
      <IdentiteBoutique boutique={boutique} />

      {/* Les sections créées par le vendeur (« Nouvelle collection »…),
          dans son ordre, avant le catalogue complet. */}
      {(donnees.sections || []).map((s) => (
        <SectionPerso key={s.id} section={s} slug={boutique.slug} format={format} />
      ))}

      <Catalogue boutique={boutique} categories={categories} integre />
      {sections.apropos && <APropos boutique={boutique} />}
      {sections.avis && <Avis avis={avis} stats={boutique.stats} />}
    </>
  );
}
