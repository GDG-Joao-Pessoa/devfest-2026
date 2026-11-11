import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Sobre from '@/components/Sobre';
import Trilhas from '@/components/Trilhas';
import Palestrantes from '@/components/Palestrantes';
import Programacao from '@/components/Programacao';
import Patrocinadores from '@/components/Patrocinadores';
import Local from '@/components/Local';
import Faq from '@/components/Faq';
import Ingressos from '@/components/Ingressos';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    // .page recorta o overflow horizontal sem virar scroll container (ver globals.css),
    // o que mantém a nav `position: sticky` funcionando.
    <div id="top" className="page">
      <Nav />
      <Hero />
      <Marquee />
      <Sobre />
      {/* <Palestrantes /> */}
      <Programacao />
      {/* <Patrocinadores /> */}
      <Ingressos />
      <Local />
      <Faq />
      <Footer />
    </div>
  );
}
