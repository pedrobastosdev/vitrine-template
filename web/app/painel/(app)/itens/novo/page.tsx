import { ArrowLeft, Shapes } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { CabecalhoPagina, EstadoVazio, SkeletonLista } from '@/components/painel/comum';
import { FormItem } from '@/components/painel/form-item';
import { Button } from '@/components/ui/button';
import { listarCategorias, sugestoesDeAtributos } from '@/lib/painel-dados';

export const metadata: Metadata = { title: 'Novo item' };

async function Conteudo() {
  const [categorias, sugestoes] = await Promise.all([listarCategorias(), sugestoesDeAtributos()]);
  if (!categorias.length) {
    return (
      <EstadoVazio
        icone={Shapes}
        titulo="Crie uma categoria primeiro"
        descricao="Todo item pertence a uma categoria, como Apartamentos ou Guincho leve."
        acao={<Button size="lg" asChild><Link href="/painel/categorias">Criar categoria</Link></Button>}
      />
    );
  }
  return (
    <FormItem
      categorias={categorias}
      sugestoes={sugestoes}
      valores={{ titulo: '', descricao: '', preco: '', categoriaId: categorias[0].id, destaque: false, ativo: true, atributos: sugestoes.slice(0, 3).map((nome) => ({ nome, valor: '' })) }}
    />
  );
}

export default function NovoItem() {
  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link href="/painel/itens"><ArrowLeft /> Voltar</Link>
      </Button>
      <CabecalhoPagina titulo="Novo item" descricao="Preencha os dados. Na próxima etapa você adiciona as fotos." />
      <Suspense fallback={<SkeletonLista linhas={4} />}>
        <Conteudo />
      </Suspense>
    </>
  );
}
