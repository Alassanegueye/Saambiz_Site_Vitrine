import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { TitreSection, Etoiles, GrilleProduits, CarteProduit } from '../composants';
import IdentiteBoutique from '../IdentiteBoutique';
import IconeVitrine from '../IconeVitrine';
import Catalogue from './Catalogue';

/**
 * La page du site d'une boutique, faite pour être partagée aux clients et
 * commander sans compte : l'identité de la boutique, puis uniquement ce que
 * le vendeur a choisi d'afficher — ses sections (chacune sur une ligne qui
 * défile), ses avantages, son texte de présentation et les avis.
 */

/* ── Section en ligne ───────────────────────────────────────────── */
/* Titre en haut, « Voir tout » à droite, produits sur une ligne qui défile ;
   « Voir tout » déplie la section en grille. */
function SectionLigne({ titre, produits, slug, format, repere }) {
  const rangee = useRef(null);
  const [toutVoir, setToutVoir] = useState(false);
  const [deborde, setDeborde] = useState(false);

  useEffect(() => {
    const el = rangee.current;
    if (!el || toutVoir) return undefined;
    const mesurer = () => setDeborde(el.scrollWidth > el.clientWidth + 4);
    mesurer();
    const obs = new ResizeObserver(mesurer);
    obs.observe(el);
    return () => obs.disconnect();
  }, [toutVoir, produits.length]);

  return (
    <section className="bq-section bq-section-perso" data-apercu={repere}>
      <div className="bq-section-perso__entete">
        <h2 className="bq-titre-section">{titre}</h2>
        {(deborde || toutVoir) && (
          <button type="button" className="bq-voir-plus" onClick={() => setToutVoir((v) => !v)} aria-expanded={toutVoir}>
            {toutVoir ? 'Voir moins' : 'Voir tout'} <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
          </button>
        )}
      </div>

      {produits.length === 0 && (
        <p className="bq-section-vide">
          Aucun produit dans cette section pour l'instant : choisissez-les dans
          « Sections du site ». Elle n'apparaîtra pour vos clients qu'avec des produits.
        </p>
      )}

      {produits.length > 0 && (toutVoir
        ? <GrilleProduits produits={produits} slug={slug} format={format === 'ligne' ? 'carte' : format} />
        : (
          <div className="bq-rangee" ref={rangee}>
            {produits.map((p) => (
              <div key={p.id} className="bq-rangee__item">
                <CarteProduit produit={p} slug={slug} format={format === 'ligne' ? 'carte' : format} />
              </div>
            ))}
          </div>
        ))}
    </section>
  );
}

/* ── Avantages ──────────────────────────────────────────────────── */
function Avantages({ avantages }) {
  return (
    <section className="bq-section" data-apercu="avantages">
      <ul className="bq-avantages">
        {avantages.map((a, i) => (
          <li key={i}>
            <IconeVitrine cle={a.icone} size={28} strokeWidth={1.7} />
            <strong>{a.titre}</strong>
            {a.texte && <span>{a.texte}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── À propos ────────────────────────────────────────────────────── */
function APropos({ boutique }) {
  const texte = boutique.apropos || boutique.description;
  if (!texte) return null;
  return (
    <section className="bq-section bq-apropos" data-apercu="infos">
      <TitreSection>À propos</TitreSection>
      {/* Paragraphe par paragraphe : React échappe chaque chaîne, aucun HTML
          saisi dans le champ ne s'exécute. */}
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

/* ── Page ────────────────────────────────────────────────────────── */
export default function Accueil({ donnees, apercu = false }) {
  const { boutique, categories, avis } = donnees;
  const [params] = useSearchParams();
  const sections = boutique.theme.sections;
  const blocs = boutique.blocs || {};
  const format = boutique.theme.modele === 'catalogue' ? 'ligne'
    : boutique.theme.modele === 'galerie' ? 'grande' : 'carte';
  const sectionsVendeur = donnees.sections || [];
  // Une recherche (barre du haut) affiche ses résultats avant les sections.
  const recherche = params.get('q');

  return (
    <>
      <IdentiteBoutique boutique={boutique} />

      {recherche && (
        <Catalogue boutique={boutique} categories={categories} integre sansPuces
          produitsLocaux={donnees.catalogue} />
      )}

      {/* Le site n'affiche que ce que le vendeur a choisi : ses sections,
          dans son ordre, avec les produits qu'il y a placés. */}
      {sectionsVendeur.map((s) => (
        <SectionLigne key={s.id} repere="sections" titre={s.titre} produits={s.produits} slug={boutique.slug} format={format} />
      ))}

      {sectionsVendeur.length === 0 && !recherche && (
        <section className="bq-section bq-vide-site" data-apercu="sections">
          {apercu ? (
            <p><strong>Votre site est vide pour l'instant.</strong> Créez une section, puis choisissez
              ses produits dans « Sections du site » : elle apparaîtra ici.</p>
          ) : (
            <p><strong>{boutique.nom}</strong> prépare ses produits. Revenez bientôt, ou écrivez-lui
              en attendant.</p>
          )}
        </section>
      )}

      {blocs.avantages?.length > 0 && <Avantages avantages={blocs.avantages} />}
      {sections.apropos && <APropos boutique={boutique} />}
      {sections.avis && <Avis avis={avis} stats={boutique.stats} />}
    </>
  );
}
