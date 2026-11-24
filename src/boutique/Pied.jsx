import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { LogoBoutique } from './IdentiteBoutique';
import { Reseaux } from './composants';
import { formaterTelephone, lienCarte, lienTelephone, lienWhatsappBoutique } from './outils';
import logoBlanc from '../assets/brand/logo-white.png';

/**
 * Le pied de page du site d'une boutique, volontairement court : le nom de
 * la boutique, les trois moyens de la joindre, ses réseaux, puis la mention
 * SaamBiz. Les liens vers les pages sont déjà dans la barre du haut (et le
 * menu du téléphone) : les répéter ici allongeait la page pour rien.
 *
 * La marque de la plateforme n'apparaît qu'ici, discrètement. Le client est
 * venu voir un commerçant ; lui rappeler la marketplace en haut de chaque
 * page ne lui apporte rien et dilue la boutique.
 */
export default function Pied({ boutique }) {
  const wa = lienWhatsappBoutique(boutique);
  const sections = boutique.theme.sections || {};
  const adresse = boutique.localisation || boutique.ville;
  const avecContact = sections.contact !== false && (boutique.telephone || wa || adresse);

  return (
    <footer className="bq-pied">
      <div className="bq-pied__haut">
        <div className="bq-pied__marque">
          <LogoBoutique boutique={boutique} className="bq-pied__logo" />
          <div>
            <p className="bq-pied__nom">{boutique.nom}</p>
            {boutique.slogan && <p className="bq-pied__slogan">{boutique.slogan}</p>}
          </div>
        </div>

        {avecContact && (
          <ul className="bq-pied__contact" aria-label="Nous joindre">
            {boutique.telephone && (
              <li>
                <a href={lienTelephone(boutique.telephone)}>
                  <Phone size={15} strokeWidth={2} aria-hidden="true" />
                  {formaterTelephone(boutique.telephone)}
                </a>
              </li>
            )}
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={15} strokeWidth={2} aria-hidden="true" /> WhatsApp
                </a>
              </li>
            )}
            {adresse && (
              <li>
                <a href={lienCarte(adresse)} target="_blank" rel="noopener noreferrer">
                  <MapPin size={15} strokeWidth={2} aria-hidden="true" /> {adresse}
                </a>
              </li>
            )}
          </ul>
        )}

        <Reseaux reseaux={boutique.reseaux} className="bq-reseaux--pied" />
      </div>

      <div className="bq-pied__bas">
        <p>© {new Date().getFullYear()} {boutique.nom}</p>
        <a href="/" className="bq-pied__saambiz">
          <span>Boutique créée avec</span>
          <img src={logoBlanc} alt="SaamBiz" width="88" height="21" />
        </a>
      </div>
    </footer>
  );
}
