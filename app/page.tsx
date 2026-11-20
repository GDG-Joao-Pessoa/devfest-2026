import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Sobre from '@/components/Sobre';
import Trilhas from '@/components/Trilhas';
import Palestrantes from '@/components/Palestrantes';
import Programacao from '@/components/Programacao';
import Inscricoes from '@/components/Inscricoes';
import Patrocinadores from '@/components/Patrocinadores';
import Local from '@/components/Local';
import Faq from '@/components/Faq';
import DestaqueWorkshop from '@/components/DestaqueWorkshop';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    // .page recorta o overflow horizontal sem virar scroll container (ver globals.css),
    // o que mantém a nav `position: sticky` funcionando.
    <div id="top" className="page">
      <Nav />
      <Hero />
      <DestaqueWorkshop />
      <Marquee />
      <Sobre />
      <Palestrantes />
      <Programacao />
      <Inscricoes />
      {/* <Patrocinadores /> */}
      <Local />
      <Faq />
      <Footer />
    </div>
  );
}
