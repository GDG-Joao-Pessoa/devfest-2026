# Handoff: DevFest João Pessoa 2026 — Landing Page + Banner

## Overview
Site de divulgação e venda de ingressos do **DevFest João Pessoa 2026** (1ª edição), o maior evento de tecnologia da comunidade GDG João Pessoa. Evento nos dias **20 e 21 de novembro de 2026**, no **Uniesp Centro Universitário — João Pessoa, PB**.

Este pacote contém:
1. **Landing page completa** (`DevFest JP Landing.dc.html`) — hero, sobre, trilhas, palestrantes, agenda, patrocinadores, local, FAQ, ingressos, footer.
2. **Banner de divulgação** (`DevFest Banner.dc.html`) — peça 1280×575 para redes sociais, com botões de export PNG/JPG.

## About the Design Files
Os arquivos `.dc.html` deste bundle são **referências de design criadas em HTML** — protótipos que mostram o visual e o comportamento pretendidos, **não** código de produção para copiar direto. Eles usam um runtime interno de componentes ("Design Components") que **não deve ser portado**.

A tarefa é **recriar estes designs em um projeto Next.js novo**, usando as convenções do framework. Recomendação de stack:
- **Next.js 14+ (App Router)** com TypeScript
- **Tailwind CSS** para estilização (ou CSS Modules) — os valores exatos estão em *Design Tokens*
- **Framer Motion** para as animações de revelação ao rolar e transições
- **next/font** para carregar as fontes Google (Sora, Figtree, IBM Plex Mono)
- **next/image** para os assets de logo (na pasta `assets/`)

Estrutura sugerida:
```
app/
  layout.tsx            # fontes, metadata, <html lang="pt-BR">
  page.tsx              # landing (compõe as seções)
  banner/page.tsx       # banner exportável (opcional)
components/
  Nav.tsx  Hero.tsx  Countdown.tsx  Sobre.tsx  Trilhas.tsx
  Palestrantes.tsx  Agenda.tsx  Patrocinadores.tsx  Local.tsx
  Faq.tsx  Ingressos.tsx  Footer.tsx
  Reveal.tsx            # wrapper de scroll-reveal (IntersectionObserver / Framer)
lib/
  data.ts              # trilhas, palestrantes, sessões, faqs, passes
public/assets/         # logos (copiar deste bundle)
```

## Fidelity
**High-fidelity (hifi).** Cores, tipografia, espaçamentos e interações são finais. Recriar pixel-a-pixel com os tokens abaixo. Placeholders (fotos de palestrantes, mapa, logos de patrocinadores) estão marcados com molduras listradas e devem virar slots de imagem reais.

---

## Design Tokens

### Cores — base (tema escuro)
| Token | Hex | Uso |
|---|---|---|
| `bg` | `#08080f` | fundo do site |
| `bg-grad-top` | `#141426` | topo do radial-gradient do hero/banner |
| `surface` | `rgba(255,255,255,.03)` | cards |
| `surface-border` | `rgba(255,255,255,.08–.09)` | bordas de card |
| `text` | `#f2f2f7` | texto principal |
| `text-muted` | `rgba(242,242,247,.66)` | parágrafos |
| `text-dim` | `rgba(242,242,247,.5)` | legendas |
| `hairline` | `rgba(255,255,255,.07–.12)` | divisórias |

### Cores — marca GDG / Google (acentos)
| Nome | Hex | Variante clara (texto) |
|---|---|---|
| Azul | `#4285F4` | `#8ab4f8` |
| Verde | `#34A853` | `#5bb974` |
| Amarelo | `#FBBC04` | `#fcc934` |
| Vermelho | `#EA4335` | `#ee675c` |

**Gradiente-assinatura** (headline do hero, "26" do banner, wordmark "João Pessoa"):
`linear-gradient(90deg,#4285F4 0%,#34A853 42%,#FBBC04 72%,#EA4335 100%)`
(no banner usa ângulo `140deg`). Aplicar como texto via `background-clip:text; color:transparent`.

