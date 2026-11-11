# Palestrantes · DevFest João Pessoa 2026

26 palestrantes. Fotos em `fotos/`, nomeadas pelo `id`.

- `palestrantes.json`: dados completos para o site (Next.js: importe direto em `/data`).
- `palestrantes.csv`: mesma base para planilha.

Campos: id, nome, cargo, instagram, linkedin, rede, palestra { titulo, subtitulo, resumo, formato, parceria }, selo (GDE, Googler, Convidado/a), bio, foto, agenda { dia, diaLabel, horario, auditorio }.

Evento: 20 e 21 de novembro de 2026 · Uniesp · João Pessoa – PB.

> **Organização no projeto:** o JSON foi para `data/palestrantes.json` (fonte usada pelo site); as fotos originais ficam aqui em `fotos/` e as versões otimizadas são geradas em `public/assets/speakers/<id>.webp` por `node scripts/otimizar-fotos-palestrantes.mjs`.
