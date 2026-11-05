import { CloudOff, SearchX } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

function Estado({ icone, titulo, children }: { icone: ReactNode; titulo: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <div className="mb-5 grid size-16 place-items-center rounded-2xl bg-marca-suave text-marca-forte">{icone}</div>
      <h2 className="font-heading text-xl font-bold">{titulo}</h2>
      <div className="mt-2 text-muted-foreground">{children}</div>
    </div>
  );
}

/** Mostrado quando a API está dormindo ou fora do ar. */
export function AvisoIndisponivel() {
  return (
    <Estado icone={<CloudOff className="size-8" aria-hidden />} titulo="Estamos atualizando o catálogo">
      <p>Não conseguimos carregar as informações agora. Tente de novo em alguns instantes.</p>
    </Estado>
  );
}

export function NenhumItem({ rotulo, comFiltro }: { rotulo: string; comFiltro?: boolean }) {
  return (
    <Estado icone={<SearchX className="size-8" aria-hidden />} titulo={`Nenhum item em ${rotulo.toLowerCase()} por aqui`}>
      <p>
        {comFiltro ? 'Tente outra categoria ou ' : 'Novidades chegam em breve. Enquanto isso, '}
        <Link href={comFiltro ? '/itens' : '/contato'} className="font-semibold text-marca-forte underline underline-offset-4">
          {comFiltro ? 'veja tudo' : 'fale com a gente'}
        </Link>
        .
      </p>
    </Estado>
  );
}
