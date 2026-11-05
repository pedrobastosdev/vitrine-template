import { ArrowRight, MessageCircle, Search, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { GradeItens } from '@/components/site/card-item';
import { AvisoIndisponivel } from '@/components/site/estados';
import { IconeWhatsApp } from '@/components/site/icones';
import { obterCategorias, obterDestaques } from '@/lib/api-publica';
import { negocioOuPadrao } from '@/lib/negocio';
import { imagemOg } from '@/lib/og';
import { linkWhatsApp } from '@/lib/whatsapp';

export async function generateMetadata(): Promise<Metadata> {
  const { negocio } = await negocioOuPadrao();
  const titulo = negocio.slogan ? `${negocio.nome} | ${negocio.slogan}` : negocio.nome;
  const descricao = negocio.heroSubtitulo || negocio.slogan || negocio.nome;
  const og = imagemOg(negocio.heroImagemUrl);
  return {
    title: { absolute: titulo },
    description: descricao,
    alternates: { canonical: '/' },
    openGraph: { title: titulo, description: descricao, url: '/', images: og ? [{ url: og, width: 1200, height: 630 }] : undefined },
  };
}

const PASSOS = [
  { icone: Search, titulo: 'Encontre o que procura', texto: 'Navegue pelas categorias e veja fotos e detalhes de cada opção.' },
  { icone: MessageCircle, titulo: 'Chame no WhatsApp', texto: 'Um toque e a conversa começa com a mensagem já escrita.' },
  { icone: ShieldCheck, titulo: 'Atendimento de verdade', texto: 'Gente que conhece o assunto responde e acompanha você.' },
];

export default async function Home() {
  const [{ negocio, disponivel }, destaques, categorias] = await Promise.all([
    negocioOuPadrao(),
    obterDestaques(),
    obterCategorias(),
  ]);
  const whats = negocio.whatsapp
    ? linkWhatsApp(negocio.whatsapp, `Olá, ${negocio.nome}! Vim pelo site e gostaria de ajuda.`)
    : null;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[82svh] items-end overflow-hidden bg-marca-escura text-white sm:items-center">
        {negocio.heroImagemUrl && (
          <Image
            src={negocio.heroImagemUrl}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="-z-20 object-cover"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/50 to-black/20 sm:bg-gradient-to-r sm:from-black/80 sm:via-black/45 sm:to-transparent" />
        <div className="mx-auto w-full max-w-7xl px-4 pt-28 pb-14 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            {negocio.slogan && (
              <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium ring-1 ring-white/25 backdrop-blur animate-surgir">
                <span className="size-2 rounded-full bg-marca" aria-hidden />
                {negocio.slogan}
              </p>
            )}
            <h1 className="font-heading text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl lg:text-7xl animate-surgir [animation-delay:80ms]">
              {negocio.heroTitulo || negocio.nome}
            </h1>
            {negocio.heroSubtitulo && (
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl animate-surgir [animation-delay:160ms]">
                {negocio.heroSubtitulo}
              </p>
            )}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row animate-surgir [animation-delay:240ms]">
              <Link
                href="/itens"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-marca px-7 py-4 text-base font-semibold text-marca-contraste shadow-lg shadow-black/25 transition hover:brightness-110"
              >
                Ver {negocio.rotuloItens.toLowerCase()} <ArrowRight className="size-5" aria-hidden />
              </Link>
              {whats && (
                <a
                  href={whats}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-4 text-base font-semibold text-white ring-1 ring-white/40 backdrop-blur transition hover:bg-white/20"
                >
                  <IconeWhatsApp className="size-5" /> Chamar no WhatsApp
                </a>
              )}
            </div>
            {categorias.ok && categorias.dados.length > 0 && (
              <nav aria-label="Categorias" className="mt-10 flex flex-wrap gap-2 animate-surgir [animation-delay:320ms]">
                {categorias.dados.map((c) => (
                  <Link
                    key={c.id}
                    href={`/itens?categoria=${c.slug}`}
                    className="rounded-full bg-black/25 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white hover:text-foreground"
                  >
                    {c.nome}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </section>

      {!disponivel && <AvisoIndisponivel />}

      {/* Destaques */}
      {destaques.ok && destaques.dados.length > 0 && (
        <section aria-labelledby="destaques" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold tracking-wider text-marca-forte uppercase">Selecionados para você</p>
              <h2 id="destaques" className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                Destaques
              </h2>
            </div>
            <Link href="/itens" className="inline-flex items-center gap-1.5 font-semibold text-marca-forte hover:underline">
              Ver todos os {negocio.rotuloItens.toLowerCase()} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <GradeItens
            // Múltiplo de 3 para a grade não terminar com um card sozinho
            itens={destaques.dados.length > 3 ? destaques.dados.slice(0, destaques.dados.length - (destaques.dados.length % 3)) : destaques.dados}
          />
        </section>
      )}

      {/* Categorias */}
      {categorias.ok && categorias.dados.length > 1 && (
        <section aria-labelledby="categorias" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
          <h2 id="categorias" className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Explore por categoria
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.dados.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/itens?categoria=${c.slug}`}
                  className="group flex items-center justify-between rounded-2xl bg-marca-suave p-6 ring-1 ring-marca/10 transition hover:bg-marca hover:text-marca-contraste"
                >
                  <span>
                    <span className="block font-heading text-xl font-bold">{c.nome}</span>
                    <span className="text-sm opacity-75">
                      {c.totalItens} {c.totalItens === 1 ? 'opção' : 'opções'}
                    </span>
                  </span>
                  <span className="grid size-11 place-items-center rounded-full bg-white text-marca-forte shadow-sm transition group-hover:translate-x-1">
                    <ArrowRight className="size-5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Sobre + como funciona */}
      {(negocio.sobreTitulo || negocio.sobreTexto) && (
        <section aria-labelledby="sobre" className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5 sm:p-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold tracking-wider text-marca-forte uppercase">Sobre nós</p>
              <h2 id="sobre" className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                {negocio.sobreTitulo}
              </h2>
              <p className="mt-5 text-lg leading-relaxed whitespace-pre-line text-muted-foreground">{negocio.sobreTexto}</p>
            </div>
            <ol className="space-y-6">
              {PASSOS.map(({ icone: Icone, titulo, texto }, i) => (
                <li key={titulo} className="flex gap-5">
                  <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-marca text-marca-contraste">
                    <Icone className="size-6" aria-hidden />
                    <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-destaque text-xs font-bold text-destaque-contraste">
                      {i + 1}
                    </span>
                  </span>
                  <span>
                    <span className="block font-heading text-lg font-bold">{titulo}</span>
                    <span className="text-muted-foreground">{texto}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Chamada final */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-marca px-8 py-14 text-center text-marca-contraste sm:px-16">
          <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/10" aria-hidden />
          <div className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-black/10" aria-hidden />
          <h2 className="relative font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Vamos conversar?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg opacity-90">
            Conte o que você precisa e a gente responde rapidinho.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {whats && (
              <a href={whats} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-destaque px-7 py-4 font-semibold text-destaque-contraste shadow-lg transition hover:brightness-110">
                <IconeWhatsApp className="size-5" /> Chamar no WhatsApp
              </a>
            )}
            <Link href="/contato" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 font-semibold text-foreground transition hover:bg-white/90">
              Enviar mensagem
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
