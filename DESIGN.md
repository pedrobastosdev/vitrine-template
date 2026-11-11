---
name: Vitrine
description: Site + painel para pequenos negócios; o template é a vitrine, o negócio do cliente é o protagonista.
colors:
  marca: "#1d4ed8"
  marca-contraste: "#ffffff"
  marca-forte: "#1d4ed8"
  marca-suave: "#e8edfb"
  marca-clara: "#93b4ff"
  marca-escura: "#0f1f4d"
  destaque: "#0f172a"
  destaque-contraste: "#ffffff"
  fundo-papel: "oklch(0.985 0.003 95)"
  tinta: "oklch(0.145 0 0)"
  superficie: "oklch(1 0 0)"
  neutro-suave: "oklch(0.97 0 0)"
  texto-apagado: "oklch(0.556 0 0)"
  linha: "oklch(0.922 0 0)"
  rodape-noite: "#0f1115"
  whatsapp: "#25D366"
  whatsapp-tinta: "#05301a"
  perigo: "oklch(0.577 0.245 27.325)"
typography:
  display:
    fontFamily: "var(--font-titulo): Plus Jakarta Sans | Fraunces, Inter, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "var(--font-titulo): Plus Jakarta Sans | Fraunces, Inter, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "var(--font-titulo): Plus Jakarta Sans | Fraunces, Inter, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.375
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-lead:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    letterSpacing: "0.05em"
  chip:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
rounded:
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  3xl: "22px"
  full: "9999px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "32px"
  card: "20px"
  section: "96px"
components:
  button-cta:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.marca-contraste}"
    rounded: "{rounded.full}"
    padding: "16px 28px"
  button-cta-hero-ghost:
    textColor: "{colors.superficie}"
    rounded: "{rounded.full}"
    padding: "16px 28px"
  button-nav-cta:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.marca-contraste}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  button-whatsapp-float:
    backgroundColor: "{colors.whatsapp}"
    textColor: "{colors.whatsapp-tinta}"
    rounded: "{rounded.full}"
    padding: "14px"
  chip-categoria:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    typography: "{typography.chip}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  chip-destaque:
    backgroundColor: "{colors.destaque}"
    textColor: "{colors.destaque-contraste}"
    typography: "{typography.chip}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  card-item:
    backgroundColor: "{colors.superficie}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.card}"
  painel-button:
    backgroundColor: "{colors.marca}"
    textColor: "{colors.marca-contraste}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 10px"
  painel-input:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lg}"
    height: "40px"
    padding: "4px 10px"
---

# Design System: Vitrine

## Overview

**Creative North Star: "A Vitrine Iluminada"**

O template é o vidro e a luz da vitrine; o que fica exposto é sempre do cliente: as fotos dos
itens, o nome e as duas cores do negócio. A estrutura é neutra, quente e bem iluminada (um fundo
de papel levemente aquecido, superfícies brancas, sombras suaves), para que qualquer identidade
pareça bem apresentada sem brigar com ela. Uma imobiliária azul-petróleo com títulos serifados e
um guincho amarelo com títulos sans saem do mesmo código só por configuração.

O site público é acolhedor e confiante: hero de tela quase cheia com foto e gradiente, CTAs em
pílula grandes, cards com foto que sobem levemente no hover, e um caminho para o WhatsApp sempre
à vista. O painel, usado pelo dono no celular, herda a cor da marca mas fala a língua precisa
das ferramentas de trabalho (componentes shadcn, raios menores, densidade maior).

A anti-referência é o **template genérico**: tema pronto de WordPress ou landing feita por IA,
com gradientes roxos, ícones em círculos coloridos, seções idênticas empilhadas e texto vazio.
Se uma tela nova poderia ser de qualquer site, ela ainda não é da Vitrine.

**Key Characteristics:**
- A cor vem do cliente; o sistema só define papéis (`marca`, `destaque`) e calcula as variações.
- Contraste garantido por cálculo (WCAG 4,5:1), nunca por escolha manual.
- Foto real como protagonista: hero, cards 4:3, galeria.
- Pílulas e cantos generosos no site; cantos contidos no painel.
- Profundidade por luz suave (sombra difusa + anel de 1px), nunca por bordas pesadas.

## Colors

