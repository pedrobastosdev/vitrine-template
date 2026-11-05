import { ArrowRight, Eye, EyeOff, Inbox, Package, Plus, Shapes } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { CabecalhoPagina, SkeletonLista } from '@/components/painel/comum';
import { IconeWhatsApp } from '@/components/site/icones';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatarData } from '@/lib/formato';
import { negocioOuPadrao } from '@/lib/negocio';
import { listarCategorias, listarItensPainel, listarLeads, whatsDoLead } from '@/lib/painel-dados';
import { linkWhatsApp } from '@/lib/whatsapp';

export const metadata: Metadata = { title: 'Visão geral' };

const q = (o: Record<string, string>) => new URLSearchParams({ porPagina: '1', ...o });

async function Resumo({ rotulo }: { rotulo: string }) {
  const [ativos, inativos, leads, categorias] = await Promise.all([
    listarItensPainel(q({ ativo: 'true' })),
    listarItensPainel(q({ ativo: 'false' })),
    listarLeads(new URLSearchParams({ atendido: 'false', porPagina: '5' })),
    listarCategorias(),
  ]);
  const cartoes = [
    { rotulo: `${rotulo} no site`, valor: ativos.total, icone: Eye, href: '/painel/itens?status=ativos' },
    { rotulo: 'Ocultos', valor: inativos.total, icone: EyeOff, href: '/painel/itens?status=inativos' },
    { rotulo: 'Leads pendentes', valor: leads.pendentes, icone: Inbox, href: '/painel/leads', destaque: leads.pendentes > 0 },
    { rotulo: 'Categorias', valor: categorias.length, icone: Shapes, href: '/painel/categorias' },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {cartoes.map((c) => (
          <Link key={c.rotulo} href={c.href} className="group rounded-xl focus-visible:outline-none">
            <Card className="h-full transition group-hover:shadow-md group-hover:ring-primary/40 group-focus-visible:ring-2 group-focus-visible:ring-ring">
              <CardContent className="flex flex-col gap-3">
                <span className={`grid size-10 place-items-center rounded-lg ${c.destaque ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground/70'}`}>
                  <c.icone className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="font-heading text-3xl font-bold tabular-nums">{c.valor}</p>
                  <p className="text-sm text-muted-foreground">{c.rotulo}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-lg">Leads aguardando resposta</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/painel/leads">Ver todos <ArrowRight /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {leads.itens.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Tudo em dia! Nenhum lead pendente. 🎉</p>
          ) : (
            <ul className="divide-y">
              {leads.itens.map((l) => (
                <li key={l.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{l.nome}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {l.item ? l.item.titulo : 'Contato geral'} · {formatarData(l.criadoEm)}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={linkWhatsApp(whatsDoLead(l.telefone), `Olá, ${l.nome}! Recebemos sua mensagem pelo site.`)} target="_blank" rel="noopener noreferrer">
                      <IconeWhatsApp className="size-3.5" /> <span className="hidden sm:inline">Responder</span>
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default async function VisaoGeral() {
  const { negocio } = await negocioOuPadrao();
  return (
    <>
      <CabecalhoPagina
        titulo="Olá! 👋"
        descricao={`Resumo de ${negocio.nome}`}
        acoes={
          <>
            <Button size="lg" asChild>
              <Link href="/painel/itens/novo"><Plus /> Novo item</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/painel/itens"><Package /> {negocio.rotuloItens}</Link>
            </Button>
          </>
        }
      />
      <Suspense
        fallback={
          <>
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-background ring-1 ring-foreground/10" />)}
            </div>
            <SkeletonLista linhas={3} />
          </>
        }
      >
        <Resumo rotulo={negocio.rotuloItens} />
      </Suspense>
      <Badge variant="outline" className="mt-8">Dica: tudo o que você salva aqui aparece no site em segundos.</Badge>
    </>
  );
}
