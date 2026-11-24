import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Check, Clock, MapPin, MessageCircle, Phone, Share2 } from 'lucide-react';
import DefilePhotos from './DefilePhotos';
import { LogoBoutique } from './IdentiteBoutique';
import { formaterTelephone, lienCarte, lienTelephone, lienWhatsappBoutique } from './outils';
import { usePartageBoutique } from './usePartage';

/**
 * Le haut de l'accueil : le grand bandeau, puis la bande des infos utiles.
 *
 * Le bandeau montre les photos que le vendeur a ajoutées ; s'il en a
 * plusieurs, elles défilent toutes seules, en boucle. Sans photo, il prend
 * les couleurs de la boutique. Dans les deux cas, la même accroche : le
 * slogan du vendeur (à défaut, le nom de la boutique), le début de sa
 * présentation et « Voir nos produits ».
 *
 * Le nom et le logo ne sont pas répétés ici : ils sont dans la barre du haut.
 */
export default function UneBoutique({ boutique }) {
  const base = `/b/${boutique.slug}`;
  const photos = Array.isArray(boutique.photos) ? boutique.photos.filter(Boolean) : [];
  const titre = boutique.slogan || boutique.nom;
  // Le premier paragraphe seulement : la suite est sur « À propos ».
  const texte = String(boutique.description || '').split(/\n{2,}/)[0].trim();

  const adresse = boutique.localisation || boutique.ville;
  const telephone = boutique.telephone || boutique.whatsapp;
  const wa = lienWhatsappBoutique(boutique);
  const { partager, copie } = usePartageBoutique(boutique);
  // « 77 123 45 67 » : l'indicatif du Sénégal se devine ici et prend la place
  // d'un chiffre sur un écran étroit. Le lien, lui, le garde.
  const telephoneAffiche = formaterTelephone(telephone).replace(/^\+221\s+/, '');

  const accroche = (
    <div className="bq-une__texte">
      <h1 className="bq-une__titre">{titre}</h1>
      {texte && <p className="bq-une__sous-titre">{texte}</p>}
      <Link to={`${base}/produits`} className="bq-une__bouton">
        Voir nos produits
        <ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" />
      </Link>
    </div>
  );

  return (
    <section className="bq-une" data-apercu="style">
      {photos.length > 0 ? (
        <DefilePhotos
          photos={photos}
          etiquette={`Photos de ${boutique.nom}`}
          className="bq-une__cadre bq-une__cadre--photos"
          data-apercu="photos"
        >
          {accroche}
        </DefilePhotos>
      ) : (
        <div className="bq-une__cadre bq-une__cadre--couleur" data-apercu="photos">
          {accroche}
          {/* Sans photo, le logo occupe la droite du bandeau sur ordinateur. */}
          <LogoBoutique boutique={boutique} className="bq-une__logo" />
        </div>
      )}

      <div className="bq-infos-cle">
        <ul className="bq-infos-cle__liste" aria-label="Infos pratiques">
          {adresse && (
            <li>
              <a className="bq-cle" href={lienCarte(adresse)} target="_blank" rel="noopener noreferrer">
                <MapPin size={19} strokeWidth={2} aria-hidden="true" />
                <span className="bq-cle__texte">
                  <strong>{adresse}</strong>
                  <small>Voir sur la carte</small>
                </span>
              </a>
            </li>
          )}
          {boutique.horaires ? (
            <li className="bq-cle">
              <Clock size={19} strokeWidth={2} aria-hidden="true" />
              <span className="bq-cle__texte">
                <strong>{boutique.horaires}</strong>
                <small>Nos horaires</small>
              </span>
            </li>
          ) : boutique.depuis && (
            <li className="bq-cle">
              <CalendarDays size={19} strokeWidth={2} aria-hidden="true" />
              <span className="bq-cle__texte">
                <strong>Ouvert depuis {boutique.depuis}</strong>
                <small>Toujours à votre service</small>
              </span>
            </li>
          )}
          {telephone && (
            <li>
              <a className="bq-cle" href={lienTelephone(telephone)}>
                <Phone size={19} strokeWidth={2} aria-hidden="true" />
                <span className="bq-cle__texte">
                  <strong>{telephoneAffiche}</strong>
                  <small>Appelez-nous</small>
                </span>
              </a>
            </li>
          )}
          {wa && (
            <li className="bq-infos-cle__geste">
              <a className="bq-bouton-wa" href={wa} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} strokeWidth={2.2} aria-hidden="true" />
                WhatsApp
              </a>
            </li>
          )}
        </ul>

        {/* Sur téléphone, « Partager » est dans le menu. */}
        <button type="button" className="bq-infos-cle__partage" onClick={partager} aria-live="polite">
          {copie
            ? <Check size={18} strokeWidth={2.4} aria-hidden="true" />
            : <Share2 size={18} strokeWidth={2.2} aria-hidden="true" />}
          <span>{copie ? 'Lien copié' : 'Partager'}</span>
        </button>
      </div>
    </section>
  );
}
