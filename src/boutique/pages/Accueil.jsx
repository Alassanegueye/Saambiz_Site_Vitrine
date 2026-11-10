import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Clock, Phone, MessageCircle, Globe, Ghost } from 'lucide-react';
import { GrilleProduits, CarteProduit } from '../composants';
import IdentiteBoutique from '../IdentiteBoutique';
import IconeVitrine from '../IconeVitrine';
import { Facebook, Instagram, TikTok } from '../icones';
import Catalogue from './Catalogue';
import { lienCarte, lienTelephone, lienWhatsapp } from '../outils';

/**
 * La page d'accueil du site d'une boutique, faite pour être partagée aux
 * clients et commander sans compte : l'identité de la boutique, les rayons,
 * puis ce que le vendeur a choisi d'afficher — ses sections (chacune sur
 * une ligne qui défile), ses avantages et sa présentation.
 *
 * Sans section composée, la boutique montre simplement tous ses produits :
 * un site qui annonce « bientôt » alors que le catalogue est plein fait
 * repartir le client.
 */

/* ── Rayons ─────────────────────────────────────────────────────── */
/* Les catégories du catalogue, avec l'icône que le vendeur a choisie pour
   chacune. Un appui ouvre le catalogue filtré sur ce rayon. */
function Rayons({ categories, icones, slug }) {
  return (
    <nav className="bq-section bq-rayons" aria-label="Catégories de la boutique">
      <ul className="bq-rayons__liste">
        {categories.map((c) => (
          <li key={c.id}>
            <Link to={`/b/${slug}/catalogue?categorie=${c.id}`} className="bq-rayon">
              <span className="bq-rayon__icone"><IconeVitrine cle={icones?.[c.id]} size={24} strokeWidth={1.8} /></span>
              <span className="bq-rayon__nom">{c.nom}</span>
              <span className="bq-rayon__nombre">{c.nombre} article{c.nombre > 1 ? 's' : ''}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── Section en ligne ───────────────────────────────────────────── */
/* Titre en haut, « Tout voir » à droite, produits sur une ligne qui défile ;
   « Tout voir » déplie la section en grille. Sur ordinateur, deux flèches
   font défiler la ligne pour qui n'a pas de pavé tactile. */
function SectionLigne({ titre, produits, slug, format, repere }) {
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
          {(deborde || toutVoir) && (
            <button type="button" className="bq-lien" onClick={() => setToutVoir((v) => !v)} aria-expanded={toutVoir}>
              {toutVoir ? 'Voir moins' : `Tout voir (${produits.length})`}
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

/* ── Avantages ──────────────────────────────────────────────────── */
function Avantages({ avantages }) {
  return (
    <section className="bq-section" data-apercu="avantages">
      <ul className="bq-avantages">
        {avantages.map((a, i) => (
          <li key={i}>
            <span className="bq-avantages__icone"><IconeVitrine cle={a.icone} size={22} strokeWidth={1.9} /></span>
            <span className="bq-avantages__texte">
              <strong>{a.titre}</strong>
              {a.texte && <span>{a.texte}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── À propos et infos pratiques ────────────────────────────────── */
function APropos({ boutique, avecTexte, avecInfos }) {
  const texte = boutique.apropos || boutique.description;
  const adresse = boutique.localisation || boutique.ville;
  const wa = lienWhatsapp(boutique.whatsapp || boutique.telephone, `Bonjour ${boutique.nom}, je vous contacte depuis votre site.`);
  const reseaux = boutique.reseaux || {};
  const liens = [
    reseaux.instagram && { href: reseaux.instagram, nom: 'Instagram', icone: <Instagram size={18} /> },
    reseaux.facebook && { href: reseaux.facebook, nom: 'Facebook', icone: <Facebook size={18} /> },
    reseaux.tiktok && { href: reseaux.tiktok, nom: 'TikTok', icone: <TikTok size={18} /> },
    reseaux.snapchat && { href: reseaux.snapchat, nom: 'Snapchat', icone: <Ghost size={18} strokeWidth={2} /> },
    reseaux.site && { href: reseaux.site, nom: 'Site web', icone: <Globe size={18} strokeWidth={2} /> },
  ].filter(Boolean);

  const montrerTexte = avecTexte && texte;
  const montrerInfos = avecInfos && (adresse || boutique.horaires || boutique.telephone || wa || liens.length > 0);
  if (!montrerTexte && !montrerInfos) return null;

  return (
    <section className={`bq-section bq-apropos ${montrerTexte && montrerInfos ? 'bq-apropos--duo' : ''}`} data-apercu="infos">
      {montrerTexte && (
        <div className="bq-apropos__texte">
          <h2 className="bq-titre">À propos de {boutique.nom}</h2>
          {/* Paragraphe par paragraphe : React échappe chaque chaîne, aucun HTML
              saisi dans le champ ne s'exécute. */}
          {texte.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
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
                <a href={lienTelephone(boutique.telephone)}>{boutique.telephone}</a>
              </li>
            )}
            {wa && (
              <li>
                <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
                <a href={wa} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
              </li>
            )}
          </ul>
          {liens.length > 0 && (
            <div className="bq-reseaux">
              {liens.map((l) => (
                <a key={l.nom} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.nom} title={l.nom}>
                  {l.icone}
                </a>
              ))}
            </div>
          )}
        </aside>
      )}
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function Accueil({ donnees, apercu = false }) {
  const { boutique, categories = [] } = donnees;
  const [params] = useSearchParams();
  const sections = boutique.theme.sections || {};
  const blocs = boutique.blocs || {};
  const format = boutique.theme.modele === 'catalogue' ? 'ligne'
    : boutique.theme.modele === 'galerie' ? 'grande' : 'carte';
  const sectionsVendeur = useMemo(() => donnees.sections || [], [donnees.sections]);
  // Une recherche affiche ses résultats avant les sections.
  const recherche = params.get('q');

  const avecSections = sectionsVendeur.length > 0;

  return (
    <>
      <IdentiteBoutique boutique={boutique} />

      {recherche && (
        <Catalogue boutique={boutique} categories={categories} integre sansPuces
          produitsLocaux={donnees.catalogue} />
      )}

      {avecSections && !recherche && sections.categories !== false && categories.length > 1 && (
        <Rayons categories={categories} icones={blocs.icones} slug={boutique.slug} />
      )}

      {/* Les sections du vendeur, dans son ordre, avec les produits qu'il y a placés. */}
      {sectionsVendeur.map((s) => (
        <SectionLigne key={s.id} repere="sections" titre={s.titre} produits={s.produits} slug={boutique.slug} format={format} />
      ))}

      {/* Sans section : tout le catalogue, filtrable par rayon. */}
      {!avecSections && !recherche && (
        <div data-apercu="sections">
          {apercu && (
            <p className="bq-section bq-note-vendeur">
              Sans section, votre site montre tous vos produits. Créez des sections
              (Nouveautés, Promotions…) pour les mettre en avant.
            </p>
          )}
          <Catalogue boutique={boutique} categories={categories} integre
            produitsLocaux={apercu ? (donnees.catalogue || []) : null} />
        </div>
      )}

      {blocs.avantages?.length > 0 && <Avantages avantages={blocs.avantages} />}
      <APropos boutique={boutique} avecTexte={sections.apropos !== false} avecInfos={sections.contact !== false} />
    </>
  );
}
