# Handoff: DevFest João Pessoa 2026 — Landing Page + Banner

## Overview
Site de divulgação e venda de ingressos do **DevFest João Pessoa 2026** (1ª edição), o maior evento de tecnologia da comunidade GDG João Pessoa. Evento nos dias **20 e 21 de novembro de 2026**, no **Uniesp Centro Universitário** — Rodovia BR-230, Km 14, s/n, Morada Nova, Cabedelo/PB (Grande João Pessoa).

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

Estrutura atual do projeto:
```
app/
  layout.tsx            # fontes, metadata, viewport, <html lang="pt-BR">
  page.tsx              # landing (compõe as seções)
  globals.css           # estilos globais + regras responsivas (breakpoints)
  banner/page.tsx       # banner exportável (opcional)
  ics/[arquivo]/route.ts # GET /ics/<sessao>.ics — evento de calendário por sessão
components/
  Nav.tsx  NavMenu.tsx  Hero.tsx  Countdown.tsx  Sobre.tsx  Trilhas.tsx
  Palestrantes.tsx  Programacao.tsx  ProgramacaoClient.tsx  Patrocinadores.tsx
  Local.tsx  Faq.tsx  Ingressos.tsx  Footer.tsx
  Reveal.tsx            # wrapper de scroll-reveal (IntersectionObserver / Framer)
data/
  schedule.ts           # programação oficial (fonte única: seção, .ics e JSON-LD)
lib/
  data.ts               # local do evento, trilhas, palestrantes, faqs, ingressos
  schedule.ts           # derivados da programação (horários ISO, ids, slugs)
public/assets/          # logos
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
- Largura de conteúdo: máx `1100px` (FAQ `820`), padding lateral `40px` (`22px` em telas ≤ 560px). Seções ~`70–110px` de padding vertical. `scroll-margin-top:80px` nas âncoras (por causa da nav sticky).

---

## Screens / Views — Landing

### 1. Nav (sticky, topo)
- `position:sticky; top:0; z-index:60`, `background:rgba(8,8,15,.72)`, `backdrop-filter:blur(16px)`, borda inferior `1px rgba(255,255,255,.07)`. Padding `15px 40px`, space-between.
- **Esquerda:** logo `gdg-jp-logo-white.png` (h 28px) · divisória vertical 1px · logo `devfest-brackets-w3.png` (h 26px).
- **Direita:** links (Figtree 600 13.5px, `rgba(242,242,247,.72)`, hover `#8ab4f8`): Trilhas, Palestrantes, Programação, Local, FAQ + botão **Ingressos** (pill, gradiente azul→verde).
- **Mobile (≤ 900px):** os links viram um menu hambúrguer (`NavMenu.tsx`); o botão **Ingressos** continua visível. Em ≤ 480px o logo DevFest sai da nav para caber tudo.

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
Grid 2 colunas. Esquerda: eyebrow `// Sobre o evento`, H2 "Onde a comunidade / vira movimento.", 2 parágrafos. Direita: 4 stat cards (grid 2×2): **25+** Palestras & workshops (azul), **600** Participantes esperados (verde), **04** Trilhas (amarelo), **02** Dias (vermelho). Número Sora 800 44px na cor da stat.

### 5. Trilhas (`#trilhas`)
Header com eyebrow + H2 "Quatro trilhas, um só destino." + parágrafo à direita. Grid 2×2 de cards, um por cor GDG. Cada card: fundo `rgba(cor,.07)`, borda `rgba(cor,.25)`, blob radial no canto sup-dir, número mono (`01`–`04`), H3 Sora 800 28px, descrição.
1. **IA & Machine Learning** (azul) — "Do prompt ao produto: LLMs, Gemini, agentes, MLOps e IA aplicada de verdade."
2. **Web Moderna** (verde) — "Frameworks, performance, arquitetura de front-end e as plataformas que escalam."
3. **Mobile** (amarelo) — "Android, Flutter, Kotlin Multiplatform e apps que encantam milhões."
4. **Cloud & DevOps** (vermelho) — "Infra sem atrito: Google Cloud, containers, observabilidade e automação."

### 6. Palestrantes (`#palestrantes`)
Header centralizado ("Quem sobe ao palco"). Grid 4 colunas × 8 cards. Card: quadrado placeholder listrado com `[ foto ]` e uma barra colorida (cor GDG rotativa) no canto sup-esq; nome (Sora 700 17px) + função (mono/figtree). Todos "A definir" no momento. Link abaixo: "Quer palestrar? Envie sua proposta →".

