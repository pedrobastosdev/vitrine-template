import { ChevronRight, MessageSquare } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GradeItens } from '@/components/site/card-item';
import { Compartilhar } from '@/components/site/compartilhar';
import { AvisoIndisponivel } from '@/components/site/estados';
import { Galeria } from '@/components/site/galeria';
import { IconeAtributo } from '@/components/site/icone-atributo';
import { IconeAcao, LinkAcao } from '@/components/site/acao-contato';
import { MensagemWhatsApp } from '@/components/site/whatsapp-contexto';
import { obterItem, obterItens, obterSlugs } from '@/lib/api-publica';
import { SITE_URL } from '@/lib/config';
import { acoesContato, canalPrincipal } from '@/lib/contato';
import { formatarPreco, resumir } from '@/lib/formato';
import { negocioOuPadrao } from '@/lib/negocio';
import { imagemOg } from '@/lib/og';
import type { ItemCompleto } from '@/lib/tipos';
import { mensagemInteresse } from '@/lib/whatsapp';

// Sem itens (ou com a API fora do ar no build), prerenderiza só este marcador,
// que responde "não encontrado". Cache Components exige ao menos um parâmetro.
const SEM_ITENS = '__sem-itens';

export async function generateStaticParams() {
  const r = await obterSlugs();
  const slugs = r.ok ? r.dados.map(({ slug }) => ({ slug })) : [];
  return slugs.length ? slugs : [{ slug: SEM_ITENS }];
}

const capaDe = (item: ItemCompleto) => (item.imagens.find((i) => i.capa) ?? item.imagens[0])?.url;

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const r = await obterItem(slug);
  if (!r.ok && r.status === 'nao-encontrado') notFound();
  if (!r.ok) return { title: 'Indisponível', robots: { index: false } };
  const item = r.dados;
  const descricao = resumir(
    [item.atributos.map((a) => `${a.nome}: ${a.valor}`).join(' · '), item.descricao].filter(Boolean).join('. '),
  );
  const og = imagemOg(capaDe(item));
  return {
    title: item.titulo,
    description: descricao,
    alternates: { canonical: `/${item.slug}` },
    openGraph: {
      type: 'website',
      title: item.titulo,
      description: descricao,
      url: `/${item.slug}`,
      images: og ? [{ url: og, width: 1200, height: 630, alt: item.titulo }] : undefined,
    },
    twitter: { card: 'summary_large_image', title: item.titulo, description: descricao, images: og ? [og] : undefined },
  };
}

async function Relacionados({ item }: { item: ItemCompleto }) {
  const r = await obterItens({ categoria: item.categoria.slug });
  const outros = r.ok ? r.dados.itens.filter((i) => i.id !== item.id).slice(0, 3) : [];
  if (!outros.length) return null;
  return (
    <section aria-labelledby="relacionados" className="mt-20">
      <h2 id="relacionados" className="mb-8 font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
        Mais em {item.categoria.nome}
      </h2>
      <GradeItens itens={outros} />
    </section>
  );
}

