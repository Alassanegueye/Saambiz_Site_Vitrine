import { Link } from 'react-router-dom';
import { BadgeCheck, Clock, MapPin, Store, Tag } from 'lucide-react';
import { Avantages, EntetePage, Reseaux } from '../composants';
import { LogoBoutique } from '../IdentiteBoutique';
import { lienCarte } from '../outils';

/**
 * « À propos » : la présentation que le vendeur a écrite, et la boutique en
 * bref — certification, activité, adresse, horaires, ancienneté.
 *
 * Sans présentation écrite, la page ne reste pas vide : elle dit ce que l'on
 * sait de la boutique, sans rien inventer.
 */
export default function APropos({ boutique }) {
  const base = `/b/${boutique.slug}`;
  const texte = boutique.apropos || boutique.description || '';
  const paragraphes = texte.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const adresse = boutique.localisation || boutique.ville;
  const avantages = boutique.blocs?.avantages || [];

  const parDefaut = [
    `${boutique.nom} vend en ligne${boutique.depuis ? ` depuis ${boutique.depuis}` : ''}${boutique.ville ? `, à ${boutique.ville}` : ''}.`,
    boutique.commandeActivee
      ? 'Parcourez le catalogue et commandez directement sur ce site, sans créer de compte.'
      : 'Parcourez le catalogue, puis contactez la boutique pour commander.',
  ];

  return (
    <>
      <EntetePage boutique={boutique} titre={`À propos de ${boutique.nom}`} fil={[{ libelle: 'À propos' }]} />

      <div className="bq-section bq-page-apropos">
        <div className="bq-page-apropos__texte">
          {(paragraphes.length ? paragraphes : parDefaut).map((p, i) => <p key={i}>{p}</p>)}
          <div className="bq-page-apropos__actions">
            <Link to={`${base}/produits`} className="bq-bouton bq-bouton--grand">Voir nos produits</Link>
            <Link to={`${base}/contact`} className="bq-bouton bq-bouton--doux bq-bouton--grand">Nous contacter</Link>
          </div>
        </div>

        <aside className="bq-carte-boutique" aria-label={`${boutique.nom} en bref`}>
          <div className="bq-carte-boutique__haut">
            <LogoBoutique boutique={boutique} className="bq-carte-boutique__logo" />
            <div>
              <p className="bq-carte-boutique__nom">{boutique.nom}</p>
              {boutique.slogan && <p className="bq-carte-boutique__slogan">{boutique.slogan}</p>}
            </div>
          </div>

          <dl className="bq-carte-boutique__faits">
            {boutique.verifiee && (
              <div>
                <dt><BadgeCheck size={18} strokeWidth={2} className="bq-verifiee" aria-hidden="true" /> Boutique certifiée</dt>
                <dd>Identité du vendeur vérifiée par SaamBiz</dd>
              </div>
            )}
            {boutique.categorie && (
              <div>
                <dt><Tag size={18} strokeWidth={2} aria-hidden="true" /> Activité</dt>
                <dd>{boutique.categorie}</dd>
              </div>
            )}
            {adresse && (
              <div>
                <dt><MapPin size={18} strokeWidth={2} aria-hidden="true" /> Adresse</dt>
                <dd>
                  {adresse}{' '}
                  <a href={lienCarte(adresse)} target="_blank" rel="noopener noreferrer" className="bq-lien">Voir sur la carte</a>
                </dd>
              </div>
            )}
            {boutique.horaires && (
              <div>
                <dt><Clock size={18} strokeWidth={2} aria-hidden="true" /> Horaires</dt>
                <dd>{boutique.horaires}</dd>
              </div>
            )}
            {boutique.depuis && (
              <div>
                <dt><Store size={18} strokeWidth={2} aria-hidden="true" /> En ligne depuis</dt>
                <dd>{boutique.depuis}</dd>
              </div>
            )}
          </dl>

          <Reseaux reseaux={boutique.reseaux} />
        </aside>
      </div>

      {avantages.length > 0 && <Avantages avantages={avantages} />}
    </>
  );
}