Botão primário / CTA: `linear-gradient(90deg,#4285F4,#34A853)`, texto `#fff`, `box-shadow:0 12px 34px -10px rgba(66,133,244,.6)`.

### Tipografia (Google Fonts)
- **Sora** — títulos e números (400/600/700/800). H1 hero: `800 84px/.98`, letter-spacing `-2.5px`. H2 seções: `800 44–46px/1.05`, `-1.5px`.
- **Figtree** — corpo e botões (400/500/600/700/800). Parágrafos 16–18px, line-height 1.6–1.7.
- **IBM Plex Mono** — eyebrows, labels, datas (500/600). 11–13px, letter-spacing 1–3px, uppercase. Eyebrow de seção: `// Nome` na cor `#8ab4f8`.

### Raio / sombra / espaçamento
- Raio: pills `999px`; cards `14–22px`; chips `999px`.
- Sombra de destaque: `0 24px 60px -24px rgba(66,133,244,.5)` (card popular) / `0 24px 60px -24px rgba(0,0,0,.8)` (barra flutuante).
- Largura de conteúdo: máx `1100px` (agenda `1000`, FAQ `820`), padding lateral `40px`. Seções ~`70–110px` de padding vertical. `scroll-margin-top:80px` nas âncoras (por causa da nav sticky).

---

## Screens / Views — Landing

### 1. Nav (sticky, topo)
- `position:sticky; top:0; z-index:60`, `background:rgba(8,8,15,.72)`, `backdrop-filter:blur(16px)`, borda inferior `1px rgba(255,255,255,.07)`. Padding `15px 40px`, space-between.
- **Esquerda:** logo `gdg-jp-logo-white.png` (h 28px) · divisória vertical 1px · logo `devfest-brackets-w3.png` (h 26px).
- **Direita:** links (Figtree 600 13.5px, `rgba(242,242,247,.72)`, hover `#8ab4f8`): Trilhas, Palestrantes, Agenda, Local, FAQ + botão **Ingressos** (pill, gradiente azul→verde).

### 2. Hero
- `padding:110px 40px 150px`, `overflow:hidden`, centralizado (`max-width:1000px`).
- **Fundo:** 4 blobs radiais animados (azul, verde, amarelo, vermelho) com `filter:blur` e animação `floaty` (translateY ±16px, 9–13s ease-in-out infinite).
- **Conteúdo (centro):**
  1. Logo `devfest-2026-w3.png` (h 82px, drop-shadow azul).
  2. Wordmark **"JOÃO PESSOA"** — Sora 700 22px, `letter-spacing:9px`, uppercase, gradiente-assinatura, colado sob a logo (`margin:-2px 0 30px; padding-left:9px`).
  3. Pill eyebrow: `João Pessoa · 1ª Edição · Inscrições abertas` (mono 12px, dot verde com glow).
  4. **H1:** "A comunidade de / tecnologia e inovação / *se encontra aqui.*" — a 3ª linha usa o gradiente-assinatura.
  5. Subcopy (max 560px, `rgba(...,.66)`).
  6. CTAs: **"Compre seu ingresso →"** (gradiente) + **"Ver programação"** (outline).
  7. **Countdown** (4 blocos: Dias/Horas/Min/Seg) — números Sora 800 34px, cada um numa cor GDG (azul/verde/amarelo/vermelho). Ver *Interactions*.
- **Barra flutuante** (max 920px, `margin-top:64px`): card `rgba(18,18,28,.9)` blur, raio 20px, sombra escura. 3 blocos separados por hairline: 📅 **20 & 21 Nov / 2026** · 📍 **Uniesp / João Pessoa · PB** · botão branco **"Garantir lugar →"**.

### 3. Marquee
Faixa full-width com borda em cima/baixo; texto Sora 700 22px `rgba(...,.28)` rolando (`@keyframes marq` translateX 0→-50%, 28s linear infinite). Itens: IA & Machine Learning ◆ Web Moderna ◆ Mobile ◆ Cloud & DevOps ◆ Comunidade (◆ alternando cores GDG). Duplicar o conteúdo p/ loop contínuo.