Duas cores do cliente viram uma família de papéis calculados; tudo o mais é neutro e quente.
Os valores do frontmatter são os padrões do template (usados quando a API não responde); em
produção, `variaveisDoTema()` em `web/lib/cor.ts` os sobrescreve no `<html>`.

### Primary
- **Cor da Marca** (`marca`): a cor principal do cliente, usada em superfícies, nunca em texto
  pequeno: CTA principal, botão "Fale conosco", bloco de chamada final, ponto do selo do hero.
  Demos: azul-petróleo `#1f4e5f` (imobiliária), amarelo `#facc15` (guincho).
- **Texto sobre a Marca** (`marca-contraste`): branco ou quase-preto (`#050505`), o que der mais
  contraste com a marca. Calculado, nunca escolhido.
- **Marca Forte** (`marca-forte`): a marca escurecida até 4,5:1 sobre branco. É a única forma da
  cor do cliente aparecer como **texto**: links, preços, ícones de atributo, anel de foco.
  O amarelo do guincho vira um mostarda legível aqui.
- **Marca Suave** (`marca-suave`): 90% branco + marca. Fundo de hover na navegação, de ícones de
  atributo e de placeholders de foto.
- **Marca Clara** (`marca-clara`): a marca ajustada para 4,5:1 sobre o rodapé escuro. Títulos do
  rodapé.
- **Marca Escura** (`marca-escura`): marca misturada 55% com quase-preto. Fundo do hero enquanto a
  foto carrega.

### Secondary
- **Cor de Destaque** (`destaque`, `destaque-contraste`, `destaque-forte`): a segunda cor do
  cliente. Selo "Destaque" nos cards e o canal principal na chamada final.
  Demos: dourado `#c8a24a` (imobiliária), grafite `#111827` (guincho).

### Neutral
- **Papel Quente** (`fundo-papel`): fundo de todas as páginas, um off-white levemente aquecido.
- **Superfície** (`superficie`): branco puro de cards, painéis de conteúdo e cabeçalho.
- **Tinta** (`tinta`): texto principal, quase preto neutro.
- **Texto Apagado** (`texto-apagado`): metadados, contadores, legendas.
- **Neutro Suave** (`neutro-suave`) e **Linha** (`linha`): fundos de skeleton e chips do painel;
  divisores e bordas de campo.
- **Noite do Rodapé** (`rodape-noite`): o rodapé é sempre este quase-preto neutro, qualquer que seja
  a marca, para que cores vibrantes não gritem no fim da página.
- **Verde WhatsApp** (`whatsapp`, `whatsapp-tinta`): exclusivo do botão flutuante e das ações
  "Chamar no WhatsApp". É a cor do canal, não do cliente.
- **Perigo** (`perigo`): excluir e erros de validação, sempre em fundo 10% + texto.

### Named Rules
**The Calculated Contrast Rule.** Nenhuma combinação texto/fundo usa a cor do cliente sem passar
por `corDoTexto()` ou `ajustarParaContraste()`. Texto na cor da marca é sempre `marca-forte`,
nunca `marca`.

**The Client Owns The Color Rule.** O template não introduz cores próprias de destaque. Fora de
`marca`/`destaque`, só neutros, o verde do WhatsApp e o vermelho de perigo.

## Typography

**Display Font:** escolhida pelo cliente em `estiloTitulo`: Plus Jakarta Sans (moderno, 600–800)
ou Fraunces (elegante, serifada), via `--font-titulo`.
**Body Font:** Inter (com ui-sans-serif, system-ui).

**Character:** o corpo é sempre a mesma Inter, neutra e legível; o título é a única voz
tipográfica do cliente, e muda o tom da página inteira com uma troca.

### Hierarchy
- **Display** (800, 2.25rem → 4.5rem, 1.05, tracking apertado): só o título do hero e o `h1`
  das páginas. Balanceado (`text-wrap: balance`).
- **Headline** (800, 1.875rem → 2.25rem): títulos de seção (`h2`) e o nome do item.
- **Title** (700, 1.125rem, 1.375): título dos cards e cabeçalhos de bloco no painel.
- **Body** (400, 1rem, 1.5): texto corrido; descrições com `whitespace-pre-line` e no máximo
  ~65ch (`max-w-xl` no hero).