async function Detalhe({ params }: { params: PageProps<'/[slug]'>['params'] }) {
  const { slug } = await params;
  const [r, { negocio }] = await Promise.all([obterItem(slug), negocioOuPadrao()]);
  if (!r.ok && r.status === 'nao-encontrado') notFound();
  if (!r.ok) return <AvisoIndisponivel />;

  const item = r.dados;
  const mensagem = mensagemInteresse(item.titulo);
  // Canais de conversa na ordem do dono; o primeiro leva o texto do botão do item
  const [principal, outro] = acoesContato(negocio, mensagem).filter((a) => a.tipo !== 'catalogo');
  const tipoPrincipal = canalPrincipal(negocio);
  const fotos = item.imagens.map(({ id, url }) => ({ id, url }));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.titulo,
    description: resumir(item.descricao, 300),
    image: item.imagens.map((i) => i.url),
    category: item.categoria.nome,
    url: `${SITE_URL}/${item.slug}`,
    brand: { '@type': 'Brand', name: negocio.nome },
    additionalProperty: item.atributos.map((a) => ({ '@type': 'PropertyValue', name: a.nome, value: a.valor })),
    ...(item.preco && { offers: { '@type': 'Offer', price: item.preco, priceCurrency: 'BRL', availability: 'https://schema.org/InStock' } }),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <MensagemWhatsApp mensagem={mensagem} barra={!!principal} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <nav aria-label="Você está em" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-marca-forte">Início</Link></li>
          <li aria-hidden><ChevronRight className="size-3.5" /></li>
          <li><Link href="/itens" className="hover:text-marca-forte">{negocio.rotuloItens}</Link></li>
          <li aria-hidden><ChevronRight className="size-3.5" /></li>
          <li><Link href={`/itens?categoria=${item.categoria.slug}`} className="hover:text-marca-forte">{item.categoria.nome}</Link></li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Galeria fotos={fotos} titulo={item.titulo} />
          {item.descricao && (
            <section aria-labelledby="descricao" className="mt-10 hidden lg:block">
              <h2 id="descricao" className="font-heading text-2xl font-bold">Descrição</h2>
              <p className="mt-4 text-lg leading-relaxed whitespace-pre-line text-foreground/80">{item.descricao}</p>
            </section>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <span className="inline-block rounded-full bg-marca-suave px-3 py-1 text-xs font-semibold text-marca-forte">
              {item.categoria.nome}
            </span>
            <h1 className="mt-3 font-heading text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">{item.titulo}</h1>
            <p className="mt-4 font-heading text-3xl font-extrabold text-marca-forte">{formatarPreco(item.preco)}</p>

            {item.atributos.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-3">
                {item.atributos.map((a) => (
                  <div
                    key={a.id ?? a.nome}
                    className={`relative min-h-18 rounded-2xl bg-white py-4 pr-3 pl-14 ring-1 ring-black/5 sm:pr-4 sm:pl-17 ${a.valor.length > 8 ? 'col-span-2' : ''}`}
                  >
                    <dt className="text-xs font-medium text-muted-foreground">
                      <span aria-hidden className="absolute top-4 left-3 grid size-8 place-items-center rounded-lg bg-marca-suave text-marca-forte sm:left-4 sm:size-10 sm:rounded-xl">
                        <IconeAtributo nome={a.nome} className="size-5" />
                      </span>
                      {a.nome}
                    </dt>
                    <dd className="font-semibold break-words text-foreground">{a.valor}</dd>
                  </div>
                ))}
              </dl>
            )}

                {item.descricao && (
              <section aria-labelledby="descricao-m" className="mt-10 lg:hidden">
                <h2 id="descricao-m" className="font-heading text-2xl font-bold">Descrição</h2>
                <p className="mt-4 text-lg leading-relaxed whitespace-pre-line text-foreground/80">{item.descricao}</p>
              </section>
            )}

            <div className="mt-8 flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              {principal && (
                <LinkAcao
                  acao={principal}
                  // No celular a barra fixa já faz este papel
                  className="rounded-full bg-marca px-6 py-4 text-base font-semibold text-marca-contraste shadow-md transition hover:brightness-110 max-lg:hidden"
                >
                  {negocio.ctaItem}
                </LinkAcao>
              )}
              <div className={outro ? 'grid grid-cols-2 gap-3' : 'grid'}>
                {outro && (
                  <LinkAcao
                    acao={outro}
                    iconeClassName="size-4"
                    className="rounded-full px-4 py-3.5 font-semibold ring-1 ring-black/10 transition hover:text-marca-forte hover:ring-marca"
                  >
                    {outro.tipo === 'ligar' ? 'Ligar' : 'WhatsApp'}
                  </LinkAcao>
                )}
                <Link
                  href={`/contato?item=${item.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3.5 font-semibold ring-1 ring-black/10 transition hover:text-marca-forte hover:ring-marca"
                >
                  <MessageSquare className="size-4" aria-hidden /> Mensagem
                </Link>
              </div>
              <Compartilhar titulo={item.titulo} />
            </div>
          </div>
        </div>

      </div>

      <Relacionados item={item} />

      {/* Celular: o contato fica sempre ao alcance do polegar */}
      {principal && tipoPrincipal && (
        <div
          data-barra-contato
          className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
        >
          <div className="mx-auto flex max-w-xl gap-2">
            <LinkAcao
              acao={principal}
              className="min-h-12 flex-1 rounded-full bg-marca px-5 text-base font-semibold text-marca-contraste shadow-md"
            >
              <span className="truncate">{negocio.ctaItem}</span>
            </LinkAcao>
            {outro && (
              <a
                href={outro.href}
                {...(outro.externo && { target: '_blank', rel: 'noopener noreferrer' })}
                aria-label={outro.tipo === 'ligar' ? `Ligar para ${negocio.nome}` : `Chamar ${negocio.nome} no WhatsApp`}
                className="grid size-12 shrink-0 place-items-center rounded-full ring-1 ring-black/10"
              >
                <IconeAcao tipo={outro.tipo} className="size-5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaginaItem({ params }: PageProps<'/[slug]'>) {
  return <Detalhe params={params} />;
}