### 4. Sobre + Stats
Grid 2 colunas. Esquerda: eyebrow `// Sobre o evento`, H2 "Onde a comunidade / vira movimento.", 2 parágrafos. Direita: 4 stat cards (grid 2×2): **40+** Palestras & workshops (azul), **1.200** Participantes (verde), **04** Trilhas (amarelo), **02** Dias (vermelho). Número Sora 800 44px na cor da stat.

### 5. Trilhas (`#trilhas`)
Header com eyebrow + H2 "Quatro trilhas, um só destino." + parágrafo à direita. Grid 2×2 de cards, um por cor GDG. Cada card: fundo `rgba(cor,.07)`, borda `rgba(cor,.25)`, blob radial no canto sup-dir, número mono (`01`–`04`), H3 Sora 800 28px, descrição.
1. **IA & Machine Learning** (azul) — "Do prompt ao produto: LLMs, Gemini, agentes, MLOps e IA aplicada de verdade."
2. **Web Moderna** (verde) — "Frameworks, performance, arquitetura de front-end e as plataformas que escalam."
3. **Mobile** (amarelo) — "Android, Flutter, Kotlin Multiplatform e apps que encantam milhões."
4. **Cloud & DevOps** (vermelho) — "Infra sem atrito: Google Cloud, containers, observabilidade e automação."

### 6. Palestrantes (`#palestrantes`)
Header centralizado ("Quem sobe ao palco"). Grid 4 colunas × 8 cards. Card: quadrado placeholder listrado com `[ foto ]` e uma barra colorida (cor GDG rotativa) no canto sup-esq; nome (Sora 700 17px) + função (mono/figtree). Todos "A definir" no momento. Link abaixo: "Quer palestrar? Envie sua proposta →".

### 7. Agenda (`#agenda`) — interativa
Header "Dois dias, uma jornada". **Tabs:** "Dia 1 · 20 Nov" / "Dia 2 · 21 Nov" (pill; ativo = gradiente azul→verde, inativo = outline). Lista de sessões do dia selecionado; cada linha: grid `120px 1fr auto` — horário (mono 15px azul) · título (Sora 700 18px) + palestrante · chip da trilha (cor/fundo conforme trilha). Dados em *State Management*.

### 8. Patrocinadores (`#patrocinadores`)
3 cotas: **Diamante** (2 slots grandes, h110), **Ouro** (3 slots, h90, label amarelo), **Prata & Apoio** (4 slots, h72). Slots = placeholder `[ logo ]`. Botão "Seja um patrocinador →".

### 9. Local (`#local`)
Grid 2 colunas. Esquerda: eyebrow, H2 "Uniesp Centro / Universitário", parágrafo, 3 linhas com ícone (📍 endereço, 🚗 estacionamento, 🏨 hotéis parceiros). Direita: placeholder de mapa (listrado, h340) → substituir por embed do Google Maps.

### 10. FAQ (`#faq`) — accordion
Header "Perguntas frequentes". 5 itens; um aberto por vez (o 1º começa aberto). Botão full-width com pergunta (Sora 700 17px) + "+" que gira 45° quando aberto; resposta some/aparece. Conteúdo:
1. **Onde e quando acontece o DevFest?** — "Nos dias 20 e 21 de novembro de 2026, no Uniesp Centro Universitário, em João Pessoa - PB."
2. **O ingresso dá acesso aos dois dias?** — "Sim. Todos os ingressos garantem acesso à programação completa dos dois dias, incluindo todas as trilhas."
3. **Vou receber certificado?** — "Sim, todos os participantes recebem certificado digital de participação após o evento."
4. **Preciso saber programar para participar?** — "Não! O DevFest tem conteúdo do iniciante ao avançado. É um evento para toda a comunidade de tecnologia."
5. **Como faço para palestrar ou patrocinar?** — "Abrimos chamadas para palestrantes (call for papers) e cotas de patrocínio. Entre em contato pelos canais da comunidade GDG João Pessoa."

