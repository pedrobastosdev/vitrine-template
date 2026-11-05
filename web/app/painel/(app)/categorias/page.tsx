import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CabecalhoPagina, SkeletonLista } from '@/components/painel/comum';
import { GerenciarCategorias } from '@/components/painel/gerenciar-categorias';
import { listarCategorias } from '@/lib/painel-dados';

export const metadata: Metadata = { title: 'Categorias' };

async function Conteudo() {
  return <GerenciarCategorias categorias={await listarCategorias()} />;
}

export default function Categorias() {
  return (
    <>
      <CabecalhoPagina titulo="Categorias" descricao="Organizam o catálogo e aparecem como filtros no site." />
      <Suspense fallback={<SkeletonLista linhas={3} />}>
        <Conteudo />
      </Suspense>
    </>
  );
}
