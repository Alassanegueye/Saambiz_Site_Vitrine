import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import '../styles/global.css';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import VendorFeatures from '../components/sections/VendorFeatures';
import Channels from '../components/sections/Channels';
import HowItWorks from '../components/sections/HowItWorks';
import ClientFeatures from '../components/sections/ClientFeatures';
import PaymentSection from '../components/sections/PaymentSection';
import Pricing from '../components/sections/Pricing';
import Faq from '../components/sections/Faq';
import DownloadCta from '../components/sections/DownloadCta';

/* Sections suivies par la navigation (ordre d'apparition dans la page) */
const SECTION_IDS = ['hero', 'vendor', 'channels', 'features', 'client', 'payment', 'pricing', 'faq', 'download'];

/* Page d'accueil de SaamBiz — la présentation de la marketplace.
   Le site public d'une boutique vit dans src/boutique/, sur /b/<slug>. */
function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('hero');
  const [showTop, setShowTop] = useState(false);
  const ticking = useRef(false);

  /* Un seul écouteur de scroll pour tout l'état de la page :
     navbar (compacte / masquée), section courante
     et bouton de retour en haut. Les mesures passent par requestAnimationFrame
     pour ne pas relayouter à chaque événement. */
  useEffect(() => {
    let lastY = window.scrollY;

    const measure = () => {
      ticking.current = false;
      const y = window.scrollY;

      setScrolled(y > 20);
      // masque en descendant (au-delà de 120px), réaffiche en remontant / tout en haut
      setHidden(y > 120 && y > lastY);
      setShowTop(y > 600);
      lastY = y;

      // Section courante : la dernière dont le haut est passé sous la navbar.
      const line = y + window.innerHeight * 0.28;
      let current = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= line) current = id;
      }
      setActive(current);
    };

    const handler = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler, { passive: true });
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  /* Apparition des blocs au scroll — désactivée si l'utilisateur a demandé
     moins d'animations (le CSS les rend alors visibles d'emblée). */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = document.querySelectorAll('.sr, .sr-l, .sr-r');
    if (reduced) {
      els.forEach(el => el.classList.add('sr-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <a className="skip-link" href="#main">Aller au contenu</a>

      <Navbar scrolled={scrolled} hidden={hidden} scrollTo={scrollTo} active={active} />

      <main id="main" tabIndex={-1}>
        <Hero scrollTo={scrollTo} />
        <VendorFeatures scrollTo={scrollTo} />
        <Channels scrollTo={scrollTo} />
        <HowItWorks />
        <ClientFeatures scrollTo={scrollTo} />
        <PaymentSection scrollTo={scrollTo} />
        <Pricing scrollTo={scrollTo} />
        <Faq />
        <DownloadCta />
      </main>

      <Footer scrollTo={scrollTo} />

      <button
        className={`to-top ${showTop ? 'show' : ''}`}
        onClick={backToTop}
        aria-label="Revenir en haut de la page"
        tabIndex={showTop ? 0 : -1}
      >
        <ArrowUp size={20} strokeWidth={2.5} />
      </button>
    </>
  );
}

export default LandingPage;
