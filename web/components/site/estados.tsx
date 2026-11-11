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
    <Estado icone={<CloudOff className="size-8" aria-hidden />} titulo="O catálogo não carregou">
      <p>Pode levar até um minuto na primeira visita do dia. Atualize a página em instantes.</p>
    </Estado>
  );
}

const linkEstado = 'font-semibold text-marca-forte underline underline-offset-4';

/**
 * Lista vazia. Distingue o catálogo ainda sem itens, uma categoria sem itens e um
 * endereço de categoria que não existe (link antigo ou digitado errado).
 */
export function NenhumItem({ rotulo, filtro }: { rotulo: string; filtro?: { slug: string; nome?: string } }) {
  const todos = rotulo.toLowerCase();
  if (!filtro)
    return (
      <Estado icone={<SearchX className="size-8" aria-hidden />} titulo={`${rotulo} em breve`}>
        <p>
          O catálogo está sendo preparado. Enquanto isso,{' '}
          <Link href="/contato" className={linkEstado}>fale com a gente</Link>.
        </p>
      </Estado>
    );
  return (
    <Estado
      icone={<SearchX className="size-8" aria-hidden />}
      titulo={filtro.nome ? `Nada em ${filtro.nome} no momento` : 'Categoria não encontrada'}
    >
      <p>
        {filtro.nome ? 'Novidades entram aqui assim que chegarem. ' : 'O link pode estar desatualizado. '}
        <Link href="/itens" className={linkEstado}>Ver todos os {todos}</Link>.
      </p>
    </Estado>
  );
}