- **Body Lead** (400, 1.125–1.25rem, 1.625): subtítulo do hero e textos de abertura.
- **Label** (600, 0.875rem, 0.05em, MAIÚSCULAS): só nos títulos de coluna do rodapé. Títulos de
  seção não levam rótulo (eyebrow) acima: o título fala sozinho.
- **Chip** (600, 0.75rem): selos de categoria e "Destaque".

### Named Rules
**The One Voice Rule.** Só `h1`–`h3` e preços usam a fonte de título. Botões, navegação,
formulários e textos corridos ficam em Inter.

## Layout

Container central de 1280px (`max-w-7xl`) com gutters de 16 / 24 / 32px (mobile / sm / lg). As
seções da home se separam por 80–96px de respiro vertical; dentro dos blocos, 12–24px.

- **Hero:** altura mínima de 82svh, conteúdo alinhado embaixo no celular e centralizado na
  vertical a partir de `sm`.
- **Grade de itens:** 1 coluna → 2 (md) → 3 (xl). Os destaques são cortados para um múltiplo de 3,
  para não sobrar card órfão.
- **Página do item:** 12 colunas em `lg` (galeria em 7, painel de informações sticky em 5);
  coluna única no celular, com a galeria primeiro.
- **Atributos:** grade de 2 colunas; valores longos (mais de 12 caracteres) ocupam a linha inteira.
- **Painel:** sidebar fixa a partir de `lg`; no celular, cabeçalho de 56px com menu em sheet.
  Barra de salvar fixa no pé dos formulários longos.
- Alvos de toque de pelo menos 44px nos CTAs do site (pílulas de 56px no hero).

## Elevation & Depth

Profundidade por **luz suave**: superfícies brancas sobre o papel quente, com um anel de 1px a 5%
de preto e uma sombra pequena em repouso. O movimento aprofunda a sombra, não a borda.

### Shadow Vocabulary
- **Repouso** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.05)` + `ring 1px rgb(0 0 0 / 0.05)`): cards,
  blocos de conteúdo, mapa.
- **Elevado no hover** (`box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1)`, com `translateY(-4px)`):
  cards de item ao passar o mouse.
- **CTA flutuante** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.25)`): CTAs sobre a foto do hero e
  o botão do WhatsApp.
- **Vidro** (`backdrop-filter: blur(12px)` sobre branco 70–85%): cabeçalho sticky; selos e chips
  sobre fotos usam branco 10–95% com blur.

### Named Rules
**The Soft Light Rule.** Nada de bordas escuras ou sombras duras. Separação é anel de 1px a 5% e
sombra difusa; divisores internos usam `linha`.

## Shapes

Cantos generosos no site, contidos no painel. Raio base de 10px (`--radius`).

- **Pílula** (9999px): todos os CTAs do site, navegação, chips, selos, botão do WhatsApp.
- **Card** (18px): cards de item.
- **Bloco** (22px): seções brancas da home, painel de CTA do item, galeria, mapa, chamada final.
- **Painel** (10px): botões, campos e cards do painel (shadcn).
- Fotos sempre recortadas (`object-cover`) em 4:3 nos cards e 4:3 → 16:10 na galeria.

## Components

### Buttons
- **Shape:** pílula no site (9999px); 10px no painel.
- **CTA principal:** fundo `marca`, texto `marca-contraste`, 16px × 28px, semibold 1rem, sombra de
  CTA. Hover: `brightness(1.1)`.
- **CTA fantasma (sobre foto):** branco 10% + anel branco 40% + blur; hover branco 20%.
- **CTA claro (no bloco de marca):** fundo branco, texto `tinta`.
- **Painel:** shadcn com `primary` = `marca`; altura 32px (40px em formulários), hover 80% de opacidade.
- **Focus:** contorno de 3px em `marca-forte` com 2px de afastamento, em tudo.

### Chips
- **Categoria sobre foto:** branco 95% + blur, texto `tinta`, chip 0.75rem.
- **Destaque:** fundo `destaque`, texto `destaque-contraste`, ícone de brilho.
- **Filtro de categoria (listagem):** pílulas; a ativa usa `marca` / `marca-contraste`.

### Cards / Containers
- **Card de item:** branco, 18px, anel 5% + sombra de repouso; foto 4:3 com zoom de 1.05 no hover
  (700ms); título, até 3 atributos com ícone em `marca-forte`, rodapé com preço (fonte de título,
  `marca-forte`) e "Ver detalhes →". O link do título se estica sobre o card inteiro, e o anel de
  foco envolve o card.