### 7. Programação (`#programacao`) — interativa
Header "Dois dias, uma jornada". Dados em `data/schedule.ts` (sessões de 40 min em dois auditórios simultâneos, Master e Executivo).
- **Abas por dia:** "Sexta-feira · 20/11" / "Sábado · 21/11" (ativo = gradiente azul→verde). A aba ativa vai para a URL (`?dia=sexta` / `?dia=sabado`); nos dias do evento abre no dia atual.
- **Desktop (≥ 900px):** coluna de horário + duas colunas (Auditório Master | Auditório Executivo). Horário com uma só sessão: a outra célula fica com borda tracejada vazia.
- **Mobile:** lista por horário, cada sessão em card com selo do auditório, e filtro Todos / Master / Executivo.
- **Card:** palestrante(s) em destaque, título completo, selo "Workshop" quando for o caso e botão **"Adicionar à agenda"** (baixa `/ics/<sessao>.ics`). Os selos de palestrante (GDE, Googler, Convidada/o) existem no tipo, mas hoje nenhum é exibido.
- **Intervalos / coffee breaks:** linha tracejada de largura total. **Code in the Dark + Happy Hour** (sábado, 17:00): borda nas 4 cores Google.
- **"Agora":** nos dias do evento (fuso America/Recife) o bloco em andamento ganha destaque verde e selo "Agora", e a página rola até ele ao abrir a aba.
- JSON-LD `Event` com um `subEvent` por sessão.

### 8. Patrocinadores (`#patrocinadores`)
3 cotas: **Diamante** (2 slots grandes, h110), **Ouro** (3 slots, h90, label amarelo), **Prata & Apoio** (4 slots, h72). Slots = placeholder `[ logo ]`. Botão "Seja um patrocinador →".

### 9. Local (`#local`)
Grid 2 colunas (empilha em ≤ 900px). Esquerda: eyebrow, H2 "Uniesp Centro / Universitário", parágrafo, 2 linhas com ícone (📍 endereço: Rodovia BR-230, Km 14, s/n · Morada Nova, Cabedelo – PB; 🚗 estacionamento no local). Direita: embed do Google Maps (h340; 280 no mobile). O endereço vem de `VENUE` em `lib/data.ts`.

### 10. FAQ (`#faq`) — accordion
Header "Perguntas frequentes". 5 itens; um aberto por vez (o 1º começa aberto). Botão full-width com pergunta (Sora 700 17px) + "+" que gira 45° quando aberto; resposta some/aparece. Conteúdo:
1. **Onde e quando acontece o DevFest?** — "Nos dias 20 e 21 de novembro de 2026, no Uniesp Centro Universitário (Rodovia BR-230, Km 14, s/n · Morada Nova, Cabedelo – PB), na Grande João Pessoa."
2. **O ingresso dá acesso aos dois dias?** — "Sim. Todos os ingressos garantem acesso à programação completa dos dois dias, incluindo todas as trilhas."
3. **Vou receber certificado?** — "Sim, todos os participantes recebem certificado digital de participação após o evento."
4. **Preciso saber programar para participar?** — "Não! O DevFest tem conteúdo do iniciante ao avançado. É um evento para toda a comunidade de tecnologia."
5. **Como faço para palestrar ou patrocinar?** — "Abrimos chamadas para palestrantes (call for papers) e cotas de patrocínio. Entre em contato pelos canais da comunidade GDG João Pessoa."

### 11. Ingressos (`#ingressos`)
Header "Garanta seu lugar" + parágrafo ("Estamos no lote final: as vendas vão até 21/11 às 17:30.") + **selo "Lote atual: lote final · aberto"** (pill verde com dot). Grid 2 colunas centralizado (máx 820px; empilha em ≤ 900px). Cada card: nome (mono uppercase), subtítulo (cor de acento), preço (Sora 800 42px), linha de lote (com a taxa da plataforma), descrição, hairline, lista de benefícios (`✓`), botão. Lote final, ambos só presencial (o Remote Pass não está mais à venda):

- **Dev Pass** *(MAIS POPULAR)* — *A experiência completa, presencial* — **R$ 160,00** + taxa de R$ 16,00 · lote final
  Desc: "Viva o DevFest do jeito que ele foi feito pra ser vivido. Acesso a todas as trilhas, codelabs, arenas práticas e a todo o networking do evento, além de um kit de boas-vindas exclusivo com brindes e swags feitos especialmente pra essa edição."
  ✓ Acesso presencial a todas as trilhas · ✓ Kit de boas-vindas · ✓ Certificado de participação · Botão gradiente "Comprar agora →".
