import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';
import { LogoBoutique } from './IdentiteBoutique';
import { Reseaux } from './composants';
import { pagesBoutique } from './navigation';
import { formaterTelephone, lienCarte, lienTelephone, lienWhatsappBoutique } from './outils';
import logoBlanc from '../assets/brand/logo-white.png';

/**
 * Le pied de page du site d'une boutique : sa couleur, très assombrie, comme
 * le bas d'une façade ; les pages, le contact, puis la
 * mention SaamBiz.
 *
 * La marque de la plateforme n'apparaît qu'ici, discrètement. Le client est
 * venu voir un commerçant ; lui rappeler la marketplace en haut de chaque
 * page ne lui apporte rien et dilue la boutique.
 */
export default function Pied({ boutique }) {
  const base = `/b/${boutique.slug}`;
  const wa = lienWhatsappBoutique(boutique);
  const sections = boutique.theme.sections || {};
  const adresse = boutique.localisation || boutique.ville;
  const avecContact = sections.contact !== false && (boutique.telephone || wa || adresse || boutique.horaires);

  return (
    <footer className="bq-pied">
      <div className={`bq-pied__haut ${avecContact ? '' : 'bq-pied__haut--court'}`}>
        <div className="bq-pied__marque">
          <p className="bq-pied__nom">
            <LogoBoutique boutique={boutique} className="bq-pied__logo" />
            {boutique.nom}
          </p>
          {(boutique.description || boutique.slogan) && (
            <p className="bq-pied__desc">{boutique.description || boutique.slogan}</p>
          )}
          <Reseaux reseaux={boutique.reseaux} className="bq-reseaux--pied" />
        </div>

        <div className="bq-pied__bloc">
          <h2>La boutique</h2>
          <ul className="bq-pied__liste bq-pied__liste--nue">
            {pagesBoutique(boutique.slug).map((p) => (
              <li key={p.cle}><Link to={p.a}>{p.libelle}</Link></li>
            ))}
          </ul>
        </div>

        {boutique.commandeActivee && (
          <div className="bq-pied__bloc">
            <h2>Vos commandes</h2>
            <ul className="bq-pied__liste bq-pied__liste--nue">
              <li><Link to={`${base}/panier`}>Mon panier</Link></li>
            </ul>
          </div>
        )}

        {avecContact && (
          <div className="bq-pied__bloc">
            <h2>Nous joindre</h2>
            <ul className="bq-pied__liste">
              {boutique.telephone && (
                <li>
                  <Phone size={16} strokeWidth={2} aria-hidden="true" />
                  <a href={lienTelephone(boutique.telephone)}>{formaterTelephone(boutique.telephone)}</a>
                </li>
              )}
              {wa && (
                <li>
                  <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
                  <a href={wa} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a>
                </li>
              )}
              {adresse && (
                <li>
                  <MapPin size={16} strokeWidth={2} aria-hidden="true" />
                  <a href={lienCarte(adresse)} target="_blank" rel="noopener noreferrer">{adresse}</a>
                </li>
              )}
              {boutique.horaires && (
                <li>
                  <Clock size={16} strokeWidth={2} aria-hidden="true" />
                  <span>{boutique.horaires}</span>
                </li>
              )}
            </ul>
          </div>
        )}
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