- **Bloco de conteúdo:** branco, 22px, padding 32–48px.
- **Skeletons:** mesmas formas, em `neutro-suave` com pulse.

### Inputs / Fields
- **Style:** borda `linha` de 1px, 10px, fundo transparente; altura 40px nos formulários do painel.
- **Focus:** borda `marca-forte` + anel de 3px a 50%.
- **Error:** borda e anel em `perigo`; mensagem abaixo, ligada por `aria-describedby`.

### Navigation
- **Site:** cabeçalho sticky de 64px em vidro; links em pílula, texto 75% de opacidade, hover com
  fundo `marca-suave` e texto `marca-forte`; CTA do canal principal em pílula de marca ("Fale
  conosco" ou o telefone). No celular, um botão redondo de 44px com o canal principal ao lado do
  menu hambúrguer, e o menu termina com Ligar / WhatsApp.
- **Painel:** sidebar com item ativo em `marca` / `marca-contraste`, 10px; no celular, sheet lateral.

### Botão flutuante do WhatsApp
Pílula verde fixa no canto inferior direito (16px no celular, 24px no desktop), ícone de 28px,
com pulso de 2,5s que se repete só 3 vezes. A mensagem pronta muda conforme a página
(“Vi "X" no site…”). Na página do item, no celular, ele dá lugar à barra de contato.

### Ação principal
O dono escolhe no painel o que lidera o site: `whatsapp`, `ligar` (urgência, ex.: guincho) ou
`catalogo`. Ela define o botão cheio do hero, o botão do cabeçalho no celular, o primeiro card de
`/contato` (cheio, em `marca`) e o botão da página do item, cujo texto é configurável (`ctaItem`:
"Agendar visita", "Chamar guincho"). "ligar" sem telefone cai para o WhatsApp. No hero, urgência
mostra os dois canais; WhatsApp ou catálogo mostram conversa e catálogo lado a lado.

### Barra de contato do item (celular)
Barra fixa no rodapé da tela abaixo de 1024px, em vidro branco: botão cheio com o `ctaItem` e um
botão redondo de 48px com o outro canal. O `body` ganha espaço embaixo para ela não cobrir o
rodapé.

### Fatos do negócio
Até 4 pares rótulo + valor escritos pelo dono, ao lado do texto Sobre: rótulo pequeno em
`texto-apagado`, valor na fonte de título, separados por uma linha fina no topo. Sem ícones em
quadrados coloridos nem numeração. Sem fatos, a lista some.

### Galeria do item
Trilho com scroll-snap (swipe nativo), contador "1 / 3", setas no desktop, miniaturas abaixo e
lightbox em `<dialog>` com zoom. Só a primeira foto carrega no início; as demais entram depois do
`load` ou no primeiro toque.

## Do's and Don'ts

### Do:
- **Do** passar toda cor do cliente por `variaveisDoTema()` e usar os papéis (`marca`,
  `marca-forte`, `destaque`...), nunca o hex direto.
- **Do** usar `marca-forte` para qualquer texto, ícone ou link na cor do cliente sobre fundo claro.
- **Do** manter um caminho para o WhatsApp ou para o contato visível em toda tela pública.
- **Do** usar foto real em proporção fixa (4:3) e `object-cover`; sem foto, placeholder em
  `marca-suave` com ícone.
- **Do** testar cada tela nova com as duas demos (azul-petróleo/serifa e amarelo/sans).
- **Do** usar a animação de entrada `surgir` (0,6s, `cubic-bezier(0.22, 1, 0.36, 1)`) só no hero e
  respeitar `prefers-reduced-motion`.

### Don't:
- **Don't** parecer template genérico: nada de gradientes roxos, ícones em círculos coloridos
  decorativos, seções idênticas empilhadas ou texto de preenchimento.
- **Don't** escrever texto pequeno em `marca` (o amarelo do guincho fica ilegível); use `marca-forte`.
- **Don't** introduzir uma terceira cor de destaque ou paleta própria do template.
- **Don't** usar a fonte de título em botões, navegação ou formulários.
- **Don't** usar bordas escuras ou sombras duras para separar blocos.
- **Don't** colocar a marca "Vitrine" nas telas do cliente; o site é sempre do negócio.
