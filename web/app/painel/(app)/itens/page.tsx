import { Images, Package, Plus, Search, Star } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { AlternarAtivo, MenuItem } from '@/components/painel/acoes-item';
import { CabecalhoPagina, EstadoVazio, SkeletonLista } from '@/components/painel/comum';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatarPreco } from '@/lib/formato';
import { negocioOuPadrao } from '@/lib/negocio';
import { listarItensPainel } from '@/lib/painel-dados';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Itens' };

const STATUS = [
  { valor: '', rotulo: 'Todos' },
  { valor: 'ativos', rotulo: 'No site' },
  { valor: 'inativos', rotulo: 'Ocultos' },
];

async function Lista({ searchParams }: { searchParams: PageProps<'/painel/itens'>['searchParams'] }) {
  const p = await searchParams;
  const busca = typeof p.busca === 'string' ? p.busca : '';
  const status = typeof p.status === 'string' ? p.status : '';
  const pagina = Math.max(1, Number(p.pagina) || 1);

  const q = new URLSearchParams({ pagina: String(pagina), porPagina: '20' });
  if (busca) q.set('busca', busca);
  if (status) q.set('ativo', String(status === 'ativos'));
  const r = await listarItensPainel(q);
  const href = (extra: Record<string, string>) => {
    const u = new URLSearchParams({ ...(busca && { busca }), ...(status && { status }), ...extra });
    return `/painel/itens${u.size ? `?${u}` : ''}`;
  };

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form className="relative flex-1" role="search">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input name="busca" defaultValue={busca} placeholder="Buscar pelo título..." aria-label="Buscar itens" className="h-10 bg-background pl-9" />
          {status && <input type="hidden" name="status" value={status} />}
        </form>
        <div className="flex gap-1 rounded-lg bg-background p-1 ring-1 ring-foreground/10" role="group" aria-label="Filtrar por status">
          {STATUS.map((s) => (
            <Link
              key={s.valor}
              href={`/painel/itens?${new URLSearchParams({ ...(busca && { busca }), ...(s.valor && { status: s.valor }) })}`}
              aria-current={status === s.valor ? 'true' : undefined}
              className={cn('rounded-md px-3 py-1.5 text-sm font-medium', status === s.valor ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              {s.rotulo}
            </Link>
          ))}
        </div>
      </div>

      {r.itens.length === 0 ? (
        busca || status ? (
          <EstadoVazio icone={Search} titulo="Nada encontrado" descricao="Tente outra busca ou limpe os filtros." acao={<Button variant="outline" asChild><Link href="/painel/itens">Limpar filtros</Link></Button>} />
        ) : (
          <EstadoVazio
            icone={Package}
            titulo="Seu catálogo está vazio"
            descricao="Cadastre o primeiro item com fotos e detalhes. Ele aparece no site assim que você salvar."
            acao={<Button size="lg" asChild><Link href="/painel/itens/novo"><Plus /> Cadastrar primeiro item</Link></Button>}
          />
        )
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl bg-background ring-1 ring-foreground/10">
          {r.itens.map((item) => (
            <li key={item.id} className="flex items-center gap-3 p-3 sm:gap-4 sm:px-4">
              <Link href={`/painel/itens/${item.id}`} className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-16">
                {item.capa ? (
                  <Image src={item.capa} alt="" fill sizes="64px" className="object-cover" />
                ) : (
                  <Images className="absolute inset-0 m-auto size-5 text-muted-foreground" aria-hidden />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/painel/itens/${item.id}`} className="line-clamp-2 font-medium hover:underline">
                  {item.titulo}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span>{item.categoria.nome}</span>
                  <span className="hidden sm:inline">{formatarPreco(item.preco)}</span>
                  <span className="hidden sm:inline">{item.totalImagens} foto{item.totalImagens === 1 ? '' : 's'}</span>
                  {item.destaque && (
                    <Badge variant="secondary" className="gap-1"><Star className="size-3" aria-hidden /> Destaque</Badge>
                  )}
                  {!item.ativo && <Badge variant="outline">Oculto</Badge>}
                </div>
              </div>
              <AlternarAtivo id={item.id} ativo={item.ativo} titulo={item.titulo} />
              <MenuItem id={item.id} slug={item.slug} titulo={item.titulo} destaque={item.destaque} ativo={item.ativo} />
            </li>
          ))}
        </ul>
      )}

      {r.totalPaginas > 1 && (
        <nav aria-label="Paginação" className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{r.total} itens · página {pagina} de {r.totalPaginas}</span>
          <div className="flex gap-2">
            {pagina > 1 && <Button variant="outline" asChild><Link href={href({ pagina: String(pagina - 1) })}>Anterior</Link></Button>}
            {pagina < r.totalPaginas && <Button variant="outline" asChild><Link href={href({ pagina: String(pagina + 1) })}>Próxima</Link></Button>}
          </div>
        </nav>
      )}
    </>
  );
}

export default async function ItensPainel({ searchParams }: PageProps<'/painel/itens'>) {
  const { negocio } = await negocioOuPadrao();
  return (
    <>
      <CabecalhoPagina
        titulo={negocio.rotuloItens}
        descricao="Use a chave para mostrar ou esconder do site."
        acoes={<Button size="lg" asChild><Link href="/painel/itens/novo"><Plus /> Novo item</Link></Button>}
      />
      <Suspense fallback={<SkeletonLista />}>
        <Lista searchParams={searchParams} />
      </Suspense>
    </>
  );
}