- **Root Pass** *(PREMIUM)* — *Acesso de superusuário* (acento amarelo) — **R$ 279,99** + taxa de R$ 28,00 · lote final
  Desc: "Pra quem quer aproveitar o evento sem nenhum gargalo de permissão. Tudo do Dev Pass mais entrada na área root: um ambiente exclusivo com buffet o dia todo durante os dois dias, onde circulam palestrantes e empresas patrocinadoras, feito pra um networking mais próximo e qualificado."
  ✓ Tudo do Dev Pass · ✓ Área root com buffet exclusivo o dia todo, durante os dois dias · ✓ Kit de boas-vindas diferenciado com itens exclusivos · ✓ Lugares reservados na plateia do palco principal · ✓ Massoterapia exclusiva dentro da área root · ✓ Acesso à área root para networking diferenciado · ✓ Credenciamento exclusivo para a área root · Botão amarelo "Comprar agora →".

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
- **Programação:** abas por dia (WAI-ARIA tabs, setas/Home/End), dia ativo na URL (`?dia=`), filtro por auditório no mobile e destaque "Agora" ao vivo — ver seção 7. Renderização no servidor; só abas, filtro e "agora" são Client Components (`ProgramacaoClient.tsx`).
- **FAQ:** estado `openFaq (index | -1)`, só um aberto; clicar no aberto fecha; ícone "+" gira 45°.
- **Marquee:** loop CSS infinito (conteúdo duplicado). `prefers-reduced-motion` deve pausar marquee e blobs.
- **Nav/âncoras:** scroll suave; `scroll-margin-top:80px`.
- **Hover:** links → `#8ab4f8`; botões podem ganhar leve brilho/scale (opcional, manter sutil).
- **Blobs `floaty`:** `@keyframes floaty { 0%,100%{translateY(0)} 50%{translateY(-16px)} }`, durações 9/11/13s.

## State Management
Client components onde há interação (`Hero/Countdown`, `ProgramacaoClient`, `NavMenu`, `Faq`). Dados estáticos:
- `data/schedule.ts` → `schedule`: programação oficial dos dois dias (`ScheduleDay[]`). Única fonte da seção Programação, dos `.ics` e do JSON-LD.
- `lib/data.ts`:
  - `VENUE` / `VENUE_ADDRESS`: nome e endereço do local (usados no Local, FAQ, `.ics` e JSON-LD).
  - `speakers`: 8 × `{ name:'A definir', role, color }` (cores rotacionam azul/verde/amarelo/vermelho).
  - `tracks`: as 4 trilhas `{ n, title, desc, color, text }`.
  - `faqs`: array `{ q, a }` (texto acima).
  - `passes`: os 2 ingressos do lote final (nome, tagline, preço, lote, descrição, features[], featured?/premium?, accent).
- Botões "Comprar" → plataforma de ingressos (`TICKETS_URL`, Doity).

## Responsividade
Desktop-first, com regras em `app/globals.css`:
- **≤ 900px:** grids de 2–3 colunas empilham (Sobre, Trilhas, Local, Ingressos), a barra do hero vira card, a nav troca os links pelo menu hambúrguer, a Programação vira lista com filtro.
- **≤ 560px:** padding lateral `22px` em seções, hero, nav e footer; H2 `32px`; o H1 (fluido via `clamp(40px, 7.5vw, 84px)`) perde as quebras de linha fixas.
- **≤ 480px:** nav mostra só o logo GDG + Ingressos + menu.
- O wrapper `.page` usa `overflow-x: clip` (não `hidden`) para recortar os blobs sem quebrar a nav `position: sticky`.

## Assets
Na pasta `assets/` deste bundle (mover para `public/assets/`). Todos PNG com **fundo transparente**, texto branco + mark GDG colorido — feitos para fundo escuro:
- `gdg-jp-logo-white.png` — lockup "Google Developer Groups / João Pessoa" (nav + footer).
- `devfest-brackets-w3.png` — logo `{ DevFest }` (nav).
- `devfest-2026-w3.png` — logo "DevFest 2026" com mark + pill 2026 (hero).
- `gdg-jp-clean.png` — lockup GDG JP em alta (banner, canto).
- `devfest-clean.png` — wordmark "DevFest" em alta com mark (banner, centro).
Placeholders a substituir por assets reais: fotos dos palestrantes, logos dos patrocinadores. Ícones de local/barra são emoji (📅📍🚗) — trocar por biblioteca de ícones (ex.: lucide-react) se preferir.

## Files (referências neste bundle)
- `DevFest JP Landing.dc.html` — landing completa.
- `DevFest Banner.dc.html` — banner 1280×575.
- `assets/*.png` — logos.

> Observação de marca: as logos GDG/DevFest são da comunidade **GDG João Pessoa** (organizadora). Manter proporções e áreas de respiro originais; não distorcer nem recolorir o mark.