### 11. Ingressos (`#ingressos`)
Header "Garanta seu lugar" + parágrafo + **selo "Lote atual: 1º lote · aberto"** (pill verde com dot). Grid 3 colunas, card do meio destacado (gradiente azul/verde translúcido, borda azul, badge **"MAIS POPULAR"**). Cada card: nome (mono uppercase), subtítulo (cor de acento), preço (Sora 800 42px), linha de lote, descrição, hairline, lista de benefícios (`✓`), botão.

- **Remote Pass** — *De onde você estiver* — **R$ 79,99** · 1º lote · online
  Desc: "Acompanhe as trilhas principais ao vivo, tenha acesso às gravações e materiais pra consultar quando quiser e receba seu certificado. Ideal pra quem não pode estar presente, mas não quer ficar de fora."
  ✓ Trilhas principais ao vivo · ✓ Gravações e materiais · ✓ Certificado de participação · Botão outline "Comprar".
- **Dev Pass** *(MAIS POPULAR)* — *A experiência completa, presencial* — **R$ 99,99** · 1º lote · presencial
  Desc: "Viva o DevFest do jeito que ele foi feito pra ser vivido. Acesso a todas as trilhas, codelabs, arenas práticas e a todo o networking do evento, além de um kit de boas-vindas exclusivo com brindes e swags feitos especialmente pra essa edição."
  ✓ Tudo do Remote Pass · ✓ Acesso presencial a todas as trilhas · ✓ Kit de boas-vindas · Botão gradiente "Comprar agora →".
- **Root Pass** — *Acesso de superusuário* (acento amarelo) — **R$ 219,99** · 1º lote · vagas limitadas
  Desc: "Pra quem quer aproveitar o evento sem nenhum gargalo de permissão. Tudo do Dev Pass mais entrada na área root: um ambiente exclusivo com buffet o dia todo durante os dois dias, onde circulam palestrantes e empresas patrocinadoras, feito pra um networking mais próximo e qualificado."
  ✓ Tudo do Dev Pass · ✓ Área root com buffet exclusivo o dia todo, durante os dois dias · ✓ Kit de boas-vindas diferenciado com itens exclusivos · ✓ Lugares reservados na plateia do palco principal · ✓ Massoterapia exclusiva dentro da área root · ✓ Acesso à área root para networking diferenciado · ✓ Credenciamento exclusivo para a área root · Botão outline amarelo "Comprar".

### 12. Footer
Borda superior. Logo `gdg-jp-logo-white.png` + descrição. Duas colunas de links (Evento / Comunidade). Barra inferior mono: "© 2026 GDG João Pessoa" · "20 & 21 Nov · Uniesp · João Pessoa".

---

## Screen — Banner (1280×575)
Peça fixa `1280×575` (exportável). Fundo `radial-gradient(120% 130% at 50% 0%,#141426,#0a0a14 55%,#08080f)`.
- **Anéis concêntricos** à direita (4 círculos com borda fina nas cores GDG, baixa opacidade) + 1 espelhado à esquerda (branco .05).
- **Glows** radiais (azul topo-esq, verde baixo-dir, amarelo baixo-centro).
- **Sup-esq:** logo `gdg-jp-clean.png` (h 60px).
- **Sup-dir:** pill de data "20 & 21 NOV · 2026" (mono, dot verde glow).
- **Centro:** coluna centralizada com logo `devfest-clean.png` (h 120px) + wordmark "JOÃO PESSOA" (Sora 700 24px, letter-spacing 12px, gradiente) logo abaixo; ao lado, **"26"** em Sora 800 150px com gradiente-assinatura 140deg. Abaixo: linha "Uniesp Centro Universitário · Paraíba".
- **Rodapé:** tagline mono uppercase "A comunidade de tecnologia e inovação se encontra aqui".
- **Export:** o protótipo tem botões que rasterizam via html-to-image (PNG 2× e JPG 0.92). No Next, expor rota `/banner` e/ou gerar OG image com `next/og` (`ImageResponse`) reaproveitando o mesmo layout para meta tags sociais.

---

