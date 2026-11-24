import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { formaterPrix } from './api';
import { usePanier } from './panierContexte';
import { ImageProduit } from './composants';
import Feuille from './Feuille';
import LignePanier from './LignePanier';
import { lienWhatsappBoutique } from './outils';

/**
 * Le panier, en volet : il s'ouvre depuis le bouton Panier de la barre du
 * haut, ou depuis la bulle ronde qui apparaît en bas à droite dès qu'un
 * article est ajouté. Sur ordinateur, un tiroir étroit à droite ; sur
 * téléphone, un volet qui monte du bas et se ferme d'un glissement.
 */

/** « Tout cocher » et le nombre d'articles retenus pour la commande. */
export function BarreSelection({ lignes, toutCocher }) {
  const toutes = lignes.every((l) => !l.exclue);
  const aucune = lignes.every((l) => l.exclue);
  const retenues = lignes.filter((l) => !l.exclue).length;
  return (
    <div className="bq-selection">
      <label className="bq-case bq-case--texte">
        <input type="checkbox" checked={toutes}
          ref={(el) => { if (el) el.indeterminate = !toutes && !aucune; }}
          onChange={() => toutCocher(!toutes)} />
        <span className="bq-case__boite" aria-hidden="true"><Check size={14} strokeWidth={3.2} /></span>
        <span>Tout sélectionner</span>
      </label>
      <span className="bq-selection__compte">
        {retenues} / {lignes.length} article{lignes.length > 1 ? 's' : ''} pour la commande
      </span>
    </div>
  );
}

/** Le petit message « Ajouté au panier », quelques secondes après un ajout. */
function Annonce({ panierOuvert }) {
  const { annonce, effacerAnnonce, ouvrirPanier } = usePanier();
  useEffect(() => {
    if (!annonce) return undefined;
    const t = setTimeout(effacerAnnonce, 3200);
    return () => clearTimeout(t);
  }, [annonce, effacerAnnonce]);

  if (!annonce || panierOuvert) return null;
  return (
    <div key={annonce.n} className="bq-annonce" role="status" aria-live="polite">
      <ImageProduit src={annonce.image} alt="" className="bq-annonce__image" />
      <p>
        <strong>Ajouté au panier</strong>
        <span>{annonce.quantite > 1 ? `${annonce.quantite} × ` : ''}{annonce.nom}</span>
      </p>
      {ouvrirPanier && (
        <button type="button" className="bq-annonce__voir" onClick={() => { effacerAnnonce(); ouvrirPanier(); }}>
          Voir le panier
        </button>
      )}
    </div>
  );
}

export default function PanierFlottant({ boutique, ouvert, setOuvert, bulle = true }) {
  const { lignes, nombreArticles, nombreChoisis, sousTotal, toutCocher } = usePanier();
  const navigate = useNavigate();

  if (!boutique.commandeActivee) return null;

  const fermer = () => setOuvert(false);
  const commander = () => {
    setOuvert(false);
    navigate(`/b/${boutique.slug}/commande`);
  };
  const avecWhatsapp = Boolean(lienWhatsappBoutique(boutique));

  const pied = lignes.length > 0 && (
    <>
      <p className="bq-feuille__total">
        <span>Total {nombreChoisis > 0 && <small>({nombreChoisis} article{nombreChoisis > 1 ? 's' : ''})</small>}</span>
        <strong>{formaterPrix(sousTotal)}</strong>
      </p>
      <button type="button" className="bq-bouton bq-bouton--grand bq-bouton--bloc" onClick={commander} disabled={nombreChoisis === 0}>
        {nombreChoisis === 0 ? 'Cochez au moins un article' : 'Passer la commande'}
      </button>
      <button type="button" className="bq-lien bq-feuille__suite" onClick={() => { fermer(); navigate(`/b/${boutique.slug}/panier`); }}>
        Voir le panier en grand
      </button>
    </>
  );

  return (
    <>
      {bulle && nombreArticles > 0 && !ouvert && (
        <button type="button" className={`bq-bulle ${avecWhatsapp ? 'bq-bulle--sur-wa' : ''}`}
          onClick={() => setOuvert(true)}
          aria-label={`Ouvrir le panier — ${nombreArticles} article${nombreArticles > 1 ? 's' : ''}`}>
          <ShoppingBag size={25} strokeWidth={2} aria-hidden="true" />
          {/* La clé relance le rebond à chaque ajout. */}
          <span key={nombreArticles} className="bq-bulle__nombre" aria-hidden="true">
            {nombreArticles > 99 ? '99+' : nombreArticles}
          </span>
        </button>
      )}

      <Annonce panierOuvert={ouvert} />

      <Feuille ouvert={ouvert} onFermer={fermer} mode="tiroir" etiquette="Mon panier" className="bq-panier-volet"
        titre={<>Mon panier {nombreArticles > 0 && <span className="bq-feuille__nombre">{nombreArticles}</span>}</>}
        sousTitre={lignes.length > 0 ? "Livraison calculée à l'étape suivante · sans compte" : null}
        pied={pied}>
        {lignes.length === 0 ? (
          <div className="bq-feuille__vide">
            <span className="bq-feuille__vide-icone"><ShoppingBag size={30} strokeWidth={1.7} aria-hidden="true" /></span>
            <p>Votre panier est vide.</p>
            <button type="button" className="bq-bouton"
              onClick={() => { fermer(); navigate(`/b/${boutique.slug}/produits`); }}>
              Voir nos produits
            </button>
          </div>
        ) : (
          <>
            {lignes.length > 1 && <BarreSelection lignes={lignes} toutCocher={toutCocher} />}
            <ul className="bq-lps">
              {lignes.map((l) => (
                <LignePanier key={l.uid || l.cle} ligne={l} slug={boutique.slug} onNaviguer={fermer} />
              ))}
            </ul>
          </>
        )}
      </Feuille>
    </>
  );
}
