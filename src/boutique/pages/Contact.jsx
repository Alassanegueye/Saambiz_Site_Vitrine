import { useState } from 'react';
import { AlertCircle, Check, Clock, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { envoyerMessage, ErreurApi } from '../api';
import { EntetePage, Reseaux } from '../composants';
import { formaterTelephone, lienCarte, lienTelephone, lienWhatsappBoutique, numeroWhatsapp } from '../outils';

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
 * « Contact » : toutes les façons de joindre la boutique, et un formulaire.
 *
 * Le message arrive dans « Messages » chez le vendeur, sur l'application et
 * sur son dashboard, avec une notification. Le visiteur n'a pas de compte :
 * il laisse son numéro, et c'est là que le vendeur lui répond.
 */
export default function Contact({ boutique }) {
  const numero = numeroWhatsapp(boutique);
  const wa = lienWhatsappBoutique(boutique);
  const telephone = boutique.telephone || boutique.whatsapp;
  const adresse = boutique.localisation || boutique.ville;

  const [form, setForm] = useState({ nom: '', telephone: '', message: '', site: '' });
  const [etat, setEtat] = useState('saisie'); // saisie | envoi | envoye
  const [erreur, setErreur] = useState('');
  const changer = (champ) => (e) => {
    setForm((f) => ({ ...f, [champ]: e.target.value }));
    if (erreur) setErreur('');
  };

  const envoyer = async (e) => {
    e.preventDefault();
    if (etat === 'envoi') return;
    if (form.telephone.replace(/\D/g, '').length < 9) {
      setErreur('Indiquez un numéro de téléphone valide, pour que la boutique puisse vous répondre.');
      return;
    }
    if (form.message.trim().length < 2) {
      setErreur('Écrivez votre message.');
      return;
    }
    setEtat('envoi');
    setErreur('');
    try {
      await envoyerMessage(boutique.slug, {
        nom: form.nom.trim(),
        telephone: form.telephone.trim(),
        message: form.message.trim(),
        site: form.site,
      });
      setEtat('envoye');
    } catch (err) {
      setEtat('saisie');
      setErreur(
        err instanceof ErreurApi && err.statut > 0 && err.statut < 500
          ? `Le message n'est pas parti : ${err.message}`
          : "Le message n'est pas parti. Vérifiez votre connexion et réessayez."
      );
    }
  };

  const recommencer = () => {
    setForm((f) => ({ ...f, message: '' }));
    setEtat('saisie');
  };

  const rien = !wa && !telephone && !adresse && !boutique.horaires;

  return (
    <>
      <EntetePage boutique={boutique} titre="Contact" fil={[{ libelle: 'Contact' }]} />

      <div className="bq-section bq-contact bq-contact--duo">
        <div className="bq-contact__principal">
          {rien ? (
            <p className="bq-contact__vide">
              {boutique.nom} n'a pas encore publié ses coordonnées. Écrivez-lui avec le formulaire.
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
        </div>

        {etat === 'envoye' ? (
          <div className="bq-message bq-message--envoye" role="status">
            <span className="bq-message__coche"><Check size={26} strokeWidth={2.6} aria-hidden="true" /></span>
            <h2>Message envoyé</h2>
            <p>
              {boutique.nom} a bien reçu votre message et vous répondra au{' '}
              <strong>{formaterTelephone(form.telephone.trim())}</strong>.
            </p>
            <button type="button" className="bq-bouton bq-bouton--doux" onClick={recommencer}>
              Écrire un autre message
            </button>
          </div>
        ) : (
          <form className="bq-message" onSubmit={envoyer} noValidate>
            <h2>Envoyer un message</h2>
            <p className="bq-message__aide">{boutique.nom} le reçoit directement et vous répond sur votre numéro.</p>
            <label className="bq-label">
              <span className="bq-label__ligne">Votre nom <small>facultatif</small></span>
              <input type="text" value={form.nom} onChange={changer('nom')} autoComplete="name" maxLength={80} />
            </label>
            <label className="bq-label">
              Votre téléphone
              <input type="tel" value={form.telephone} onChange={changer('telephone')} autoComplete="tel"
                placeholder="77 123 45 67" required maxLength={30} />
            </label>
            <label className="bq-label">
              Votre message
              <textarea value={form.message} onChange={changer('message')} rows={5} required maxLength={2000}
                placeholder="Bonjour, je voudrais savoir si…" />
            </label>
            {/* Piège à robots : invisible, personne ne le remplit à la main. */}
            <input type="text" name="site" value={form.site} onChange={changer('site')}
              className="bq-piege" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            {erreur && (
              <p className="bq-erreur" role="alert">
                <AlertCircle size={17} strokeWidth={2.2} aria-hidden="true" /> {erreur}
              </p>
            )}

            <button type="submit" className="bq-bouton bq-bouton--grand bq-bouton--bloc" disabled={etat === 'envoi'}>
              <Send size={18} strokeWidth={2.2} aria-hidden="true" /> {etat === 'envoi' ? 'Envoi…' : 'Envoyer le message'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
