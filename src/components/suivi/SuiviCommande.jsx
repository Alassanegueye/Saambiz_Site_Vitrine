import { useEffect, useRef, useState } from 'react';
import { PackageSearch, ArrowRight, Loader2, CircleAlert } from 'lucide-react';
import { suivreParNumero } from '../../boutique/api';
import FenetreCommande from './FenetreCommande';
import { mettreEnFormeNumero } from './etapes';
import './suivi.css';

/**
 * « Suivre ma commande », en haut de l'accueil de saambiz.com.
 *
 * Pour le client qui a commandé sur le site d'une boutique sans avoir
 * l'application : il entre son numéro de commande et le téléphone donné en
 * commandant, la fenêtre de la commande s'ouvre (état d'avancement,
 * modification, annulation). Le serveur vérifie que le téléphone est bien
 * celui de la personne qui a commandé.
 *
 * La page de confirmation d'une commande renvoie ici par `/#suivi` : le
 * champ reçoit alors le focus.
 */
export default function SuiviCommande() {
  const [numero, setNumero] = useState('');
  // Jamais prérempli : sur un appareil partagé, le numéro d'un autre client
  // n'a rien à faire dans ce champ.
  const [telephone, setTelephone] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState(null);
  // Le champ en cause, encadré en rouge : le numéro ou le téléphone.
  const [champFautif, setChampFautif] = useState(null);
  const [commande, setCommande] = useState(null);
  const champ = useRef(null);
  const champTel = useRef(null);

  useEffect(() => {
    if (window.location.hash !== '#suivi') return undefined;
    // Après l'animation d'ouverture du site : le champ doit être visible.
    const id = setTimeout(() => {
      champ.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      champ.current?.focus({ preventScroll: true });
    }, 400);
    return () => clearTimeout(id);
  }, []);

  const rechercher = async (e) => {
    e.preventDefault();
    const forme = mettreEnFormeNumero(numero);
    if (forme.replace(/[^0-9A-Z]/g, '').length < 12) {
      setErreur('Entrez votre numéro de commande complet, par exemple CMD-7KQ4-M2XD-9HTB.');
      setChampFautif('numero');
      champ.current?.focus();
      return;
    }
    if (telephone.replace(/\D/g, '').length < 9) {
      setErreur('Entrez le numéro de téléphone donné en commandant.');
      setChampFautif('tel');
      champTel.current?.focus();
      return;
    }
    setNumero(forme);
    setEnCours(true);
    setErreur(null);
    try {
      setCommande(await suivreParNumero(forme, telephone));
    } catch (err) {
      setErreur(err.message);
      const tel = err.code === 'TELEPHONE_INCORRECT' || err.code === 'TELEPHONE_REQUIS';
      setChampFautif(tel ? 'tel' : err.statut === 404 ? 'numero' : null);
      if (tel) champTel.current?.focus();
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="sc" id="suivi">
      <form className="sc-formulaire" onSubmit={rechercher} noValidate>
        <div className="sc-entete">
          <span className="sc-entete__icone" aria-hidden="true">
            <PackageSearch size={20} strokeWidth={2.1} />
          </span>
          <div>
            <label className="sc-entete__titre" htmlFor="sc-numero">Suivre ma commande</label>
            <p className="sc-entete__texte">Commandé sur le site d’une boutique ? Entrez votre numéro de commande et votre téléphone.</p>
          </div>
        </div>

        <div className="sc-ligne">
          <input
            id="sc-numero"
            ref={champ}
            className="sc-champ sc-champ--numero"
            type="text"
            inputMode="text"
            value={numero}
            onChange={(e) => { setNumero(e.target.value.toUpperCase()); setErreur(null); setChampFautif(null); }}
            onBlur={() => numero && setNumero(mettreEnFormeNumero(numero))}
            placeholder="Numéro de commande"
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck="false"
            maxLength={24}
            aria-describedby={erreur ? 'sc-erreur' : undefined}
            aria-invalid={Boolean(erreur) && champFautif === 'numero'}
          />
          <input
            ref={champTel}
            className="sc-champ sc-champ--tel"
            type="tel"
            value={telephone}
            onChange={(e) => { setTelephone(e.target.value); setErreur(null); setChampFautif(null); }}
            placeholder="Téléphone"
            autoComplete="off"
            required
            aria-describedby={erreur ? 'sc-erreur' : undefined}
            aria-invalid={Boolean(erreur) && champFautif === 'tel'}
            aria-label="Numéro de téléphone donné en commandant"
          />
          <button type="submit" className="sc-bouton" disabled={enCours}>
            {enCours
              ? <><Loader2 size={17} strokeWidth={2.4} className="sc-tourne" aria-hidden="true" /> Recherche…</>
              : <>Suivre <ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" /></>}
          </button>
        </div>

        {erreur && (
          <p className="sc-erreur" id="sc-erreur" role="alert">
            <CircleAlert size={15} strokeWidth={2.3} aria-hidden="true" /> {erreur}
          </p>
        )}
      </form>

      {commande && (
        <FenetreCommande
          commande={commande}
          telephone={telephone}
          onChange={setCommande}
          onClose={() => { setCommande(null); champ.current?.focus(); }}
        />
      )}
    </div>
  );
}
