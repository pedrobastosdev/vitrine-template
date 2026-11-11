# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Dono do pequeno negócio (usuário do painel):** pouco técnico, edita pelo celular entre um
  atendimento e outro. O trabalho dele é manter itens, fotos, preços e textos atualizados sem
  depender de ninguém, e responder aos leads pelo WhatsApp.
- **Visitante do site (cliente final do negócio):** chega pelo Google ou por um link no WhatsApp,
  quase sempre no celular. O trabalho dele é achar o item certo (imóvel, serviço...) e falar
  com o negócio.
- **Pedro (quem vende e implanta):** monta uma cópia por cliente e cuida de hospedagem e manutenção.

## Product Purpose

Template de site + painel para pequenos negócios que mostram "itens" e recebem contatos
(imobiliária, guincho, loja, etc.). O site público é rápido e bem posicionado no Google, e leva
o visitante ao contato (WhatsApp ou formulário que vira lead). O painel deixa o dono atualizar
tudo sozinho.
Sucesso = o negócio recebe contatos pelo site e o dono usa o painel sem pedir ajuda.
Objetivo principal das decisões: vender o template para donos de negócio reais
(setup + mensalidade). As duas demos são material de venda.

## Positioning

Um site com painel próprio, entregue em um dia por cliente: o mesmo código vira imobiliária ou
guincho só por configuração (cores, nome, logo, rótulo do catálogo, estilo de título) e seed.
Cada cliente tem banco e deploy separados, e a mudança feita no painel aparece no site na hora.

## Operating Context

- O painel é usado majoritariamente no celular, com pressa e de forma intermitente.
- O contato acontece no WhatsApp (botão flutuante, "Tenho interesse", link direto do lead).
- Os visitantes chegam por busca no Google e por links compartilhados no WhatsApp
  (pré-visualização via Open Graph).
- Duas demos públicas: Morada Clara Imóveis (Florianópolis) e Reboque Ágil 24h (Curitiba),
  com login de demonstração admin@demo.com / demo1234.

## Capabilities and Constraints

- **Site:**
  - home com destaques, listagem com filtro por categoria, página do item com galeria e
    atributos, contato com formulário e mapa;
  - SEO completo e Lighthouse mobile ≥ 90.
- **Painel:**
  - itens com atributos livres e várias fotos (capa, ordem por arrastar), categorias e leads
    com filtro por atendido;
  - configuração do negócio (cores, textos, logo, imagem da home).
- **Termos do produto:**
  - "item" é o termo genérico; cada negócio define o rótulo do catálogo ("Imóveis", "Serviços");
  - "lead" é um contato recebido pelo formulário.
- **Restrições técnicas:**
  - a identidade de cada cliente vem só da configuração; nada é específico de um nicho no código;
  - o texto sobre as cores do cliente precisa continuar legível com qualquer cor escolhida;
  - limite de ~4,5 MB por requisição na Vercel (fotos comprimidas no navegador);
  - a API no plano gratuito hiberna.
- **Fora do MVP (não projetar como se existisse):** e-mail de lead, blog, relatório de visitas,
  multi-cliente num sistema só.

## Brand Commitments

- Vitrine é o nome do template, não uma marca exibida no site do cliente: o site é sempre do
  negócio do cliente.
- Interface e textos em português do Brasil, com linguagem simples para quem não é técnico.

## Evidence on Hand

- Duas demos fictícias no ar:
  - https://vitrine-imobiliaria.vercel.app
  - https://vitrine-guincho-psi.vercel.app
- Fotos do Unsplash, com créditos no README.
- Notas do Lighthouse e GIF do painel em `docs/`.
- **Ausências:** não há clientes reais, depoimentos, números de resultado nem logos de clientes.
  Nada disso pode ser inventado no site, nas demos ou no material de venda.

## Product Principles

1. **O dono consegue sozinho, pelo celular.** Toda tarefa do painel cabe numa tela de celular,
   com uma mão e com pressa.
2. **Todo caminho leva ao contato.** No site, o WhatsApp e o formulário estão sempre a um toque.
3. **O cliente é a marca.** O template recua; nome, cores e fotos do negócio aparecem.
4. **Rápido e encontrável.** Performance e SEO são parte do que se vende, não um extra.
5. **Só provas reais.** Demos são declaradamente fictícias; nenhuma prova social inventada.

## Accessibility & Inclusion

WCAG 2.1 AA: contraste garantido para qualquer cor escolhida pelo cliente, foco visível,
navegação por teclado, textos alternativos nas fotos e respeito a `prefers-reduced-motion`.
Público inclui pessoas pouco familiarizadas com tecnologia.
