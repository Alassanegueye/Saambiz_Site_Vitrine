import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, MapPin, Clock, MessageCircle, Package, Star } from 'lucide-react';
import { GrilleProduits, TitreSection, Etoiles, EtatVide, ImageProduit } from '../composants';

/**
 * La page d'accueil du site d'une boutique.
 *
 * Les trois mises en page ne sont pas trois sites : c'est la même page, dont
 * l'ordre et la densité changent. Le vendeur choisit celle qui va à ce qu'il
 * vend, sans que personne n'ait à maintenir trois catalogues, trois paniers
 * et trois passages en caisse.
 *
 *   classique — bannière, catégories, mis en avant, nouveautés. Le choix sûr.
 *   galerie   — les images d'abord, en grand. Mode, décoration, bijoux.
 *   catalogue — une liste dense, tout de suite. Gros stocks, pièces détachées.
 */

/* ── Bannière ────────────────────────────────────────────────────── */
function Banniere({ boutique, compacte = false }) {
  const aPhoto = Boolean(boutique.banniere);

  return (
    <section className={`bq-banniere ${compacte ? 'bq-banniere--compacte' : ''} ${aPhoto ? '' : 'bq-banniere--unie'}`}>
      {aPhoto && (
        <>
          <img src={boutique.banniere} alt="" className="bq-banniere__photo" />
          {/* Un voile calculé depuis l'accent : les bannières téléversées vont
              du cliché de studio à la photo prise à contre-jour, et le nom de
              la boutique doit rester lisible sur les deux. */}
          <div className="bq-banniere__voile" aria-hidden="true" />
        </>
      )}

      <div className="bq-banniere__contenu">
        {boutique.categorie && <p className="bq-banniere__categorie">{boutique.categorie}</p>}

        <h1 className="bq-banniere__titre">
          {boutique.nom}
          {boutique.verifiee && (
            <BadgeCheck size={24} strokeWidth={2.3} className="bq-verifiee" aria-label="Boutique vérifiée par SaamBiz" />
          )}
        </h1>

        {boutique.slogan && <p className="bq-banniere__slogan">{boutique.slogan}</p>}

        <div className="bq-banniere__meta">
          {(boutique.ville || boutique.localisation) && (
            <span><MapPin size={15} strokeWidth={2} aria-hidden="true" />{boutique.localisation || boutique.ville}</span>
          )}
          {boutique.horaires && (
            <span><Clock size={15} strokeWidth={2} aria-hidden="true" />{boutique.horaires}</span>
          )}
          {boutique.stats?.produits > 0 && (
            <span><Package size={15} strokeWidth={2} aria-hidden="true" />{boutique.stats.produits} produits</span>
          )}
          {boutique.stats?.note != null && (
            <span><Star size={15} strokeWidth={2} aria-hidden="true" />{boutique.stats.note} / 5 ({boutique.stats.avis} avis)</span>
          )}
        </div>

        <div className="bq-banniere__actions">
          <Link to={`/b/${boutique.slug}/catalogue`} className="bq-bouton bq-bouton--grand">
            Voir tous les produits <ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" />
          </Link>
          {boutique.whatsapp && (
            <a
              className="bq-bouton bq-bouton--fantome bq-bouton--grand"
              href={`https://wa.me/${String(boutique.whatsapp).replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={17} strokeWidth={2.2} aria-hidden="true" /> Écrire au vendeur
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Catégories ──────────────────────────────────────────────────── */
function Categories({ categories, slug }) {
  if (!categories.length) return null;
  return (
    <section className="bq-section">
      <TitreSection>Rayons</TitreSection>
      <div className="bq-rayons">
        {categories.map((c) => (
          <Link key={c.id} to={`/b/${slug}/catalogue?categorie=${c.id}`} className="bq-rayon">
            <span className="bq-rayon__nom">{c.nom}</span>
            <span className="bq-rayon__nombre">{c.nombre}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

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

/* ── Page ────────────────────────────────────────────────────────── */
export default function Accueil({ donnees }) {
  const { boutique, categories, produitsVedettes, nouveautes, avis } = donnees;
  const slug = boutique.slug;
  const modele = boutique.theme.modele;
  const sections = boutique.theme.sections;

  // Un catalogue vide arrive plus souvent qu'on ne croit : un vendeur ouvre
  // sa boutique, publie son site, et saisit ses produits le lendemain. Mieux
  // vaut le dire clairement que d'afficher une page qui semble cassée.
  if (!produitsVedettes.length && !nouveautes.length) {
    return (
      <>
        <Banniere boutique={boutique} />
        <div className="bq-section">
          <EtatVide
            titre="Le catalogue arrive"
            texte={`${boutique.nom} prépare ses produits. Revenez d'ici peu, ou écrivez directement au vendeur.`}
            action={boutique.whatsapp ? (
              <a
                className="bq-bouton"
                href={`https://wa.me/${String(boutique.whatsapp).replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={17} strokeWidth={2.2} aria-hidden="true" /> Écrire sur WhatsApp
              </a>
            ) : null}
          />
        </div>
      </>
    );
  }

  /* ── Galerie : les images d'abord, en grand ───────────────────── */
  if (modele === 'galerie') {
    const [vedette, ...reste] = produitsVedettes;
    return (
      <>
        <Banniere boutique={boutique} />

        {vedette && (
          <section className="bq-section bq-vedette">
            <Link to={`/b/${slug}/produit/${vedette.id}`} className="bq-vedette__lien">
              <ImageProduit src={vedette.image} alt={vedette.nom} className="bq-vedette__image" />
              <div className="bq-vedette__texte">
                <p className="bq-vedette__sur-titre">Le coup de cœur de la boutique</p>
                <h2>{vedette.nom}</h2>
                {vedette.description && <p className="bq-vedette__desc">{vedette.description}</p>}
                <span className="bq-bouton bq-bouton--grand">
                  Voir le produit <ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" />
                </span>
              </div>
            </Link>
          </section>
        )}

        {reste.length > 0 && (
          <section className="bq-section">
            <TitreSection lien={`/b/${slug}/catalogue`}>La sélection</TitreSection>
            <GrilleProduits produits={reste} slug={slug} format="grande" />
          </section>
        )}

        {nouveautes.length > 0 && (
          <section className="bq-section">
            <TitreSection lien={`/b/${slug}/catalogue?tri=nouveaute`}>Nouveautés</TitreSection>
            <GrilleProduits produits={nouveautes} slug={slug} format="grande" />
          </section>
        )}

        {sections.categories && <Categories categories={categories} slug={slug} />}
        {sections.apropos && <APropos boutique={boutique} />}
        {sections.avis && <Avis avis={avis} stats={boutique.stats} />}
      </>
    );
  }

  /* ── Catalogue : la liste tout de suite, dense ─────────────────── */
  if (modele === 'catalogue') {
    return (
      <>
        <Banniere boutique={boutique} compacte />

        {sections.categories && <Categories categories={categories} slug={slug} />}

        <section className="bq-section">
          <TitreSection lien={`/b/${slug}/catalogue`} libelleLien="Tout le catalogue">
            Nos produits
          </TitreSection>
          <GrilleProduits produits={produitsVedettes} slug={slug} format="ligne" />
        </section>

        {nouveautes.length > 0 && (
          <section className="bq-section">
            <TitreSection lien={`/b/${slug}/catalogue?tri=nouveaute`}>Arrivages récents</TitreSection>
            <GrilleProduits produits={nouveautes} slug={slug} format="ligne" />
          </section>
        )}

        {sections.apropos && <APropos boutique={boutique} />}
        {sections.avis && <Avis avis={avis} stats={boutique.stats} />}
      </>
    );
  }

  /* ── Classique ─────────────────────────────────────────────────── */
  return (
    <>
      <Banniere boutique={boutique} />

      {sections.categories && <Categories categories={categories} slug={slug} />}

      <section className="bq-section">
        <TitreSection lien={`/b/${slug}/catalogue`}>Les plus demandés</TitreSection>
        <GrilleProduits produits={produitsVedettes} slug={slug} />
      </section>

      {nouveautes.length > 0 && (
        <section className="bq-section">
          <TitreSection lien={`/b/${slug}/catalogue?tri=nouveaute`}>Nouveautés</TitreSection>
          <GrilleProduits produits={nouveautes} slug={slug} />
        </section>
      )}

      {sections.apropos && <APropos boutique={boutique} />}
      {sections.avis && <Avis avis={avis} stats={boutique.stats} />}
    </>
  );
}
