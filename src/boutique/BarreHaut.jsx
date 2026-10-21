import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Barre des pages internes (fiche produit, commande, suivi) : un retour vers
 * la boutique. L'accueil n'en a pas — le site commence par l'identité de la
 * boutique.
 */
export default function BarreHaut({ boutique }) {
  return (
    <header className="bq-haut">
      <div className="bq-haut__interieur">
        <Link to={`/b/${boutique.slug}`} className="bq-haut__retour" aria-label={`Retour à ${boutique.nom}`}>
          <ArrowLeft size={22} strokeWidth={2.2} aria-hidden="true" />
          <span>{boutique.nom}</span>
        </Link>
      </div>
    </header>
  );
}
