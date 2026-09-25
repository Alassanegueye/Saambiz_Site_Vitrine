import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Store, Banknote, AlertCircle, Loader2 } from 'lucide-react';
import { envoyerCommande, formaterPrix } from '../api';
import { usePanier } from '../panierContexte';
import { EtatVide } from '../composants';

/**
 * Le passage en caisse.
 *
 * Le formulaire le plus court possible : nom, téléphone, et l'adresse
 * seulement si le client se fait livrer. Pas de mot de passe, pas d'email
 * obligatoire, pas de confirmation par code. Chaque champ ajouté ici est une
 * commande perdue — et le client vient d'un lien WhatsApp, il n'a jamais
 * entendu parler de SaamBiz.
 *
 * Le compte est créé en arrière-plan, à partir du numéro. Le client
 * l'apprend après coup, sur la page de confirmation, comme une bonne
 * nouvelle : « installez l'application, votre commande vous y attend ».
 */

const CLE_CLIENT = 'saambiz.client';

/** Les coordonnées du dernier passage en caisse, tous sites confondus. */
function lireClient() {
  try {
    const brut = localStorage.getItem(CLE_CLIENT);
    return brut ? JSON.parse(brut) : {};
  } catch {
    return {};
  }
}

export default function Commande({ boutique }) {
  const { lignes, sousTotal, versItems, detailVariantes, vider } = usePanier();
  const navigate = useNavigate();
  const base = `/b/${boutique.slug}`;

  const memorise = lireClient();
  const [form, setForm] = useState({
    prenom: memorise.prenom || '',
    nom: memorise.nom || '',
    telephone: memorise.telephone || '',
    email: memorise.email || '',
    adresseLivraison: memorise.adresseLivraison || '',
    note: '',
    modeLivraison: 'livraison',
    modePaiement: boutique.paiementLivraison ? 'a_la_livraison' : 'en_ligne',
  });
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState(null);

  const changer = (champ) => (e) => {
    setForm((f) => ({ ...f, [champ]: e.target.value }));
    setErreur(null);
  };

  if (!lignes.length) {
    return (
      <div className="bq-section">
        <EtatVide
          titre="Votre panier est vide"
          texte="Ajoutez au moins un produit avant de commander."
          action={<Link to={`${base}/catalogue`} className="bq-bouton">Voir les produits</Link>}
        />
      </div>
    );
  }

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur(null);

    // Contrôles de surface seulement : le serveur revalide tout, y compris le
    // format du numéro, le stock et l'appartenance des produits à la boutique.
    // Il s'agit ici d'éviter un aller-retour réseau pour un champ vide.
    if (!form.prenom.trim() || !form.nom.trim()) {
      return setErreur('Indiquez votre prénom et votre nom.');
    }
    if (form.telephone.replace(/\D/g, '').length < 9) {
      return setErreur('Indiquez un numéro de téléphone valide, par exemple 77 123 45 67.');
    }
    if (form.modeLivraison === 'livraison' && !form.adresseLivraison.trim()) {
      return setErreur('Indiquez où livrer votre commande.');
    }

    setEnvoi(true);
    try {
      // Les variantes choisies sont reportées dans la note : la ligne de
      // commande enregistrée reprend le nom du produit au catalogue, la
      // taille n'y apparaîtrait nulle part.
      const options = detailVariantes();
      const note = [form.note.trim(), options && `Options : ${options}`]
        .filter(Boolean)
        .join('\n');

      const resultat = await envoyerCommande(boutique.slug, {
        client: {
          nom: form.nom.trim(),
          prenom: form.prenom.trim(),
          telephone: form.telephone.trim(),
          email: form.email.trim() || undefined,
        },
        items: versItems(),
        modeLivraison: form.modeLivraison,
        modePaiement: form.modePaiement,
        adresseLivraison: form.modeLivraison === 'livraison' ? form.adresseLivraison.trim() : null,
        note: note || undefined,
      });

      // Les coordonnées sont mémorisées pour la prochaine commande, chez ce
      // vendeur comme chez un autre. Rien de sensible : ce que le client
      // vient de taper, sur son propre appareil.
      try {
        localStorage.setItem(CLE_CLIENT, JSON.stringify({
          prenom: form.prenom.trim(),
          nom: form.nom.trim(),
          telephone: resultat.telephone,
          email: form.email.trim(),
          adresseLivraison: form.adresseLivraison.trim(),
        }));
      } catch { /* stockage indisponible — sans conséquence */ }

      vider();

      // La confirmation reçoit le résultat par l'état de navigation : elle ne
      // le redemande pas au serveur, et un rechargement de la page ne
      // relancerait donc jamais une commande.
      navigate(`${base}/confirmation`, { state: { resultat }, replace: true });

    } catch (e) {
      // Le message vient du serveur — « Stock insuffisant pour "Boubou brodé"
      // (reste 2) » — et il est plus utile que tout ce qu'on écrirait ici.
      setErreur(e.message);
      setEnvoi(false);
    }
  };

  return (
    <div className="bq-section">
      <h1 className="bq-page-titre">Finaliser ma commande</h1>

      <form className="bq-commande" onSubmit={soumettre} noValidate>
        <div className="bq-commande__champs">

          <fieldset className="bq-bloc">
            <legend>Vos coordonnées</legend>

            <div className="bq-duo">
              <label className="bq-label">
                Prénom
                <input type="text" value={form.prenom} onChange={changer('prenom')} autoComplete="given-name" required />
              </label>
              <label className="bq-label">
                Nom
                <input type="text" value={form.nom} onChange={changer('nom')} autoComplete="family-name" required />
              </label>
            </div>

            <label className="bq-label">
              Téléphone
              {/* type="tel" ouvre le pavé numérique sur mobile — la moitié des
                  visites au moins. */}
              <input
                type="tel"
                value={form.telephone}
                onChange={changer('telephone')}
                placeholder="77 123 45 67"
                autoComplete="tel"
                required
              />
              <small>Le vendeur vous appellera sur ce numéro. Il vous servira aussi à suivre votre commande.</small>
            </label>

            <label className="bq-label">
              <span className="bq-label__ligne">
                Email <span className="bq-facultatif">facultatif</span>
              </span>
              <input type="email" value={form.email} onChange={changer('email')} autoComplete="email" />
            </label>
          </fieldset>

          <fieldset className="bq-bloc">
            <legend>Livraison</legend>

            <div className="bq-choix">
              <label className={`bq-choix__option ${form.modeLivraison === 'livraison' ? 'est-actif' : ''}`}>
                <input
                  type="radio"
                  name="modeLivraison"
                  value="livraison"
                  checked={form.modeLivraison === 'livraison'}
                  onChange={changer('modeLivraison')}
                />
                <Truck size={19} strokeWidth={2} aria-hidden="true" />
                <span><strong>Me faire livrer</strong>Le vendeur vous livre à l'adresse indiquée.</span>
              </label>

              <label className={`bq-choix__option ${form.modeLivraison === 'retrait' ? 'est-actif' : ''}`}>
                <input
                  type="radio"
                  name="modeLivraison"
                  value="retrait"
                  checked={form.modeLivraison === 'retrait'}
                  onChange={changer('modeLivraison')}
                />
                <Store size={19} strokeWidth={2} aria-hidden="true" />
                <span>
                  <strong>Retirer sur place</strong>
                  {boutique.localisation || boutique.ville || 'Chez le vendeur'} — sans frais de livraison.
                </span>
              </label>
            </div>

            {form.modeLivraison === 'livraison' && (
              <label className="bq-label">
                Adresse de livraison
                <textarea
                  value={form.adresseLivraison}
                  onChange={changer('adresseLivraison')}
                  rows={2}
                  placeholder="Quartier, rue, point de repère…"
                  autoComplete="street-address"
                  required
                />
                <small>Un point de repère aide plus qu'un numéro de rue.</small>
              </label>
            )}
          </fieldset>

          <fieldset className="bq-bloc">
            <legend>Paiement</legend>

            {boutique.paiementLivraison ? (
              <label className="bq-choix__option est-actif">
                <input type="radio" name="modePaiement" value="a_la_livraison" checked readOnly />
                <Banknote size={19} strokeWidth={2} aria-hidden="true" />
                <span>
                  <strong>{form.modeLivraison === 'retrait' ? 'Payer au retrait' : 'Payer à la livraison'}</strong>
                  Vous réglez en espèces quand vous recevez votre commande.
                </span>
              </label>
            ) : (
              <p className="bq-info">
                Cette boutique règle le paiement directement avec vous. Le vendeur
                vous rappellera après votre commande.
              </p>
            )}
          </fieldset>

          <fieldset className="bq-bloc">
            <legend>Un mot pour le vendeur <span className="bq-facultatif">facultatif</span></legend>
            <textarea
              value={form.note}
              onChange={changer('note')}
              rows={2}
              placeholder="Une précision sur votre commande, une heure de livraison…"
            />
          </fieldset>
        </div>

        <aside className="bq-recap">
          <h2>Votre commande</h2>

          <ul className="bq-recap__articles">
            {lignes.map((l) => (
              <li key={l.cle}>
                <span>{l.quantite} × {l.nom}</span>
                <strong>{formaterPrix(l.prix * l.quantite)}</strong>
              </li>
            ))}
          </ul>

          <p className="bq-recap__ligne">
            <span>Sous-total</span>
            <strong>{formaterPrix(sousTotal)}</strong>
          </p>

          <p className="bq-recap__ligne bq-recap__ligne--sourde">
            <span>Livraison</span>
            <span>{form.modeLivraison === 'retrait' ? 'Offerte (retrait)' : 'Ajoutée par le vendeur'}</span>
          </p>

          {erreur && (
            <p className="bq-erreur" role="alert">
              <AlertCircle size={17} strokeWidth={2.2} aria-hidden="true" /> {erreur}
            </p>
          )}

          <button type="submit" className="bq-bouton bq-bouton--grand bq-bouton--bloc" disabled={envoi}>
            {envoi
              ? (<><Loader2 size={17} strokeWidth={2.4} className="bq-tourne" aria-hidden="true" /> Envoi en cours…</>)
              : 'Confirmer ma commande'}
          </button>

          <p className="bq-recap__note">
            En confirmant, vous acceptez d'être contacté par {boutique.nom} au
            sujet de cette commande.
          </p>
        </aside>
      </form>
    </div>
  );
}
