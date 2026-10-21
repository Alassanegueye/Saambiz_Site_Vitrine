import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/** Barre discrète des pages internes : le logo et le nom ramènent à la boutique. */
export default function BarreRetour({ boutique }) {
  return (
    <header className="bq-barre-retour">
      <Link to={`/b/${boutique.slug}`} className="bq-barre-retour__lien" aria-label={`Retour à ${boutique.nom}`}>
        <ArrowLeft size={18} strokeWidth={2.2} aria-hidden="true" />
        {boutique.logo
          ? <img src={boutique.logo} alt="" className="bq-barre-retour__logo" />
          : <span className="bq-barre-retour__initiale" aria-hidden="true">{boutique.nom.charAt(0).toUpperCase()}</span>}
        <span className="bq-barre-retour__nom">{boutique.nom}</span>
      </Link>
    </header>
  );
}
