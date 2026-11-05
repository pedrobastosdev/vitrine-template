import { Inbox } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { CardLead } from '@/components/painel/card-lead';
import { CabecalhoPagina, EstadoVazio, SkeletonLista } from '@/components/painel/comum';
import { Button } from '@/components/ui/button';
import { listarLeads, whatsDoLead } from '@/lib/painel-dados';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Leads' };

const FILTROS = [
  { valor: 'pendentes', rotulo: 'Pendentes', atendido: 'false' },
  { valor: 'atendidos', rotulo: 'Atendidos', atendido: 'true' },
  { valor: 'todos', rotulo: 'Todos', atendido: '' },
];

async function Lista({ searchParams }: { searchParams: PageProps<'/painel/leads'>['searchParams'] }) {
  const p = await searchParams;
  const filtro = FILTROS.find((f) => f.valor === p.status) ?? FILTROS[0];
  const pagina = Math.max(1, Number(p.pagina) || 1);
  const q = new URLSearchParams({ pagina: String(pagina), porPagina: '20' });
  if (filtro.atendido) q.set('atendido', filtro.atendido);
  const r = await listarLeads(q);

  return (
    <>
      <div className="mb-5 flex w-fit gap-1 rounded-lg bg-background p-1 ring-1 ring-foreground/10" role="group" aria-label="Filtrar leads">
        {FILTROS.map((f) => (
          <Link
            key={f.valor}
            href={`/painel/leads?status=${f.valor}`}
            aria-current={f.valor === filtro.valor ? 'true' : undefined}
            className={cn('rounded-md px-3 py-1.5 text-sm font-medium', f.valor === filtro.valor ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
          >
            {f.rotulo}
            {f.valor === 'pendentes' && r.pendentes > 0 && <span className="ml-1.5 tabular-nums">({r.pendentes})</span>}
          </Link>
        ))}
      </div>
      {r.itens.length === 0 ? (
        <EstadoVazio
          icone={Inbox}
          titulo={filtro.valor === 'pendentes' ? 'Nenhum lead pendente' : 'Nenhum lead por aqui'}
          descricao="Quando alguém enviar o formulário de contato do site, a mensagem aparece aqui."
        />
      ) : (
        <ul className="space-y-3">
          {r.itens.map((lead) => (
            <CardLead key={lead.id} lead={lead} whatsapp={whatsDoLead(lead.telefone)} />
          ))}
        </ul>
      )}
      {r.totalPaginas > 1 && (
        <nav aria-label="Paginação" className="mt-6 flex justify-end gap-2">
          {pagina > 1 && <Button variant="outline" asChild><Link href={`/painel/leads?status=${filtro.valor}&pagina=${pagina - 1}`}>Anterior</Link></Button>}
          {pagina < r.totalPaginas && <Button variant="outline" asChild><Link href={`/painel/leads?status=${filtro.valor}&pagina=${pagina + 1}`}>Próxima</Link></Button>}
        </nav>
      )}
    </>
  );
}

export default function Leads({ searchParams }: PageProps<'/painel/leads'>) {
  return (
    <>
      <CabecalhoPagina titulo="Leads" descricao="Contatos enviados pelo formulário do site." />
      <Suspense fallback={<SkeletonLista linhas={3} />}>
        <Lista searchParams={searchParams} />
      </Suspense>
    </>
  );
}
