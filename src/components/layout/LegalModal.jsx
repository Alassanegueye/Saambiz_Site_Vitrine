import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { company, legalDocs, legalIdentity, legalUpdated } from '../../data/legal';

/* Textes légaux en fenêtre modale (<dialog> natif : focus piégé, touche
   Échap et fond assombri fournis par le navigateur). Les informations
   d'identification non fournies (data/legal.js) ne sont pas affichées :
   rien n'est inventé. */

const Mail = () => <a href={`mailto:${company.email}`}>{company.email}</a>;

function Identity() {
  const rows = [
    ['Nom commercial', company.name],
    ['Raison sociale', legalIdentity.legalName],
    ['RCCM', legalIdentity.rccm],
    ['NINEA', legalIdentity.ninea],
    ['Adresse', company.address],
    ['E-mail', <Mail key="mail" />],
    ['Téléphone', <a key="tel" href={`tel:${company.phoneHref}`}>{company.phone}</a>],
    ['Directeur de la publication', legalIdentity.director],
    ['Hébergement', legalIdentity.host],
  ].filter(([, value]) => value);

  return (
    <dl className="legal-modal__identity">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

const terms = [
  {
    id: 'objet',
    title: 'Objet',
    body: (
      <p>
        Les présentes conditions encadrent l’utilisation du site {company.site}, des sites
        de boutique publiés par les vendeurs à l’adresse {company.site}/b/… et de l’espace
        vendeur. En naviguant sur ces pages ou en y passant commande, vous les acceptez.
      </p>
    ),
  },
  {
    id: 'editeur',
    title: 'Éditeur du site',
    body: (
      <>
        <p>Le site est édité par :</p>
        <Identity />
      </>
    ),
  },
  {
    id: 'role',
    title: 'Le rôle de SaamBiz',
    body: (
      <>
        <p>
          {company.name} fournit aux commerçants les outils pour ouvrir une boutique en ligne,
          gérer leurs produits et leurs commandes. {company.name} ne vend pas les produits
          présentés dans les boutiques : chaque boutique est tenue par un vendeur indépendant.
        </p>
        <p>
          Quand vous commandez dans une boutique, la vente est conclue entre vous et le vendeur.
          C’est lui qui fixe ses prix, décrit ses produits, prépare la commande, la livre ou la
          remet, et répond de sa conformité.
        </p>
      </>
    ),
  },
  {
    id: 'commandes',
    title: 'Commander dans une boutique',
    body: (
      <>
        <p>
          Commander ne demande pas de compte. Vos coordonnées (nom, téléphone, adresse de
          livraison le cas échéant) sont transmises au vendeur pour qu’il puisse vous joindre
          et traiter la commande.
        </p>
        <p>
          Le mode de paiement — à la livraison ou en ligne — et les frais de livraison sont
          indiqués par chaque boutique avant la validation. En cas de difficulté avec une
          commande, contactez d’abord le vendeur ; à défaut, écrivez-nous à <Mail />.
        </p>
      </>
    ),
  },
  {
    id: 'vendeurs',
    title: 'Engagements des vendeurs',
    body: (
      <>
        <p>En ouvrant une boutique, le vendeur s’engage à :</p>
        <ul>
          <li>fournir des informations exactes sur lui-même et sur ses produits ;</li>
          <li>ne proposer que des produits dont la vente est autorisée au Sénégal ;</li>
          <li>honorer les commandes acceptées et respecter les prix affichés ;</li>
          <li>utiliser les coordonnées de ses clients uniquement pour traiter leurs commandes.</li>
        </ul>
        <p>
          {company.name} peut suspendre ou fermer une boutique qui ne respecte pas ces
          engagements, après en avoir informé le vendeur sauf urgence.
        </p>
      </>
    ),
  },
  {
    id: 'acces',
    title: 'Accès au service',
    body: (
      <p>
        Le site est accessible gratuitement. {company.name} s’efforce de le maintenir
        disponible, mais ne peut garantir une disponibilité sans interruption : maintenance,
        mises à jour ou incidents techniques peuvent en suspendre l’accès.
      </p>
    ),
  },
  {
    id: 'propriete',
    title: 'Propriété intellectuelle',
    body: (
      <>
        <p>
          Le nom {company.name}, le logo, la charte graphique et la structure du site
          appartiennent à {company.name}. Toute reproduction, même partielle, sans
          autorisation écrite est interdite.
        </p>
        <p>
          Les photos, descriptions et logos publiés dans une boutique restent la propriété de
          son vendeur, qui garantit avoir le droit de les utiliser.
        </p>
      </>
    ),
  },
  {
    id: 'liens',
    title: 'Liens vers d’autres services',
    body: (
      <p>
        Le site renvoie vers des services tiers (WhatsApp, réseaux sociaux, services de
        paiement). {company.name} n’en a pas la maîtrise et n’en est pas responsable ; leurs
        propres conditions s’appliquent.
      </p>
    ),
  },
  {
    id: 'donnees',
    title: 'Données personnelles',
    body: (
      <p>
        Les informations que vous nous transmettez sont traitées comme décrit dans notre
        politique de confidentialité, accessible en bas de chaque page.
      </p>
    ),
  },
  {
    id: 'droit',
    title: 'Droit applicable',
    body: (
      <p>
        Les présentes conditions sont soumises au droit sénégalais. En cas de litige, une
        solution amiable sera recherchée en priorité ; à défaut, les juridictions de Dakar
        seront compétentes.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Nous contacter',
    body: <p>Pour toute question sur ces conditions : <Mail />.</p>,
  },
];

const privacy = [
  {
    id: 'responsable',
    title: 'Qui est responsable de vos données',
    body: (
      <>
        <p>{company.name} est responsable des données personnelles collectées sur ce site.</p>
        <Identity />
      </>
    ),
  },
  {
    id: 'collecte',
    title: 'Les données que nous recueillons',
    body: (
      <>
        <p>Uniquement celles que vous saisissez vous-même :</p>
        <ul>
          <li>
            <strong>quand vous commandez dans une boutique</strong> : prénom, nom, téléphone,
            adresse de livraison si vous choisissez la livraison, et, si vous les indiquez,
            votre e-mail et une note pour le vendeur ;
          </li>
          <li>
            <strong>quand vous ouvrez une boutique</strong> : les informations de votre compte
            vendeur et celles de votre boutique (nom, logo, produits, prix) ;
          </li>
          <li>
            <strong>quand vous demandez à être prévenu du lancement</strong> : votre adresse
            e-mail.
          </li>
        </ul>
        <p>
          Le site n’utilise ni outil de mesure d’audience, ni publicité, ni cookie de suivi.
        </p>
      </>
    ),
  },
  {
    id: 'appareil',
    title: 'Ce qui reste sur votre appareil',
    body: (
      <p>
        Sur les sites de boutique, votre panier et vos coordonnées de commande sont gardés dans
        le stockage de votre navigateur, pour que vous n’ayez pas à les ressaisir. Ils restent
        sur votre téléphone ou votre ordinateur et ne nous sont pas envoyés tant que vous ne
        validez pas une commande. Vous pouvez les effacer à tout moment en vidant les données
        du site dans votre navigateur.
      </p>
    ),
  },
  {
    id: 'usage',
    title: 'À quoi elles servent',
    body: (
      <>
        <ul>
          <li>transmettre votre commande au vendeur et vous permettre de la suivre ;</li>
          <li>faire fonctionner le compte et la boutique des vendeurs ;</li>
          <li>vous prévenir de la sortie de l’application, si vous l’avez demandé ;</li>
          <li>répondre à vos messages.</li>
        </ul>
        <p>Elles ne sont ni vendues, ni louées, ni utilisées pour de la publicité.</p>
      </>
    ),
  },
  {
    id: 'destinataires',
    title: 'Qui y a accès',
    body: (
      <>
        <p>
          Le vendeur de la boutique où vous commandez reçoit les coordonnées nécessaires pour
          traiter votre commande, et seulement celles-ci. Il n’a pas accès à vos commandes
          passées dans d’autres boutiques.
        </p>
        <p>
          L’équipe {company.name} y a accès pour le support et le bon fonctionnement du service,
          ainsi que nos prestataires techniques (hébergement), dans la limite de leur mission.
          Si vous payez en ligne, le paiement est traité par le service de paiement choisi,
          selon ses propres règles.
        </p>
        <p>
          Les polices de caractères du site sont chargées depuis Google Fonts : votre
          navigateur communique alors son adresse IP à Google, sans cookie.
        </p>
      </>
    ),
  },
  {
    id: 'conservation',
    title: 'Combien de temps nous les gardons',
    body: (
      <ul>
        <li>
          commandes : le temps de les traiter, puis la durée imposée par les obligations
          comptables et légales ;
        </li>
        <li>compte vendeur : tant que le compte est ouvert ;</li>
        <li>
          e-mail de lancement : jusqu’à la sortie de l’application, ou jusqu’à votre demande
          de désinscription ;
        </li>
        <li>messages : au plus trois ans après notre dernier échange.</li>
      </ul>
    ),
  },
  {
    id: 'droits',
    title: 'Vos droits',
    body: (
      <>
        <p>
          Conformément à la loi sénégalaise n° 2008-12 du 25 janvier 2008 sur la protection
          des données à caractère personnel, vous pouvez à tout moment :
        </p>
        <ul>
          <li>savoir quelles données nous détenons sur vous et en obtenir une copie ;</li>
          <li>les faire corriger ou compléter ;</li>
          <li>en demander la suppression ;</li>
          <li>vous opposer à leur utilisation.</li>
        </ul>
        <p>
          Écrivez-nous à <Mail /> : nous répondons dans les meilleurs délais. Si vous estimez
          que vos droits ne sont pas respectés, vous pouvez saisir la Commission de protection
          des données personnelles du Sénégal (
          <a href="https://www.cdp.sn" target="_blank" rel="noreferrer">cdp.sn</a>).
        </p>
      </>
    ),
  },
  {
    id: 'securite',
    title: 'Sécurité',
    body: (
      <p>
        Le site est servi en HTTPS : les informations saisies sont chiffrées pendant leur
        transmission. L’accès aux données est limité aux personnes qui en ont besoin pour
        faire fonctionner le service.
      </p>
    ),
  },
  {
    id: 'modifications',
    title: 'Modifications',
    body: (
      <p>
        Cette politique peut évoluer ; la date de dernière mise à jour figure en haut de la
        fenêtre.
      </p>
    ),
  },
];

const docs = {
  conditions: {
    sections: terms,
    intro: 'Les règles d’utilisation de SaamBiz, le rôle de chacun lors d’une commande et les informations sur l’éditeur.',
    other: 'confidentialite',
  },
  confidentialite: {
    sections: privacy,
    intro: 'Ce que nous faisons des informations que vous nous confiez — et ce que nous n’en faisons pas.',
    other: 'conditions',
  },
};

export default function LegalModal({ doc, onClose, onSwitch }) {
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);
  const page = doc ? docs[doc] : null;

  // Ouverture / fermeture du <dialog> selon le document demandé.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (doc && !dialog.open) dialog.showModal();
    if (!doc && dialog.open) dialog.close();
    document.documentElement.style.overflow = doc ? 'hidden' : '';
  }, [doc]);

  // Changement de document : retour en haut du texte.
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [doc]);

  const goTo = (id) => {
    bodyRef.current?.querySelector(`#legal-${id}`)?.scrollIntoView({ block: 'start' });
  };

  return (
    <dialog
      ref={dialogRef}
      className="legal-modal"
      aria-labelledby="legal-modal-title"
      onClose={onClose}
      onClick={(event) => {
        // Clic sur le fond assombri (hors du panneau) : fermeture.
        if (event.target === dialogRef.current) onClose();
      }}
    >
      {page && (
        <div className="legal-modal__panel">
          <header className="legal-modal__head">
            <div>
              <p className="legal-modal__kicker">Informations légales · mise à jour le {legalUpdated}</p>
              <h2 id="legal-modal-title">{legalDocs[doc]}</h2>
            </div>
            <button type="button" className="legal-modal__close" onClick={onClose} aria-label="Fermer">
              <X size={22} strokeWidth={2} />
            </button>
          </header>

          <div className="legal-modal__body" ref={bodyRef}>
            <p className="legal-modal__intro">{page.intro}</p>

            <nav className="legal-modal__toc" aria-label="Sommaire">
              <ol>
                {page.sections.map((section) => (
                  <li key={section.id}>
                    <button type="button" onClick={() => goTo(section.id)}>{section.title}</button>
                  </li>
                ))}
              </ol>
            </nav>

            {page.sections.map((section, index) => (
              <section key={section.id} id={`legal-${section.id}`} className="legal-modal__section">
                <h3>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  {section.title}
                </h3>
                {section.body}
              </section>
            ))}

            <p className="legal-modal__other">
              Voir aussi :{' '}
              <button type="button" onClick={() => onSwitch(page.other)}>{legalDocs[page.other]}</button>
            </p>
          </div>
        </div>
      )}

      <style>{`
        /* Panneau blanc centré, en-tête fixe, texte défilant.
           Plein écran sur mobile. */
        .legal-modal {
          /* La remise à zéro globale (margin: 0) annule le centrage natif. */
          position: fixed; inset: 0; margin: auto;
          width: min(100% - 2rem, 46rem);
          max-height: min(100dvh - 3rem, 52rem);
          padding: 0; border: 0; border-radius: 16px;
          background: var(--white); color: var(--navy);
          box-shadow: 0 30px 80px -20px rgba(13,27,61,0.45);
          overflow: hidden;
        }
        .legal-modal[open] { display: flex; }
        .legal-modal::backdrop { background: rgba(13,27,61,0.6); }

        .legal-modal__panel { display: flex; flex-direction: column; width: 100%; min-height: 0; }

        .legal-modal__head {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
          padding: 1.5rem 1.75rem 1.25rem;
          border-bottom: 1px solid var(--gray);
        }
        .legal-modal__kicker { font-size: 0.85rem; color: var(--text-light); }
        .legal-modal__head h2 {
          margin-top: 0.35rem;
          font-size: clamp(1.4rem, 1.2rem + 1vw, 1.9rem);
          font-weight: 600; letter-spacing: -0.02em; line-height: 1.2;
        }
        .legal-modal__close {
          flex: none; display: inline-flex; align-items: center; justify-content: center;
          width: 44px; height: 44px;
          border: 1px solid var(--gray); border-radius: 999px;
          background: var(--white); color: var(--navy);
        }
        .legal-modal__close:hover { background: var(--gray-bg); }

        .legal-modal__body {
          flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain;
          padding: 1.5rem 1.75rem 2rem;
        }
        .legal-modal__intro { font-size: 1.05rem; line-height: 1.6; color: var(--text-light); }

        /* Sommaire */
        .legal-modal__toc {
          margin-top: 1.5rem; padding: 1rem 1.25rem;
          border-radius: 12px; background: var(--gray-bg);
        }
        .legal-modal__toc ol {
          display: grid; gap: 0.15rem; margin: 0; padding-left: 1.25rem;
          color: var(--text-light);
        }
        .legal-modal__toc button,
        .legal-modal__other button {
          padding: 0.2rem 0; border: 0; background: none;
          font: inherit; font-weight: 600; color: var(--navy); text-align: left;
        }
        .legal-modal__toc button:hover { color: var(--gold-ink); }

        /* Sections */
        .legal-modal__section { padding-top: 1.75rem; scroll-margin-top: 0.5rem; }
        .legal-modal__section + .legal-modal__section {
          margin-top: 1.75rem; border-top: 1px solid var(--gray);
        }
        .legal-modal__section h3 {
          display: flex; align-items: baseline; gap: 0.65rem;
          margin-bottom: 0.85rem; font-size: 1.2rem; font-weight: 600;
        }
        .legal-modal__section h3 span { font-size: 0.85rem; font-weight: 700; color: var(--gold-ink); }
        .legal-modal__section p,
        .legal-modal__section li { line-height: 1.7; color: var(--text-mid); }
        .legal-modal__section strong { color: var(--navy); font-weight: 600; }
        .legal-modal__section p + p,
        .legal-modal__section p + ul,
        .legal-modal__section ul + p,
        .legal-modal__section p + dl { margin-top: 0.85rem; }
        .legal-modal__section ul { display: grid; gap: 0.3rem; padding-left: 1.25rem; list-style: disc; }
        .legal-modal__section a {
          font-weight: 600; color: var(--navy-mid);
          text-decoration: underline; text-underline-offset: 3px;
        }

        /* Identité de l'éditeur */
        .legal-modal__identity { display: grid; margin: 0; border-top: 1px solid var(--gray); }
        .legal-modal__identity > div {
          display: grid; grid-template-columns: 12rem minmax(0, 1fr); gap: 1rem;
          padding-block: 0.65rem; border-bottom: 1px solid var(--gray);
        }
        .legal-modal__identity dt { color: var(--text-light); }
        .legal-modal__identity dd { margin: 0; font-weight: 600; }

        .legal-modal__other {
          margin-top: 2.5rem; padding-top: 1.25rem;
          border-top: 1px solid var(--gray); color: var(--text-light);
        }
        .legal-modal__other button {
          color: var(--navy-mid); text-decoration: underline; text-underline-offset: 3px;
        }

        @media (max-width: 600px) {
          .legal-modal {
            width: 100%; max-width: 100%;
            height: 100dvh; max-height: 100dvh; border-radius: 0;
          }
          .legal-modal__head { padding: 1rem 1.25rem; }
          .legal-modal__body { padding: 1.25rem 1.25rem 2rem; }
          .legal-modal__identity > div { grid-template-columns: minmax(0, 1fr); gap: 0.1rem; }
        }
      `}</style>
    </dialog>
  );
}
