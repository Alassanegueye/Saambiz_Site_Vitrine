import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, MessageCircle, Package, Phone, Send } from 'lucide-react';
import { EntetePage, Reseaux } from '../composants';
import { formaterTelephone, lienCarte, lienTelephone, lienWhatsapp, lienWhatsappBoutique, numeroWhatsapp } from '../outils';

/** Une façon de joindre la boutique : ce que c'est, la coordonnée, le geste. */
function Moyen({ icone: Icone, titre, valeur, action, wa = false }) {
  return (
    <li className={`bq-moyen ${wa ? 'bq-moyen--wa' : ''}`}>
      <span className="bq-moyen__icone"><Icone size={22} strokeWidth={2} aria-hidden="true" /></span>
      <div className="bq-moyen__texte">
        <h2>{titre}</h2>
        <p>{valeur}</p>
      </div>
      {action}
    </li>
  );
}

/**
 * « Contact » : toutes les façons de joindre la boutique, et un message à
 * écrire ici qui part dans WhatsApp, déjà rédigé. Pas de formulaire envoyé
 * par courriel : le vendeur vit sur WhatsApp, c'est là qu'il répond.
 */
export default function Contact({ boutique }) {
  const base = `/b/${boutique.slug}`;
  const numero = numeroWhatsapp(boutique);
  const wa = lienWhatsappBoutique(boutique);
  const telephone = boutique.telephone || boutique.whatsapp;
  const adresse = boutique.localisation || boutique.ville;
  const [nom, setNom] = useState('');
  const [message, setMessage] = useState('');

  const envoyer = (e) => {
    e.preventDefault();
    const corps = message.trim();
    if (!corps) return;
    const texte = `Bonjour ${boutique.nom}, ${nom.trim() ? `c'est ${nom.trim()}. ` : ''}${corps}`;
    const lien = lienWhatsapp(numero, texte);
    // Ouvert depuis l'appui du client : le navigateur ne le bloque pas. Si
    // une fenêtre ne peut pas s'ouvrir (WebView d'une application), on suit
    // le lien dans la page. Pas d'option « noopener » ici : avec elle,
    // window.open renvoie toujours null et le lien s'ouvrirait deux fois.
    const fenetre = window.open(lien, '_blank');
    if (fenetre) fenetre.opener = null;
    else window.location.assign(lien);
  };

  const rien = !wa && !telephone && !adresse && !boutique.horaires;

  return (
    <>
      <EntetePage boutique={boutique} titre="Contact" fil={[{ libelle: 'Contact' }]} />

      <div className={`bq-section bq-contact ${wa ? 'bq-contact--duo' : ''}`}>
        <div className="bq-contact__principal">
          {rien ? (
            <p className="bq-contact__vide">
              {boutique.nom} n'a pas encore publié ses coordonnées.
            </p>
          ) : (
            <ul className="bq-moyens">
              {wa && (
                <Moyen wa icone={MessageCircle} titre="WhatsApp" valeur={formaterTelephone(numero)}
                  action={(
                    <a className="bq-bouton bq-bouton--wa" href={wa} target="_blank" rel="noopener noreferrer">
                      Écrire
                    </a>
                  )} />
              )}
              {telephone && (
                <Moyen icone={Phone} titre="Téléphone" valeur={formaterTelephone(telephone)}
                  action={<a className="bq-bouton bq-bouton--doux" href={lienTelephone(telephone)}>Appeler</a>} />
              )}
              {adresse && (
                <Moyen icone={MapPin} titre="Adresse" valeur={adresse}
                  action={(
                    <a className="bq-bouton bq-bouton--doux" href={lienCarte(adresse)} target="_blank" rel="noopener noreferrer">
                      Voir sur la carte
                    </a>
                  )} />
              )}
              {boutique.horaires && <Moyen icone={Clock} titre="Horaires" valeur={boutique.horaires} />}
            </ul>
          )}

          <Reseaux reseaux={boutique.reseaux} className="bq-contact__reseaux" />

          <Link to={`${base}/suivi`} className="bq-contact__suivi">
            <Package size={20} strokeWidth={2} aria-hidden="true" />
            <span><strong>Vous avez déjà commandé ?</strong> Suivez votre commande avec sa référence.</span>
          </Link>
        </div>

        {wa && (
          <form className="bq-message" onSubmit={envoyer}>
            <h2>Envoyer un message</h2>
            <p className="bq-message__aide">Votre message s'ouvre dans WhatsApp, prêt à partir.</p>
            <label className="bq-label">
              <span className="bq-label__ligne">Votre nom <small>facultatif</small></span>
              <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="name" maxLength={80} />
            </label>
            <label className="bq-label">
              Votre message
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required maxLength={1000}
                placeholder="Bonjour, je voudrais savoir si…" />
            </label>
            <button type="submit" className="bq-bouton bq-bouton--wa bq-bouton--grand bq-bouton--bloc" disabled={!message.trim()}>
              <Send size={18} strokeWidth={2.2} aria-hidden="true" /> Envoyer sur WhatsApp
            </button>
          </form>
        )}
      </div>
    </>
  );
}
