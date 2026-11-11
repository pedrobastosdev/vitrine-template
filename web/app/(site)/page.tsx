import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { GradeItens } from '@/components/site/card-item';
import { LinkAcao } from '@/components/site/acao-contato';
import { AvisoIndisponivel } from '@/components/site/estados';
import { obterCategorias, obterDestaques } from '@/lib/api-publica';
import { acoesContato } from '@/lib/contato';
import { negocioOuPadrao } from '@/lib/negocio';
import { imagemOg } from '@/lib/og';

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

export default async function Home() {
  const [{ negocio, disponivel }, destaques, categorias] = await Promise.all([
    negocioOuPadrao(),
    obterDestaques(),
    obterCategorias(),
  ]);
  const acoes = acoesContato(negocio);
  const [primeira] = acoes;
  // Urgência (ligar): os dois canais no topo. WhatsApp ou catálogo: conversa e catálogo lado a lado.
  const segunda =
    primeira.tipo === 'ligar'
      ? acoes[1]
      : acoes.find((a) => a.tipo === (primeira.tipo === 'catalogo' ? 'whatsapp' : 'catalogo')) ?? acoes[1];
  const catalogoNoHero = [primeira, segunda].some((a) => a?.tipo === 'catalogo');
  const canais = acoes.filter((a) => a.tipo !== 'catalogo');
  const temSobre = !!(negocio.sobreTitulo || negocio.sobreTexto);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[82svh] items-end overflow-hidden bg-marca-escura text-white [--foco:#ffffff] sm:items-center">
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
              <LinkAcao
                acao={primeira}
                className="rounded-full bg-marca px-7 py-4 text-base font-semibold text-marca-contraste shadow-lg shadow-black/25 transition hover:brightness-110"
              />
              {segunda && (
                <LinkAcao
                  acao={segunda}
                  className="rounded-full bg-white/10 px-7 py-4 text-base font-semibold text-white ring-1 ring-white/40 backdrop-blur transition hover:bg-white/20"
                />
              )}
            </div>
            {!catalogoNoHero && (
              <Link
                href="/itens"
                className="mt-5 inline-flex items-center gap-1.5 font-semibold text-white/90 underline-offset-4 hover:underline animate-surgir [animation-delay:280ms]"
              >
                Ver {negocio.rotuloItens.toLowerCase()} <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
          </div>
        </div>
      </section>

      {!disponivel && <AvisoIndisponivel />}

      {/* Destaques */}
      {destaques.ok && destaques.dados.length > 0 && (
        <section aria-labelledby="destaques" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 id="destaques" className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
              Em destaque
            </h2>
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
        <section aria-labelledby="categorias" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
          <h2 id="categorias" className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
            Explore por categoria
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
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

      {/* Sobre + fatos do negócio */}
      {(temSobre || negocio.fatos.length > 0) && (
        <section
          aria-labelledby={temSobre ? 'sobre' : undefined}
          aria-label={temSobre ? undefined : `Sobre ${negocio.nome}`}
          className="mx-auto mt-28 max-w-7xl px-4 sm:mt-32 sm:px-6 lg:px-8"
        >
          <div
            className={`grid gap-12 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5 sm:p-12 ${temSobre && negocio.fatos.length ? 'lg:grid-cols-[1.15fr_1fr] lg:gap-16' : ''}`}
          >
            {temSobre && (
              <div>
                {negocio.sobreTitulo && (
                  <h2 id="sobre" className="font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                    {negocio.sobreTitulo}
                  </h2>
                )}
                {negocio.sobreTexto && (
                  <p className="mt-5 max-w-prose text-lg leading-relaxed whitespace-pre-line text-muted-foreground">
                    {negocio.sobreTexto}
                  </p>
                )}
              </div>
            )}
            {negocio.fatos.length > 0 && (
              <dl
                className={`grid content-start gap-x-8 sm:grid-cols-2 ${temSobre ? '' : 'lg:grid-cols-4'}`}
              >
                {negocio.fatos.map((f) => (
                  <div key={f.rotulo + f.valor} className="border-t border-black/10 py-5">
                    <dt className="text-sm font-medium text-muted-foreground">{f.rotulo}</dt>
                    <dd className="mt-1.5 font-heading text-xl leading-snug font-bold text-pretty">{f.valor}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>
      )}

      {/* Chamada final */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-marca px-8 py-14 text-center text-marca-contraste [--foco:var(--marca-contraste)] sm:px-16">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Vamos conversar?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg opacity-90">
            Conte o que você precisa e a gente responde pelo canal que você preferir.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            {canais.map((acao, i) => (
              <LinkAcao
                key={acao.tipo}
                acao={acao}
                className={
                  i === 0
                    ? 'rounded-full bg-destaque px-7 py-4 font-semibold whitespace-nowrap text-destaque-contraste shadow-lg transition hover:brightness-110'
                    : 'rounded-full bg-white px-7 py-4 font-semibold whitespace-nowrap text-foreground transition hover:bg-white/90'
                }
              />
            ))}
            <Link
              href="/contato"
              className="inline-flex items-center justify-center rounded-full px-7 py-4 font-semibold whitespace-nowrap underline-offset-4 ring-1 ring-current/30 transition hover:ring-current/60"
            >
              Enviar mensagem
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
