const items = [
  { label: 'IA & Machine Learning', dot: '#4285F4' },
  { label: 'Web Moderna', dot: '#34A853' },
  { label: 'Mobile', dot: '#FBBC04' },
  { label: 'Cloud & DevOps', dot: '#EA4335' },
  { label: 'Comunidade', dot: '#4285F4' },
];

function Row() {
  return (
    <>
      {items.map((it, i) => (
        <span key={i} style={{ display: 'inline-flex', gap: 44, alignItems: 'center' }}>
          <span>{it.label}</span>
          <span style={{ color: it.dot }}>◆</span>
        </span>
      ))}
    </>
  );
}

export default function Marquee() {
  return (
    <div
      style={{
        borderTop: '1px solid rgba(255,255,255,.07)',
        borderBottom: '1px solid rgba(255,255,255,.07)',
        padding: '20px 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        className="marquee-track"
        style={{
          display: 'inline-flex',
          gap: 44,
          alignItems: 'center',
          animation: 'marq 28s linear infinite',
          font: '700 22px var(--font-sora)',
          color: 'rgba(242,242,247,.28)',
        }}
      >
        <Row />
        <Row />
      </div>
    </div>
  );
}
