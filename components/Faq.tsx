'use client';

import { useState } from 'react';
import Reveal from './Reveal';
import { faqs } from '@/lib/data';

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <Reveal
      as="section"
      id="faq"
      style={{ maxWidth: 820, margin: '0 auto', padding: '70px 40px 90px', scrollMarginTop: 80 }}
    >
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <div
          style={{
            font: '600 12px/1 var(--font-ibm)',
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#8ab4f8',
            marginBottom: 16,
          }}
        >
          // Dúvidas
        </div>
        <h2 style={{ margin: 0, font: '800 44px/1.05 var(--font-sora)', letterSpacing: '-1.5px' }}>
          Perguntas frequentes
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,.03)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  padding: '22px 24px',
                  background: 'none',
                  border: 'none',
                  color: '#f2f2f7',
                  cursor: 'pointer',
                  textAlign: 'left',
                  font: '700 17px var(--font-sora)',
                }}
              >
                <span>{f.q}</span>
                <span
                  style={{
                    fontSize: 22,
                    color: '#8ab4f8',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform .25s',
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div
                  style={{
                    padding: '0 24px 22px',
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: 'rgba(242,242,247,.66)',
                  }}
                >
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
