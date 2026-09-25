import { useState } from 'react';
import { ChevronDown, MessageCircle, HelpCircle, Mail, Phone, Clock } from 'lucide-react';

const faqs = [
  { q:'SaamBiz est-il gratuit ?', a:"Oui. Créer votre boutique, publier vos produits, recevoir vos commandes et ouvrir votre site web ne vous coûtent rien : aucun abonnement, aucune commission sur vos ventes, aucune carte bancaire demandée. Vous pouvez donc lancer votre activité sans avancer un franc, et sans engagement." },
  { q:"Que m'apporte SaamBiz par rapport à WhatsApp ou Instagram ?", a:"SaamBiz ne remplace pas vos réseaux, il leur ajoute une boutique structurée : un catalogue permanent que vos clients peuvent parcourir, des commandes suivies avec leur acompte, un historique de vos ventes et des notifications envoyées à vos abonnés en une fois. Votre lien de boutique se partage d'ailleurs sur WhatsApp et Instagram comme n'importe quel autre lien." },
  { q:'Comment créer ma boutique sur SaamBiz ?', a:"Après téléchargement de l'application, inscrivez-vous en tant que vendeur, choisissez un nom et une catégorie pour votre boutique, ajoutez votre logo et commencez à publier vos produits. La boutique est active en moins de 5 minutes." },
  { q:"Mes clients doivent-ils installer l'application pour commander ?", a:"Non. Chaque boutique a son propre lien web : vos clients l'ouvrent dans leur navigateur, parcourent votre catalogue et passent commande directement, sans rien installer. L'application reste utile pour la suite — elle permet de suivre plusieurs boutiques au même endroit, de retrouver ses commandes et de recevoir les notifications de nouveautés et de promotions. En pratique, le lien fait entrer le client, l'application le fait revenir." },
  { q:'Comment mes clients reçoivent-ils les notifications ?', a:"Lorsqu'un client s'abonne à votre boutique et active la cloche de notification, il reçoit automatiquement des notifications push sur son smartphone dès que vous publiez un nouveau produit, lancez une promotion ou mettez à jour votre stock." },
  { q:"Quel est le fonctionnement du système d'acompte ?", a:"Lorsqu'un client passe commande, il doit obligatoirement régler un acompte (pourcentage défini par le vendeur) pour valider la commande. Le solde restant est réglé à la livraison. Aucune commande ne peut être confirmée sans ce paiement initial." },
  { q:'Quels moyens de paiement sont acceptés ?', a:"SaamBiz accepte Wave, Orange Money, Free Money, les cartes bancaires (Visa, Mastercard) et d'autres moyens de Mobile Money disponibles au Sénégal. D'autres méthodes de paiement seront ajoutées progressivement." },
  { q:'Comment fonctionne le remboursement ?', a:"En cas de litige, d'annulation de commande ou de produit non conforme, le client peut soumettre une demande de remboursement depuis l'application. Notre équipe examine la demande sous 48h et procède au remboursement automatique si le dossier est validé." },
  { q:'La carte QR est-elle déjà disponible ?', a:"Pas encore : la carte QR professionnelle arrive bientôt et n'est pas commandable pour le moment. Laissez-nous votre email pour être prévenu du lancement. En attendant, le QR code de votre boutique se télécharge déjà depuis votre tableau de bord — imprimez-le et collez-le sur votre devanture — et votre lien se partage par WhatsApp et sur les réseaux sociaux." },
  { q:'Puis-je gérer plusieurs boutiques avec un seul compte ?', a:"La gestion de plusieurs boutiques depuis un seul compte sera disponible dans une prochaine mise à jour. Actuellement, chaque boutique nécessite un compte vendeur distinct." },
  { q:'Puis-je gérer ma boutique depuis un ordinateur ?', a:"Oui, et vous n'avez pas à choisir : le même tableau de bord existe sur les deux supports, sans supplément. Dans l'application iOS et Android pour piloter au quotidien, et sur le web depuis le bouton « Se connecter » en haut du site pour travailler au clavier sur grand écran — produits, stocks, commandes, publicités et statistiques. Une seule exception : la création de votre site web se fait dans l'application, parce qu'elle part de votre logo pris depuis votre téléphone." },
];

