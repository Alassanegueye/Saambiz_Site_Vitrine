import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Copy, Check, Truck, ShoppingBag, MapPin, Phone, StickyNote, Pencil, MessageCircle,
  RefreshCw, Ban, CircleAlert, Loader2, Store, PackageCheck,
} from 'lucide-react';
import { annulerCommandeSuivie, formaterPrix, modifierCommandeSuivie, suivreParNumero } from '../../boutique/api';
import { formaterTelephone, lienTelephone, lienWhatsapp } from '../../boutique/outils';
import { etapesDe, etatDe, estTerminee, formaterDateHeure, positionDe } from './etapes';

/**
 * La fenêtre d'une commande, ouverte depuis « Suivre ma commande ».
 *
 * De haut en bas, ce que le client cherche : où en est ma commande (le
 * trajet, avec le véhicule à l'étape atteinte), puis ce qu'il peut faire —
 * corriger l'adresse, le téléphone ou la note tant que la boutique ne l'a
 * pas acceptée, l'annuler tant qu'elle n'est pas préparée, joindre la
 * boutique —, et enfin le détail des articles.
 */
export default function FenetreCommande({ commande, telephone, onChange, onClose }) {
  const fenetre = useRef(null);
  const [copie, setCopie] = useState(false);
  const [edition, setEdition] = useState(false);
  const [form, setForm] = useState(null);
  const [annulation, setAnnulation] = useState(false);
  const [motif, setMotif] = useState('');
  const [enCours, setEnCours] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [message, setMessage] = useState(null);

  // Échap ferme, la page derrière ne défile plus, le focus entre dans la fenêtre.
  useEffect(() => {
    const precedent = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    fenetre.current?.focus();
    const touche = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', touche);
    return () => {
      document.body.style.overflow = precedent;
      document.removeEventListener('keydown', touche);
    };
  }, [onClose]);

  const etat = etatDe(commande);
  const terminee = estTerminee(commande);
  const etapes = etapesDe(commande.modeLivraison);
  const position = positionDe(commande);
  const avance = terminee || position < 0 ? 0 : (position / (etapes.length - 1)) * 100;
  const retrait = commande.modeLivraison === 'retrait';
  const Vehicule = retrait ? ShoppingBag : Truck;
  const boutique = commande.boutique || {};
  const contact = boutique.whatsapp || boutique.telephone;

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(commande.reference);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch { /* le numéro reste sélectionnable à la main */ }
  };

  const executer = async (cle, action, succes) => {
    setEnCours(cle);
    setErreur(null);
    setMessage(null);
    try {
      const nouvelle = await action();
      onChange(nouvelle);
      if (succes) setMessage(succes);
      return true;
    } catch (err) {
      setErreur(err.message);
      return false;
    } finally {
      setEnCours(null);
    }
  };

  const actualiser = () => executer('actualiser', () => suivreParNumero(commande.reference, telephone));

  const ouvrirEdition = () => {
    setForm({
      adresseLivraison: commande.adresseLivraison || '',
      telephone: commande.telephone ? formaterTelephone(commande.telephone) : '',
      note: commande.note || '',
    });
    setAnnulation(false);
    setEdition(true);
    setMessage(null);
  };

  const enregistrer = async (e) => {
    e.preventDefault();
    const changements = { telephone: form.telephone, note: form.note };
    if (!retrait) changements.adresseLivraison = form.adresseLivraison;
    if (await executer('modifier', () => modifierCommandeSuivie(commande.reference, changements), 'Votre commande a été modifiée. La boutique est prévenue.')) {
      setEdition(false);
    }
  };

  const annuler = async () => {
    if (await executer('annuler', () => annulerCommandeSuivie(commande.reference, motif.trim() || undefined), 'Votre commande a été annulée. La boutique est prévenue.')) {
      setAnnulation(false);
    }
  };

  const lienWa = contact && lienWhatsapp(contact, `Bonjour, je vous écris au sujet de ma commande ${commande.reference}.`);

  return createPortal(
    <div className="sc-voile" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        className="sc-fenetre"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sc-fenetre-titre"
        tabIndex={-1}
        ref={fenetre}
      >
        {/* ─── En-tête : la boutique, le numéro ─── */}
        <header className="sc-fenetre__entete">
          <span className="sc-boutique__logo" aria-hidden="true">
            {boutique.logo ? <img src={boutique.logo} alt="" /> : (boutique.nom || 'S').charAt(0)}
          </span>
          <div className="sc-fenetre__titres">
            <h2 id="sc-fenetre-titre">{boutique.nom || 'Votre commande'}</h2>
            <p>Commande du {formaterDateHeure(commande.date)}</p>
          </div>
          <button type="button" className="sc-icone-bouton" onClick={onClose} aria-label="Fermer">
            <X size={20} strokeWidth={2.2} />
          </button>
        </header>

        <div className="sc-fenetre__corps">
          <div className="sc-numero">
            <span className="sc-numero__libelle">Numéro de commande</span>
            <span className="sc-numero__valeur">{commande.reference}</span>
            <button type="button" className="sc-lien-bouton" onClick={copier} aria-live="polite">
              {copie ? <><Check size={15} strokeWidth={2.5} aria-hidden="true" /> Copié</> : <><Copy size={15} strokeWidth={2.2} aria-hidden="true" /> Copier</>}
            </button>
          </div>

          {/* ─── Où en est la commande ─── */}
          <section className={`sc-etat ${terminee ? 'sc-etat--terminee' : ''} ${commande.statut === 'livree' ? 'sc-etat--livree' : ''}`} aria-live="polite">
            <div className="sc-etat__haut">
              <div>
                <h3 className="sc-etat__titre">
                  {terminee && <Ban size={18} strokeWidth={2.3} aria-hidden="true" />}
                  {commande.statut === 'livree' && <PackageCheck size={18} strokeWidth={2.3} aria-hidden="true" />}
                  {etat.titre}
                </h3>
                <p className="sc-etat__texte">{etat.texte}</p>
              </div>
              <button type="button" className="sc-icone-bouton sc-icone-bouton--doux" onClick={actualiser}
                disabled={enCours === 'actualiser'} aria-label="Actualiser l’état de la commande" title="Actualiser">
                <RefreshCw size={17} strokeWidth={2.2} className={enCours === 'actualiser' ? 'sc-tourne' : ''} />
              </button>
            </div>

            {!terminee && (
              <div className="sc-trajet" style={{ '--sc-avance': `${avance}%`, '--sc-nombre': etapes.length }}>
                <div className="sc-trajet__route" aria-hidden="true">
                  <span className="sc-trajet__fait" />
                  <span className={`sc-trajet__vehicule ${commande.statut === 'en_livraison' ? 'est-en-route' : ''}`}>
                    <Vehicule size={18} strokeWidth={2.2} />
                  </span>
                </div>
                <ol className="sc-trajet__etapes">
                  {etapes.map((etape, i) => (
                    <li key={etape.cle} className={`${i < position ? 'est-faite' : ''} ${i === position ? 'est-actuelle' : ''}`}
                      aria-current={i === position ? 'step' : undefined}>
                      <span className="sc-trajet__point" aria-hidden="true">{i < position && <Check size={10} strokeWidth={3.5} />}</span>
                      <span className="sc-trajet__libelle">{etape.libelle}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>

          {message && <p className="sc-message" role="status"><Check size={16} strokeWidth={2.5} aria-hidden="true" /> {message}</p>}
          {erreur && <p className="sc-erreur sc-erreur--bloc" role="alert"><CircleAlert size={16} strokeWidth={2.3} aria-hidden="true" /> {erreur}</p>}

          {/* ─── Réception : adresse, téléphone, note ─── */}
          <section className="sc-bloc">
            <div className="sc-bloc__entete">
              <h3>{retrait ? 'Retrait à la boutique' : 'Livraison'}</h3>
              {commande.actions?.modifier && !edition && (
                <button type="button" className="sc-lien-bouton" onClick={ouvrirEdition}>
                  <Pencil size={14} strokeWidth={2.3} aria-hidden="true" /> Modifier
                </button>
              )}
            </div>

            {edition && form ? (
              <form className="sc-edition" onSubmit={enregistrer} noValidate>
                {!retrait && (
                  <label className="sc-etiquette">
                    Adresse de livraison
                    <textarea rows={2} value={form.adresseLivraison} maxLength={240}
                      onChange={(e) => setForm({ ...form, adresseLivraison: e.target.value })} />
                  </label>
                )}
                <label className="sc-etiquette">
                  Téléphone
                  <input type="tel" value={form.telephone} autoComplete="tel"
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
                </label>
                <label className="sc-etiquette">
                  <span>Note pour la boutique <span className="sc-facultatif">facultatif</span></span>
                  <textarea rows={2} value={form.note} maxLength={500}
                    onChange={(e) => setForm({ ...form, note: e.target.value })} />
                </label>
                <div className="sc-edition__actions">
                  <button type="button" className="sc-bouton sc-bouton--doux" onClick={() => setEdition(false)}>Annuler</button>
                  <button type="submit" className="sc-bouton" disabled={enCours === 'modifier'}>
                    {enCours === 'modifier' && <Loader2 size={16} className="sc-tourne" aria-hidden="true" />} Enregistrer
                  </button>
                </div>
              </form>
            ) : (
              <dl className="sc-infos">
                {!retrait && (
                  <div><dt><MapPin size={15} strokeWidth={2.2} aria-hidden="true" /> Adresse</dt><dd>{commande.adresseLivraison || '—'}</dd></div>
                )}
                {retrait && (
                  <div><dt><Store size={15} strokeWidth={2.2} aria-hidden="true" /> Boutique</dt><dd>{boutique.nom}</dd></div>
                )}
                <div><dt><Phone size={15} strokeWidth={2.2} aria-hidden="true" /> Téléphone</dt><dd>{commande.telephone ? formaterTelephone(commande.telephone) : '—'}</dd></div>
                {commande.note && (
                  <div><dt><StickyNote size={15} strokeWidth={2.2} aria-hidden="true" /> Note</dt><dd>{commande.note}</dd></div>
                )}
              </dl>
            )}
            {!commande.actions?.modifier && !terminee && commande.actions?.raison && (
              <p className="sc-remarque">{commande.actions.raison}</p>
            )}
            {!commande.actions?.modifier && !terminee && !commande.actions?.raison && commande.statut !== 'livree' && (
              <p className="sc-remarque">La boutique a pris votre commande en charge : pour la modifier, contactez-la.</p>
            )}
          </section>

          {/* ─── Articles ─── */}
          <section className="sc-bloc">
            <div className="sc-bloc__entete"><h3>Articles</h3></div>
            <ul className="sc-articles">
              {(commande.lignes || []).map((l, i) => (
                <li key={`${l.nom}-${i}`}>
                  <span className="sc-articles__image" aria-hidden="true">
                    {l.image ? <img src={l.image} alt="" loading="lazy" /> : <ShoppingBag size={16} strokeWidth={2} />}
                  </span>
                  <span className="sc-articles__nom">{l.nom}<small>× {l.quantite}</small></span>
                  <span className="sc-articles__prix">{formaterPrix(l.sousTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="sc-totaux">
              <div><dt>Articles</dt><dd>{formaterPrix(commande.montantProduits)}</dd></div>
              {!retrait && <div><dt>Livraison</dt><dd>{Number(commande.fraisLivraison) > 0 ? formaterPrix(commande.fraisLivraison) : 'Offerte'}</dd></div>}
              <div className="sc-totaux__total"><dt>Total</dt><dd>{formaterPrix(commande.montantTotal)}</dd></div>
            </dl>
            <p className="sc-paiement">
              {commande.modePaiement === 'a_la_livraison' ? 'Paiement à la réception' : 'Paiement en ligne'}
              {commande.statutPaiement === 'paye' && ' · payé'}
            </p>
          </section>

          {/* ─── Annuler ─── */}
          {commande.actions?.annuler && (
            <section className="sc-bloc sc-bloc--annulation">
              {annulation ? (
                <>
                  <h3>Annuler cette commande ?</h3>
                  <p className="sc-remarque">La boutique sera prévenue. Cette action ne peut pas être annulée.</p>
                  <label className="sc-etiquette">
                    <span>Raison <span className="sc-facultatif">facultatif</span></span>
                    <textarea rows={2} value={motif} maxLength={500} onChange={(e) => setMotif(e.target.value)} />
                  </label>
                  <div className="sc-edition__actions">
                    <button type="button" className="sc-bouton sc-bouton--doux" onClick={() => setAnnulation(false)}>Garder ma commande</button>
                    <button type="button" className="sc-bouton sc-bouton--danger" onClick={annuler} disabled={enCours === 'annuler'}>
                      {enCours === 'annuler' && <Loader2 size={16} className="sc-tourne" aria-hidden="true" />} Confirmer l’annulation
                    </button>
                  </div>
                </>
              ) : (
                <button type="button" className="sc-lien-bouton sc-lien-bouton--danger" onClick={() => { setAnnulation(true); setEdition(false); }}>
                  <Ban size={15} strokeWidth={2.3} aria-hidden="true" /> Annuler la commande
                </button>
              )}
            </section>
          )}
        </div>

        {/* ─── Joindre la boutique ─── */}
        {(lienWa || boutique.telephone) && (
          <footer className="sc-fenetre__pied">
            {lienWa && (
              <a className="sc-bouton sc-bouton--wa" href={lienWa} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={17} strokeWidth={2.2} aria-hidden="true" /> WhatsApp
              </a>
            )}
            {boutique.telephone && (
              <a className="sc-bouton sc-bouton--doux" href={lienTelephone(boutique.telephone)}>
                <Phone size={17} strokeWidth={2.2} aria-hidden="true" /> Appeler
              </a>
            )}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