## Interactions & Behavior
- **Scroll reveal:** cada seção (`[data-reveal]`) entra com `opacity 0→1` + `translateY(28px)→0`, transição `.7s cubic-bezier(.2,.7,.2,1)`, disparada por IntersectionObserver (threshold 0.12), uma vez. Implementar com Framer Motion `whileInView` ou um hook `useInView`.
- **Countdown:** alvo `2026-11-20T09:00:00-03:00`. Atualiza a cada 1s (`setInterval` num `useEffect`, limpar no unmount). Exibe d/h/m/s com zero-pad (2 dígitos). Se passar, zera.
- **Agenda tabs:** estado `day (1|2)`, troca a lista de sessões; botão ativo com gradiente.
- **FAQ:** estado `openFaq (index | -1)`, só um aberto; clicar no aberto fecha; ícone "+" gira 45°.
- **Marquee:** loop CSS infinito (conteúdo duplicado). `prefers-reduced-motion` deve pausar marquee e blobs.
- **Nav/âncoras:** scroll suave; `scroll-margin-top:80px`.
- **Hover:** links → `#8ab4f8`; botões podem ganhar leve brilho/scale (opcional, manter sutil).
- **Blobs `floaty`:** `@keyframes floaty { 0%,100%{translateY(0)} 50%{translateY(-16px)} }`, durações 9/11/13s.

## State Management
Client components onde há interação (`Hero/Countdown`, `Agenda`, `Faq`). Dados estáticos em `lib/data.ts`:
- `speakers`: 8 × `{ name:'A definir', role, color }` (cores rotacionam azul/verde/amarelo/vermelho).
- `tracks`: mapa `IA|Web|Mobile|Cloud|Geral` → `{ colorText, bg }`.
- `sessions`: `{ 1:[...], 2:[...] }`, cada sessão `{ time, title, speaker, track }`.
  - **Dia 1:** 09:00 Credenciamento & Welcome Coffee (Geral) · 10:00 Keynote de abertura: o futuro da IA (IA) · 11:30 Construindo apps modernos na web (Web) · 14:00 Android além do básico (Mobile) · 16:00 Escalando com Google Cloud (Cloud).
  - **Dia 2:** 09:30 Agentes de IA na prática (IA) · 11:00 Performance web em produção (Web) · 14:00 Flutter & Kotlin Multiplatform (Mobile) · 15:30 DevOps sem dor de cabeça (Cloud) · 17:00 Encerramento, sorteios & networking (Geral).
- `faqs`: array `{ q, a }` (texto acima).
- `passes`: array com os 3 ingressos (nome, tagline, preço, lote, descrição, features[], destaque?, accentColor).
- Botões "Comprar" → integrar depois com plataforma de ingressos (ex.: Sympla) via `href`.

## Assets
Na pasta `assets/` deste bundle (mover para `public/assets/`). Todos PNG com **fundo transparente**, texto branco + mark GDG colorido — feitos para fundo escuro:
- `gdg-jp-logo-white.png` — lockup "Google Developer Groups / João Pessoa" (nav + footer).
- `devfest-brackets-w3.png` — logo `{ DevFest }` (nav).
- `devfest-2026-w3.png` — logo "DevFest 2026" com mark + pill 2026 (hero).
- `gdg-jp-clean.png` — lockup GDG JP em alta (banner, canto).
- `devfest-clean.png` — wordmark "DevFest" em alta com mark (banner, centro).
Placeholders a substituir por assets reais: fotos dos palestrantes, embed do Google Maps do Uniesp, logos dos patrocinadores. Ícones de local/barra são emoji (📅📍🚗🏨) — trocar por biblioteca de ícones (ex.: lucide-react) se preferir.

## Files (referências neste bundle)
- `DevFest JP Landing.dc.html` — landing completa.
- `DevFest Banner.dc.html` — banner 1280×575.
- `assets/*.png` — logos.

> Observação de marca: as logos GDG/DevFest são da comunidade **GDG João Pessoa** (organizadora). Manter proporções e áreas de respiro originais; não distorcer nem recolorir o mark.
