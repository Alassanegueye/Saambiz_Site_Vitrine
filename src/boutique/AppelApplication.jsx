import { Bell, Heart, Package, Apple, Play } from 'lucide-react';
// Le vrai pictogramme SaamBiz, en version blanche pour le fond bleu marine, et
// réduit à 128 px : l'original de la charte pèse 112 ko pour un affichage de
// 46 px de large, sur des forfaits mobiles où chaque kilo-octet se paie.
import pictoBlanc from '../assets/brand/picto-blanc-96.png';

/**
 * L'encart de bas de page qui invite le client de la boutique à installer
 * l'application SaamBiz.
 *
 * C'est la charnière entre les deux mondes du produit : le site amène la
 * vente sans rien demander, l'application transforme l'acheteur de passage en
 * client qui revient. L'encart est donc en BAS, après le catalogue et après
 * la commande — jamais en interstitiel : rien ne fait fuir plus vite un
 * client venu par un lien WhatsApp qu'une fenêtre qui lui réclame une
 * installation avant de lui montrer les prix.
 *
 * L'argument est écrit du point de vue du client, pas de celui de SaamBiz :
 * on lui parle de CETTE boutique, nommée, et de ce qu'il y gagne — être
 * prévenu de ses nouveautés, suivre ses commandes. « Téléchargez notre
 * application » ne dit rien à personne.
 */

// Renseignées le jour de la publication sur les stores. Tant qu'elles sont
// vides, on affiche « Bientôt » plutôt qu'un lien mort — c'est aussi ce
// qu'annonce le reste du site.
const LIEN_ANDROID = import.meta.env.VITE_LIEN_ANDROID || '';
const LIEN_IOS = import.meta.env.VITE_LIEN_IOS || '';

const AVANTAGES = [
  {
    icone: Bell,
    titre: 'Ses nouveautés en premier',
    texte: 'Une notification dès qu\'un article arrive ou qu\'une promotion démarre.',
  },
  {
    icone: Heart,
    titre: 'Votre boutique en favori',
    texte: 'Retrouvez-la en un geste, sans chercher le lien dans vos conversations.',
  },
  {
    icone: Package,
    titre: 'Vos commandes au même endroit',
    texte: `Celles que vous passez depuis l'application, de la préparation à la livraison.`,
  },
];

export default function AppelApplication({ boutique, contexte = 'site' }) {
  const nom = boutique?.nom || 'cette boutique';
  const storesDisponibles = LIEN_ANDROID || LIEN_IOS;

  return (
    <section className="bq-app" aria-labelledby="bq-app-titre">
      <div className="bq-app__contenu">
        <div className="bq-app__texte">
          <img src={pictoBlanc} alt="" className="bq-app__picto" aria-hidden="true" />

          <p className="bq-app__sur-titre">Application SaamBiz — gratuite</p>

          <h2 id="bq-app-titre">
            {contexte === 'commande'
              ? <>Merci. Ne ratez pas les prochaines nouveautés de <span className="bq-app__nom">{nom}</span></>
              : <>Suivez <span className="bq-app__nom">{nom}</span> et ne ratez plus rien</>}
          </h2>

          <p className="bq-app__intro">
            {contexte === 'commande'
              ? <>Vous venez de commander sans créer de compte, et c'est très bien ainsi.
                  Avec l'application, vous serez en plus prévenu de ses arrivages et de
                  ses promotions.</>
              : <>Ce site vous montre le catalogue. L'application vous prévient quand il
                  change — et garde toutes vos commandes au même endroit.</>}
          </p>

          <ul className="bq-app__avantages">
            {AVANTAGES.map(({ icone: Icone, titre, texte }) => (
              <li key={titre}>
                <span className="bq-app__puce" aria-hidden="true">
                  <Icone size={17} strokeWidth={2.2} />
                </span>
                <span>
                  <strong>{titre}</strong>
                  {texte}
                </span>
              </li>
            ))}
          </ul>

          <div className="bq-app__stores">
            {storesDisponibles ? (
              <>
                {LIEN_ANDROID && (
                  <a className="bq-store" href={LIEN_ANDROID} target="_blank" rel="noopener noreferrer">
                    <Play size={20} strokeWidth={2} aria-hidden="true" />
                    <span><small>Disponible sur</small><strong>Google Play</strong></span>
                  </a>
                )}
                {LIEN_IOS && (
                  <a className="bq-store" href={LIEN_IOS} target="_blank" rel="noopener noreferrer">
                    <Apple size={20} strokeWidth={2} aria-hidden="true" />
                    <span><small>Disponible sur</small><strong>App Store</strong></span>
                  </a>
                )}
              </>
            ) : (
              /* Pas encore publiée : deux badges inertes plutôt que des liens
                 qui mènent nulle part. Le jour de la mise en ligne, il suffit
                 de renseigner VITE_LIEN_ANDROID et VITE_LIEN_IOS. */
              <>
                <span className="bq-store bq-store--bientot">
                  <Play size={20} strokeWidth={2} aria-hidden="true" />
                  <span><small>Bientôt sur</small><strong>Google Play</strong></span>
                </span>
                <span className="bq-store bq-store--bientot">
                  <Apple size={20} strokeWidth={2} aria-hidden="true" />
                  <span><small>Bientôt sur</small><strong>App Store</strong></span>
                </span>
              </>
            )}
          </div>

          <p className="bq-app__mention">
            {nom} vend sur SaamBiz, la marketplace des commerçants sénégalais.{' '}
            <a href="/" className="bq-app__lien">Découvrir SaamBiz</a>
          </p>
        </div>
      </div>
    </section>
  );
}