const FaqItem = ({ faq, idx }) => {
  const [open, setOpen] = useState(false);
  const btnId   = `faq-q-${idx}`;
  const panelId = `faq-a-${idx}`;

  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <h3 className="faq-q-wrap">
        <button
          id={btnId}
          className="faq-q"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls={panelId}
        >
          <span className="faq-num" aria-hidden="true">{String(idx + 1).padStart(2, '0')}</span>
          <span className="faq-label">{faq.q}</span>
          <span className="faq-chev" aria-hidden="true"><ChevronDown size={17} strokeWidth={2.4} /></span>
        </button>
      </h3>
      {/* La réponse reste dans le DOM pour pouvoir s'ouvrir en douceur ;
          `visibility: hidden` la retire de la navigation clavier et des
          lecteurs d'écran tant qu'elle est repliée. */}
      <div id={panelId} role="region" aria-labelledby={btnId} className="faq-a-wrap">
        <div className="faq-a-inner">
          <p className="faq-a">{faq.a}</p>
        </div>
      </div>
    </div>
  );
};

const Faq = () => (
  <section id="faq" className="faq-section">
    <div className="faq-inner">
      <div className="section-header sr">
        <div className="section-badge navy">
          <HelpCircle size={12} aria-hidden="true" />
          FAQ
        </div>
        <h2 className="section-title">Questions <em className="title-accent">fréquentes</em></h2>
        <p className="section-sub">Vous avez une question ? Consultez notre FAQ ou contactez-nous directement.</p>
      </div>

      <div className="faq-layout">
        {/* Une seule carte, les questions séparées par un filet */}
        <div className="faq-list panel sr">
          {faqs.map((f, i) => <FaqItem key={i} faq={f} idx={i} />)}
        </div>

        <aside className="faq-contact panel sr-r">
          <span className="fcc-icon" aria-hidden="true"><MessageCircle size={26} /></span>
          <h4>Besoin d'aide ?</h4>
          <p>Notre équipe support est disponible 7j/7 sur WhatsApp pour répondre à toutes vos questions.</p>

          <a href="https://wa.me/221775929390" target="_blank" rel="noreferrer" className="fcc-whatsapp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Nous contacter sur WhatsApp
          </a>

          <div className="fcc-rows">
            <a className="fcc-row" href="mailto:contact@saambiz.com">
              <span className="fcc-row-ico" aria-hidden="true"><Mail size={16} /></span>
              <span className="fcc-row-text">
                <small>Email</small>
                <strong>contact@saambiz.com</strong>
              </span>
            </a>
            <a className="fcc-row" href="tel:+221775929390">
              <span className="fcc-row-ico" aria-hidden="true"><Phone size={16} /></span>
              <span className="fcc-row-text">
                <small>Téléphone</small>
                <strong>+221 77 592 93 90</strong>
              </span>
            </a>
          </div>

          <p className="note-ok fcc-note">
            <Clock size={14} strokeWidth={2.4} aria-hidden="true" />
            Réponse sous 2 h en moyenne
          </p>
        </aside>
      </div>
    </div>

    <style>{`
      .faq-section {
        padding: 100px 32px;
        background: linear-gradient(180deg, var(--gray-light) 0%, var(--white) 60%, var(--gray-light) 100%);
      }
      .faq-inner { max-width: 1280px; margin: 0 auto; }
      .faq-layout { display: flex; align-items: flex-start; gap: 40px; }

      /* ─── LISTE ─── */
      .faq-list { flex: 1 1 640px; min-width: 0; overflow: hidden; padding: 6px 8px; }
      .faq-item { border-bottom: 1px solid var(--gray-light); }
      .faq-item:last-child { border-bottom: none; }
      .faq-q-wrap { margin: 0; font-size: inherit; font-weight: inherit; }
      .faq-q {
        width: 100%; display: flex; align-items: center; gap: 14px;
        padding: 18px 16px; background: none; border: none; cursor: pointer;
        text-align: left; border-radius: 14px;
        transition: background 0.2s ease;
      }
      .faq-q:hover { background: var(--gray-bg); }
      .faq-num {
        font-family: var(--font-display);
        font-size: 12px; font-weight: 800; color: var(--text-muted);
        flex-shrink: 0; width: 20px;
        transition: color 0.2s ease;
      }
      .faq-label {
        flex: 1; font-family: var(--font-display);
        font-size: 15px; font-weight: 600; color: var(--text-dark);
      }
      .faq-chev {
        width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
        display: inline-flex; align-items: center; justify-content: center;
        background: var(--gray-light); color: var(--text-light);
        transition: transform 0.28s ease, background 0.25s ease, color 0.25s ease;
      }
      .faq-item.open .faq-num  { color: var(--gold-ink); }
      .faq-item.open .faq-chev { transform: rotate(180deg); background: var(--navy); color: var(--white); }

      /* Ouverture animée : la ligne de grille passe de 0fr à 1fr, ce qui
         anime la hauteur réelle du contenu sans max-height approximative. */
      .faq-a-wrap {
        display: grid; grid-template-rows: 0fr;
        visibility: hidden;
        transition: grid-template-rows 0.3s cubic-bezier(0.4,0,0.2,1), visibility 0.3s;
      }
      .faq-item.open .faq-a-wrap { grid-template-rows: 1fr; visibility: visible; }
      .faq-a-inner { overflow: hidden; }
      .faq-a {
        padding: 0 16px 20px 50px;
        font-size: 14.5px; color: var(--text-light); line-height: 1.75;
      }

      /* ─── CARTE CONTACT ─── */
      .faq-contact {
        flex: 0 0 320px; padding: 28px 26px; text-align: center;
        display: flex; flex-direction: column; align-items: center; gap: 13px;
        position: sticky; top: calc(var(--nav-h) + 24px);
      }
      .fcc-icon {
        width: 58px; height: 58px; border-radius: 18px;
        background: var(--navy-light); color: var(--navy);
        display: inline-flex; align-items: center; justify-content: center;
      }
      .faq-contact h4 { font-size: 17px; font-weight: 800; color: var(--text-dark); }
      .faq-contact p  { font-size: 13.5px; color: var(--text-light); line-height: 1.6; }
      .fcc-whatsapp {
        display: flex; align-items: center; justify-content: center; gap: 9px;
        background: #25D366; color: var(--white);
        padding: 13px 22px; border-radius: 12px;
        font-size: 14px; font-weight: 700; width: 100%;
        box-shadow: 0 8px 22px rgba(37,211,102,0.32);
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }
      .fcc-whatsapp:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(37,211,102,0.42); }

      .fcc-rows { width: 100%; display: flex; flex-direction: column; gap: 8px; }
      .fcc-row {
        display: flex; align-items: center; gap: 11px; text-align: left;
        background: var(--gray-bg); border: 1px solid var(--gray-light);
        border-radius: 12px; padding: 10px 12px;
        transition: border-color 0.2s ease, background 0.2s ease;
      }
      .fcc-row:hover { border-color: rgba(13,27,61,0.16); background: var(--white); }
      .fcc-row-ico {
        width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
        background: var(--white); color: var(--navy);
        border: 1px solid var(--gray-light);
        display: inline-flex; align-items: center; justify-content: center;
      }
      .fcc-row-text { display: flex; flex-direction: column; min-width: 0; }
      .fcc-row-text small  { font-size: 10.5px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
      .fcc-row-text strong { font-size: 13px; font-weight: 700; color: var(--navy); }
      .fcc-note { margin-top: 2px; }

      @media (max-width: 980px) {
        .faq-layout { flex-direction: column; }
        .faq-list, .faq-contact { flex: 1 1 auto; width: 100%; }
        .faq-contact { position: static; }
      }
      @media (max-width: 560px) {
        .faq-section { padding: 70px 16px; }
        .faq-q { padding: 16px 10px; gap: 10px; }
        .faq-label { font-size: 14px; }
        .faq-a { padding: 0 10px 18px 40px; font-size: 14px; }
      }
    `}</style>
  </section>
);

export default Faq;
