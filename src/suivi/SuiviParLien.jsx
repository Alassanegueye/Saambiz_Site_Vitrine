import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, Loader2, Mail, Check } from 'lucide-react';
import { suivreParLien, demanderLienSuivi, formaterPrix } from '../boutique/api';
import { Progression } from '../boutique/Progression';
import { libelleStatut } from '../boutique/etapesCommande';
import '../boutique/vitrine.css';

/**
 * Suivre ses commandes par le lien reçu par email.
 *
 * Un client qui commande sur le site d'une boutique n'a pas de compte : sans
 * ce lien, il n'a aucun moyen de revenir voir où en est sa commande. Le lien
 * ouvre TOUTES les commandes de son adresse — il a pu commander plusieurs
 * fois, chez plusieurs boutiques.
 *
 * Trois écrans, et ils ne disent pas la même chose :
 *   • le lien est valable → ses commandes ;
 *   • 410, le lien a expiré → « demandez-en un autre », avec le formulaire ;
 *   • 404, le lien n'existe pas → l'adresse a été mal recopiée.
 */

const dateLisible = (valeur) => (valeur
  ? new Date(valeur).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  : '');

/** Le formulaire de renvoi, montré quand le lien a expiré ou est inconnu. */
function DemanderLien({ titre, texte }) {
  const [email, setEmail] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState(null);

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur(null);
    const adresse = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(adresse)) {
      return setErreur('Indiquez l’adresse email utilisée pour la commande.');
    }
    setEnvoi(true);
    try {
      await demanderLienSuivi(adresse);
      setEnvoye(true);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
    return undefined;
  };

  if (envoye) {
    return (
      <div className="bq-suivi__etat" role="status">
        <Check size={22} aria-hidden="true" />
        <h1 className="bq-page-titre">C’est envoyé</h1>
        <p>
          Si des commandes existent à cette adresse, un nouveau lien vient d’y
          être envoyé. Pensez à regarder dans les courriers indésirables.
        </p>
      </div>
    );
  }

  return (
    <div className="bq-suivi__etat">
      <AlertCircle size={22} aria-hidden="true" />
      <h1 className="bq-page-titre">{titre}</h1>
      <p>{texte}</p>

      <form className="bq-suivi__formulaire" onSubmit={soumettre}>
        <label className="bq-label">
          Votre adresse email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nom@exemple.com"
            autoComplete="email"
            required
          />
          <small>Celle que vous avez indiquée en commandant.</small>
        </label>
        {erreur && <p className="bq-erreur" role="alert">{erreur}</p>}
        <button type="submit" className="bq-bouton" disabled={envoi}>
          {envoi ? <><Loader2 size={16} className="bq-tourne" aria-hidden="true" /> Envoi…</> : <><Mail size={16} aria-hidden="true" /> Recevoir un nouveau lien</>}
        </button>
      </form>
    </div>
  );
}

/** Une commande et son avancement. */
function Commande({ commande, ouverte }) {
  const boutique = commande.boutique;
  return (
    <article className={`bq-suivi__commande${ouverte ? ' est-ouverte' : ''}`}>
      <header className="bq-suivi__entete">
        <div>
          <h2>{commande.reference}</h2>
          <p className="bq-suivi__meta">
            {boutique?.nom ? `${boutique.nom} · ` : ''}{dateLisible(commande.creeeLe)}
          </p>
        </div>
        <span className="bq-etiquette">{libelleStatut(commande.statut)}</span>
      </header>

      <Progression statut={commande.statut} modeLivraison={commande.modeLivraison} />

      <ul className="bq-suivi__lignes">
        {(commande.lignes || []).map((l, i) => (
          <li key={`${commande.id}-${i}`}>
            <span>{l.nom} × {l.quantite}</span>
            <strong>{formaterPrix(l.sousTotal)}</strong>
          </li>
        ))}
      </ul>

      <dl className="bq-suivi__totaux">
        {Number(commande.fraisLivraison) > 0 && (
          <div><dt>Livraison</dt><dd>{formaterPrix(commande.fraisLivraison)}</dd></div>
        )}
        <div className="est-total"><dt>Total</dt><dd>{formaterPrix(commande.montantTotal)}</dd></div>
      </dl>

      {boutique?.telephone && (
        <p className="bq-suivi__contact">
          Une question ? Appelez {boutique.nom} au{' '}
          <a href={`tel:${boutique.telephone}`}>{boutique.telephone}</a>.
        </p>
      )}
      {boutique?.slug && (
        <Link className="bq-lien" to={`/b/${boutique.slug}`}>Revoir la boutique</Link>
      )}
    </article>
  );
}

export default function SuiviParLien() {
  const { jeton } = useParams();
  const [data, setData] = useState(null);
  const [erreur, setErreur] = useState(null);
  // Sans jeton, rien ne charge : l'état part déjà à faux plutôt que d'être
  // corrigé depuis l'effet, ce qui provoquerait un rendu en cascade.
  const [chargement, setChargement] = useState(Boolean(jeton));

  useEffect(() => {
    // Adresse tapée de mémoire, sans jeton : inutile d'interroger le serveur
    // pour lui faire dire que « undefined » n'est pas un lien.
    if (!jeton) return undefined;

    let annule = false;
    suivreParLien(jeton)
      .then((d) => { if (!annule) { setData(d); setErreur(null); } })
      .catch((e) => { if (!annule) { setData(null); setErreur(e); } })
      .finally(() => { if (!annule) setChargement(false); });
    return () => { annule = true; };
  }, [jeton]);

  if (!jeton) {
    return (
      <DemanderLien
        titre="Suivre mes commandes"
        texte="Indiquez l’adresse email utilisée pour commander : nous vous enverrons le lien qui donne accès à vos commandes."
      />
    );
  }

  if (chargement) {
    return (
      <div className="bq-suivi__etat" role="status">
        <Loader2 size={22} className="bq-tourne" aria-hidden="true" />
        <p>Nous retrouvons vos commandes…</p>
      </div>
    );
  }

  // 410 : le lien a existé et il a expiré. C'est le cas normal au bout de
  // quinze jours, pas une erreur du client — le message le dit ainsi.
  if (erreur?.statut === 410) {
    return (
      <DemanderLien
        titre="Ce lien a expiré"
        texte="Pour votre sécurité, un lien de suivi ne reste valable que quinze jours. Indiquez votre adresse email et nous vous en enverrons un nouveau."
      />
    );
  }

  if (erreur) {
    return (
      <DemanderLien
        titre="Ce lien est introuvable"
        texte="L’adresse a peut-être été coupée en chemin. Indiquez votre adresse email et nous vous enverrons un lien neuf."
      />
    );
  }

  const commandes = data?.commandes || [];

  return (
    <div className="bq-section bq-suivi bq-suivi--lien">
      <h1 className="bq-page-titre">Mes commandes</h1>
      <p className="bq-suivi__intro">
        {commandes.length === 0
          ? 'Aucune commande n’est rattachée à cette adresse.'
          : `${commandes.length} commande${commandes.length > 1 ? 's' : ''} · ${data.email}`}
      </p>

      {commandes.map((c) => (
        <Commande key={c.id} commande={c} ouverte={c.id === data.commandeOuverte} />
      ))}

      {data?.expireLe && (
        <p className="bq-suivi__note">
          Ce lien vous est personnel et reste valable jusqu’au {dateLisible(data.expireLe)}.
        </p>
      )}
    </div>
  );
}
