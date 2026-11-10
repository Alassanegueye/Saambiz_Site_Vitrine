import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, ShoppingBag, X } from 'lucide-react';
import { usePanier } from './panierContexte';
import { LogoBoutique } from './IdentiteBoutique';

/**
 * La barre du haut, la même sur toutes les pages : la boutique (retour à
 * l'accueil), la recherche dans son catalogue, et le panier.
 *
 * Sur téléphone, la recherche se replie derrière une loupe : la barre garde
 * la place pour le nom de la boutique, qui est ce que le client doit lire.
 */
export default function BarreHaut({ boutique, estAccueil, ouvrirPanier, recherche = true }) {
  const base = `/b/${boutique.slug}`;
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { nombreArticles } = usePanier();
  const [ouverte, setOuverte] = useState(false);
  const [saisie, setSaisie] = useState(params.get('q') || '');
  const champ = useRef(null);

  useEffect(() => {
    if (ouverte) champ.current?.focus();
  }, [ouverte]);

  const chercher = (e) => {
    e.preventDefault();
    const q = saisie.trim();
    if (!q) return;
    setOuverte(false);
    champ.current?.blur();
    navigate(`${base}/catalogue?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className={`bq-haut ${estAccueil ? 'bq-haut--accueil' : ''} ${ouverte ? 'est-en-recherche' : ''}`}>
      <div className="bq-haut__interieur">
        {!estAccueil && (
          <Link to={base} className="bq-haut__icone bq-haut__retour" aria-label={`Retour à l'accueil de ${boutique.nom}`}>
            <ArrowLeft size={21} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        )}

        {/* Sur l'accueil, le nom est écrit juste dessous : la barre ne le
            répète pas, elle montre la recherche. */}
        {!estAccueil && (
          <Link to={base} className="bq-haut__marque">
            <LogoBoutique boutique={boutique} className="bq-haut__logo" />
            <span className="bq-haut__nom">{boutique.nom}</span>
          </Link>
        )}

        {recherche && (
          <form className="bq-haut__recherche" role="search" onSubmit={chercher}>
            <Search size={18} strokeWidth={2.2} aria-hidden="true" />
            <input
              ref={champ}
              type="search"
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              placeholder={`Rechercher chez ${boutique.nom}`}
              aria-label={`Rechercher un produit chez ${boutique.nom}`}
              enterKeyHint="search"
            />
            <button type="button" className="bq-haut__fermer" onClick={() => { setOuverte(false); setSaisie(''); }}
              aria-label="Fermer la recherche">
              <X size={18} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </form>
        )}

        <div className="bq-haut__outils">
          {recherche && (
            <button type="button" className="bq-haut__icone bq-haut__loupe" onClick={() => setOuverte(true)}
              aria-label="Rechercher un produit">
              <Search size={21} strokeWidth={2.2} aria-hidden="true" />
            </button>
          )}
          {boutique.commandeActivee && (
            <button type="button" className="bq-haut__icone bq-haut__panier" onClick={ouvrirPanier}
              aria-label={nombreArticles > 0
                ? `Ouvrir le panier — ${nombreArticles} article${nombreArticles > 1 ? 's' : ''}`
                : 'Ouvrir le panier'}>
              <ShoppingBag size={21} strokeWidth={2.2} aria-hidden="true" />
              {nombreArticles > 0 && <span key={nombreArticles} className="bq-haut__nombre">{nombreArticles}</span>}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
