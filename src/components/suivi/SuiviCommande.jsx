import { useEffect, useRef, useState } from 'react';
import { PackageSearch, ArrowRight, Loader2, CircleAlert } from 'lucide-react';
import { suivreParNumero } from '../../boutique/api';
import FenetreCommande from './FenetreCommande';
import { estAncienNumero, mettreEnFormeNumero } from './etapes';
import './suivi.css';

/**
 * « Suivre ma commande », en haut de l'accueil de saambiz.com.
 *
 * Pour le client qui a commandé sur le site d'une boutique sans avoir
 * l'application : il entre son numéro de commande, la fenêtre de la commande
 * s'ouvre (état d'avancement, modification, annulation). Le numéro suffit —
 * il est long et tiré au hasard, impossible à deviner. Un ancien numéro,
 * plus court, demande en plus le téléphone utilisé.
 *
 * La page de confirmation d'une commande renvoie ici par `/#suivi` : le
 * champ reçoit alors le focus.
 */
export default function SuiviCommande() {
  const [numero, setNumero] = useState('');
  const [telephone, setTelephone] = useState('');
  const [demanderTelephone, setDemanderTelephone] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [commande, setCommande] = useState(null);
  const champ = useRef(null);

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
      champ.current?.focus();
      return;
    }
    const ancien = estAncienNumero(forme);
    if (ancien && telephone.replace(/\D/g, '').length < 9) {
      setDemanderTelephone(true);
      setErreur('Pour une commande passée avant le 26 novembre 2026, indiquez aussi le numéro de téléphone utilisé.');
      return;
    }
    setNumero(forme);
    setEnCours(true);
    setErreur(null);
    try {
      setCommande(await suivreParNumero(forme, ancien ? telephone : undefined));
    } catch (err) {
      if (err.code === 'TELEPHONE_REQUIS') setDemanderTelephone(true);
      setErreur(err.message);
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
            <p className="sc-entete__texte">Commandé sur le site d’une boutique ? Entrez votre numéro de commande.</p>
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
            onChange={(e) => { setNumero(e.target.value.toUpperCase()); setErreur(null); }}
            onBlur={() => numero && setNumero(mettreEnFormeNumero(numero))}
            placeholder="CMD-XXXX-XXXX-XXXX"
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck="false"
            maxLength={24}
            aria-describedby={erreur ? 'sc-erreur' : undefined}
            aria-invalid={Boolean(erreur)}
          />
          {demanderTelephone && (
            <input
              className="sc-champ sc-champ--tel"
              type="tel"
              value={telephone}
              onChange={(e) => { setTelephone(e.target.value); setErreur(null); }}
              placeholder="Téléphone utilisé"
              autoComplete="tel"
              aria-label="Numéro de téléphone utilisé pour la commande"
            />
          )}
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
          telephone={demanderTelephone ? telephone : undefined}
          onChange={setCommande}
          onClose={() => { setCommande(null); champ.current?.focus(); }}
        />
      )}
    </div>
  );
}
