import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { GradeItens, GradeSkeleton } from '@/components/site/card-item';
import { AvisoIndisponivel, NenhumItem } from '@/components/site/estados';
import { TituloPagina } from '@/components/site/titulo-pagina';
import { obterCategorias, obterItens } from '@/lib/api-publica';
import { negocioOuPadrao } from '@/lib/negocio';
import type { Negocio } from '@/lib/tipos';
import { cn } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const { negocio } = await negocioOuPadrao();
  const descricao = `Veja todos os ${negocio.rotuloItens.toLowerCase()} de ${negocio.nome}, com fotos, detalhes e contato direto.`;
  return {
    title: negocio.rotuloItens,
    description: descricao,
    alternates: { canonical: '/itens' },
    openGraph: { title: `${negocio.rotuloItens} | ${negocio.nome}`, description: descricao, url: '/itens' },
  };
}

const texto = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

function hrefFiltro(categoria?: string, pagina?: number) {
  const q = new URLSearchParams();
  if (categoria) q.set('categoria', categoria);
  if (pagina && pagina > 1) q.set('pagina', String(pagina));
  const s = q.toString();
  return s ? `/itens?${s}` : '/itens';
}

async function Listagem({ searchParams, negocio }: { searchParams: PageProps<'/itens'>['searchParams']; negocio: Negocio }) {
  const rotulo = negocio.rotuloItens;
  const params = await searchParams;
  const categoria = texto(params.categoria);
  const pagina = Math.max(1, Number(texto(params.pagina)) || 1);
  const [categorias, itens] = await Promise.all([obterCategorias(), obterItens({ categoria, pagina })]);

  if (!itens.ok) return <AvisoIndisponivel negocio={negocio} />;
  const { totalPaginas, total } = itens.dados;

  return (
    <>
      {categorias.ok && categorias.dados.length > 0 && (
        <nav aria-label="Filtrar por categoria" className="sem-barra -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 max-sm:[mask-image:linear-gradient(to_right,black_85%,transparent)] sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ id: 0, nome: 'Todos', slug: undefined as string | undefined }, ...categorias.dados].map((c) => {
            const ativa = c.slug === categoria;
            return (
              <Link
                key={c.id}
                href={hrefFiltro(c.slug)}
                aria-current={ativa ? 'page' : undefined}
                className={cn(
                  'shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 transition',
                  ativa
                    ? 'bg-marca text-marca-contraste ring-marca'
                    : 'bg-white text-foreground/80 ring-black/10 hover:ring-marca hover:text-marca-forte',
                )}
              >
                {c.nome}
              </Link>
            );
          })}
        </nav>
      )}

      <h2 className="sr-only">Resultados</h2>
      <p className="mt-6 mb-6 text-sm text-muted-foreground" aria-live="polite">
        {total} {total === 1 ? 'resultado' : 'resultados'}
      </p>

      {itens.dados.itens.length === 0 ? (
        <NenhumItem
          rotulo={rotulo}
          filtro={
            categoria
              ? { slug: categoria, nome: categorias.ok ? categorias.dados.find((c) => c.slug === categoria)?.nome : undefined }
              : undefined
          }
        />
      ) : (
        <GradeItens itens={itens.dados.itens} prioridade={3} />
      )}

      {totalPaginas > 1 && (
        <nav aria-label="Paginação" className="mt-12 flex items-center justify-center gap-2">
          {pagina > 1 && (
            <Link href={hrefFiltro(categoria, pagina - 1)} className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-black/10 hover:ring-marca">
              <ChevronLeft className="size-4" aria-hidden /> Anterior
            </Link>
          )}
          <span className="px-3 text-sm text-muted-foreground">
            Página {pagina} de {totalPaginas}
          </span>
          {pagina < totalPaginas && (
            <Link href={hrefFiltro(categoria, pagina + 1)} className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-black/10 hover:ring-marca">
              Próxima <ChevronRight className="size-4" aria-hidden />
            </Link>
          )}
        </nav>
      )}
    </>
  );
}

function ListagemSkeleton() {
  return (
    <>
      <div className="flex gap-2" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-28 animate-pulse rounded-full bg-muted" />
        ))}
      </div>
      <div className="mt-6 mb-6 h-5 w-24 animate-pulse rounded bg-muted" />
      <GradeSkeleton />
    </>
  );
}

export default async function PaginaItens({ searchParams }: PageProps<'/itens'>) {
  const { negocio } = await negocioOuPadrao();
  return (
    <>
      <TituloPagina titulo={negocio.rotuloItens}>
        Veja fotos e detalhes e fale direto com a gente.
      </TituloPagina>
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10 lg:px-8">
        <Suspense fallback={<ListagemSkeleton />}>
          <Listagem searchParams={searchParams} negocio={negocio} />
        </Suspense>
      </div>
    </>
  );
}
