import type { Metadata } from 'next';
import Banner from '@/components/Banner';

export const metadata: Metadata = {
  title: 'DevFest João Pessoa 2026 — Banner',
  description: 'Peça de divulgação 1280×575 do DevFest João Pessoa 2026.',
};

export default function BannerPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: '#050509',
        overflow: 'auto',
      }}
    >
      {/* Native 1280×575 art. Scales down to fit narrow viewports without distortion. */}
      <div className="banner-scaler">
        <Banner />
      </div>
    </main>
  );
}
