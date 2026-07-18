import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Sobre from '@/components/Sobre';
import Trilhas from '@/components/Trilhas';
import Palestrantes from '@/components/Palestrantes';
import Agenda from '@/components/Agenda';
import Patrocinadores from '@/components/Patrocinadores';
import Local from '@/components/Local';
import Faq from '@/components/Faq';
import Ingressos from '@/components/Ingressos';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div id="top" style={{ overflowX: 'hidden', position: 'relative' }}>
      <Nav />
      <Hero />
      <Marquee />
      <Sobre />
      <Trilhas />
      {/* <Palestrantes /> */}
      {/* <Agenda />
      <Patrocinadores /> */}
      <Ingressos />
      <Local />
      <Faq />
      <Footer />
    </div>
  );
}
