import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Clock, Phone, MessageCircle } from 'lucide-react';
import { GrilleProduits, CarteProduit, Avantages, Reseaux } from '../composants';
import IdentiteBoutique from '../IdentiteBoutique';
import IconeVitrine from '../IconeVitrine';
import Catalogue from './Catalogue';
import { formaterTelephone, lienCarte, lienTelephone, lienWhatsappBoutique, promosDeLAccueil } from '../outils';

/**
 * La page d'accueil du site d'une boutique, faite pour être partagée aux
 * clients et commander sans compte : l'identité de la boutique, ses promos
 * du moment, puis ce que le vendeur a choisi d'afficher — ses sections
 * (chacune sur une ligne qui défile) ou, à défaut, ses produits. En bas, un
 * aperçu de la boutique et de ses coordonnées, qui mènent aux pages
 * « À propos » et « Contact ».
 *
 * Sans section composée, la boutique montre simplement ses produits : un
 * site qui annonce « bientôt » alors que le catalogue est plein fait
 * repartir le client.
 */

/* ── Catégories ─────────────────────────────────────────────────── */
/* Les catégories du catalogue, avec l'icône que le vendeur a choisie pour
   chacune. Un appui ouvre « Nos produits » filtré sur la catégorie. */
function Categories({ categories, icones, slug }) {
  return (
    <nav className="bq-section bq-rayons" aria-label="Catégories de la boutique">
      <ul className="bq-rayons__liste">
        {categories.map((c) => (
          <li key={c.id}>
            <Link to={`/b/${slug}/produits?categorie=${c.id}`} className="bq-rayon">
              <span className="bq-rayon__icone"><IconeVitrine cle={icones?.[c.id]} size={22} strokeWidth={1.8} /></span>
              <span className="bq-rayon__nom">{c.nom}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── Section en ligne ───────────────────────────────────────────── */
/* Titre en haut, produits sur une ligne qui défile. À droite du titre :
   soit un lien vers la page qui montre tout (les promos), soit « Tout
   voir », qui déplie la section en grille sur place. Sur ordinateur, deux
   flèches font défiler la ligne pour qui n'a pas de pavé tactile. */
function SectionLigne({ titre, produits, slug, format, repere, lien, libelleLien }) {
  const rangee = useRef(null);
  const [toutVoir, setToutVoir] = useState(false);
  const [bords, setBords] = useState({ debut: true, fin: true });

  useEffect(() => {
    const el = rangee.current;
    if (!el || toutVoir) return undefined;
    const mesurer = () => setBords({
      debut: el.scrollLeft <= 4,
      fin: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
    mesurer();
    el.addEventListener('scroll', mesurer, { passive: true });
    const obs = new ResizeObserver(mesurer);
    obs.observe(el);
    return () => { el.removeEventListener('scroll', mesurer); obs.disconnect(); };
  }, [toutVoir, produits.length]);

  const defiler = (sens) => {
    const el = rangee.current;
    if (el) el.scrollBy({ left: sens * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  const deborde = !(bords.debut && bords.fin);
  const formatTuile = format === 'ligne' ? 'carte' : format;

  return (
    <section className="bq-section bq-rayon-ligne" data-apercu={repere}>
      <div className="bq-titre-section">
        <h2>{titre}</h2>
        <div className="bq-titre-section__outils">
          {lien && <Link to={lien} className="bq-lien">{libelleLien}</Link>}
          {!lien && (deborde || toutVoir) && (
            <button type="button" className="bq-lien" onClick={() => setToutVoir((v) => !v)} aria-expanded={toutVoir}>
              {toutVoir ? 'Voir moins' : 'Tout voir'}
            </button>
          )}
          {deborde && !toutVoir && (
            <span className="bq-fleches">
              <button type="button" className="bq-fleche" onClick={() => defiler(-1)} disabled={bords.debut} aria-label={`Produits précédents — ${titre}`}>
                <ChevronLeft size={19} strokeWidth={2.4} aria-hidden="true" />
              </button>
              <button type="button" className="bq-fleche" onClick={() => defiler(1)} disabled={bords.fin} aria-label={`Produits suivants — ${titre}`}>
                <ChevronRight size={19} strokeWidth={2.4} aria-hidden="true" />
              </button>
            </span>
          )}
        </div>
      </div>

      {toutVoir
        ? <GrilleProduits produits={produits} slug={slug} format={format === 'ligne' ? 'ligne' : formatTuile} />
        : (
          <div className={`bq-rangee ${formatTuile === 'grande' ? 'bq-rangee--grande' : ''}`} ref={rangee}>
            {produits.map((p) => (
              <div key={p.id} className="bq-rangee__item">
                <CarteProduit produit={p} slug={slug} format={formatTuile} />
              </div>
            ))}
          </div>
        )}
    </section>
  );
}

/* ── La boutique en bref ────────────────────────────────────────── */
/* Le début de la présentation du vendeur, et ses coordonnées : de quoi
   rassurer avant de commander. Le détail est sur « À propos » et
   « Contact ». */
function EnBref({ boutique, avecTexte, avecInfos }) {
  const base = `/b/${boutique.slug}`;
  const texte = boutique.apropos || boutique.description;
  const adresse = boutique.localisation || boutique.ville;
  const wa = lienWhatsappBoutique(boutique);

  const montrerTexte = avecTexte && texte;
  const montrerInfos = avecInfos && (adresse || boutique.horaires || boutique.telephone || wa);
  if (!montrerTexte && !montrerInfos) return null;

  return (
    <section className={`bq-section bq-apropos ${montrerTexte && montrerInfos ? 'bq-apropos--duo' : ''}`} data-apercu="infos">
      {montrerTexte && (
        <div className="bq-apropos__texte">
          <h2 className="bq-titre">À propos de {boutique.nom}</h2>
          {/* Le premier paragraphe seulement : la suite est sur sa page.
              React échappe la chaîne, aucun HTML saisi ne s'exécute. */}
          <p className="bq-apropos__resume">{texte.split(/\n{2,}/)[0]}</p>
          <Link to={`${base}/a-propos`} className="bq-lien">En savoir plus sur la boutique</Link>
        </div>
      )}

      {montrerInfos && (
        <aside className="bq-infos" aria-label="Infos pratiques">
          <h2 className="bq-infos__titre">Infos pratiques</h2>
          <ul className="bq-infos__liste">
            {adresse && (
              <li>
                <MapPin size={18} strokeWidth={2} aria-hidden="true" />
                <span>
                  {adresse}
                  <a href={lienCarte(adresse)} target="_blank" rel="noopener noreferrer" className="bq-lien">Voir sur la carte</a>
                </span>
              </li>
            )}
            {boutique.horaires && (
              <li><Clock size={18} strokeWidth={2} aria-hidden="true" /><span>{boutique.horaires}</span></li>
            )}
            {boutique.telephone && (
              <li>
                <Phone size={18} strokeWidth={2} aria-hidden="true" />
                <a href={lienTelephone(boutique.telephone)}>{formaterTelephone(boutique.telephone)}</a>
              </li>
            )}
            {wa && (
              <li>
                <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
                <a href={wa} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
              </li>
            )}
          </ul>
          <Reseaux reseaux={boutique.reseaux} />
          <Link to={`${base}/contact`} className="bq-lien bq-infos__suite">Toutes nos coordonnées</Link>
        </aside>
      )}
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function Accueil({ donnees, apercu = false }) {
  const { boutique, categories = [] } = donnees;
  const base = `/b/${boutique.slug}`;
  const sections = boutique.theme.sections || {};
  const blocs = boutique.blocs || {};
  const format = boutique.theme.modele === 'catalogue' ? 'ligne'
    : boutique.theme.modele === 'galerie' ? 'grande' : 'carte';
  const sectionsVendeur = useMemo(() => donnees.sections || [], [donnees.sections]);
  const promos = useMemo(() => promosDeLAccueil(donnees), [donnees]);

  const avecSections = sectionsVendeur.length > 0;

  return (
    <>
      <IdentiteBoutique boutique={boutique} />

      {avecSections && sections.categories !== false && categories.length > 1 && (
        <Categories categories={categories} icones={blocs.icones} slug={boutique.slug} />
      )}

      {promos.length > 0 && (
        <SectionLigne repere="promos" titre="Nos promos" produits={promos} slug={boutique.slug} format={format}
          lien={`${base}/promos`} libelleLien="Voir toutes les promos" />
      )}

      {/* Les sections du vendeur, dans son ordre, avec les produits qu'il y a placés. */}
      {sectionsVendeur.map((s) => (
        <SectionLigne key={s.id} repere="sections" titre={s.titre} produits={s.produits} slug={boutique.slug} format={format} />
      ))}

      {avecSections && (
        <div className="bq-section bq-voir-tout">
          <Link to={`${base}/produits`} className="bq-bouton bq-bouton--doux bq-bouton--grand">Voir tous nos produits</Link>
        </div>
      )}

      {/* Sans section : les produits, filtrables par catégorie. */}
      {!avecSections && (
        <div data-apercu="sections">
          {apercu && (
            <p className="bq-section bq-note-vendeur">
              Sans section, votre site montre vos produits. Créez des sections
              (Nouveautés, Promotions…) pour les mettre en avant.
            </p>
          )}
          <Catalogue boutique={boutique} categories={categories} integre
            produitsLocaux={apercu ? (donnees.catalogue || []) : null} />
        </div>
      )}

      {blocs.avantages?.length > 0 && <Avantages avantages={blocs.avantages} />}
      <EnBref boutique={boutique} avecTexte={sections.apropos !== false} avecInfos={sections.contact !== false} />
    </>
  );
}
