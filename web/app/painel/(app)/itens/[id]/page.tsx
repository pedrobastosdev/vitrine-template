import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CabecalhoPagina, SkeletonLista } from '@/components/painel/comum';
import { FormItem } from '@/components/painel/form-item';
import { GerenciadorFotos } from '@/components/painel/gerenciador-fotos';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { listarCategorias, sugestoesDeAtributos } from '@/lib/painel-dados';
import { ErroApi, api } from '@/lib/sessao';
import type { ItemCompleto } from '@/lib/tipos';

export const metadata: Metadata = { title: 'Editar item' };

async function Conteudo({ params, searchParams }: PageProps<'/painel/itens/[id]'>) {
  const [{ id }, { novo }] = await Promise.all([params, searchParams]);
  if (!/^\d+$/.test(id)) notFound();
  const item = await api<ItemCompleto>(`/itens/${id}`).catch((e) => {
    if (e instanceof ErroApi && e.status === 404) notFound();
    throw e;
  });
  const [categorias, sugestoes] = await Promise.all([listarCategorias(), sugestoesDeAtributos()]);

  return (
    <>
      <CabecalhoPagina
        titulo={item.titulo}
        descricao={item.ativo ? 'Visível no site' : 'Oculto do site'}
        acoes={
          item.ativo && (
            <Button variant="outline" size="lg" asChild>
              <a href={`/${item.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink /> Ver no site</a>
            </Button>
          )
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_26rem]">
        <div className="xl:order-2">
          <Card id="fotos" className={novo ? 'ring-2 ring-primary' : undefined}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-lg">
                Fotos {novo && <Badge>Próximo passo</Badge>}
              </CardTitle>
              <CardDescription>A capa aparece no card e na prévia do WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent>
              <GerenciadorFotos itemId={item.id} iniciais={item.imagens} />
            </CardContent>
          </Card>
        </div>
        <div className="xl:order-1">
          <FormItem
            id={item.id}
            categorias={categorias}
            sugestoes={sugestoes}
            valores={{
              titulo: item.titulo,
              descricao: item.descricao,
              preco: item.preco ? item.preco.replace('.', ',') : '',
              categoriaId: item.categoriaId,
              destaque: item.destaque,
              ativo: item.ativo,
              atributos: item.atributos.map(({ nome, valor }) => ({ nome, valor })),
            }}
          />
        </div>
      </div>
    </>
  );
}

export default function EditarItem(props: PageProps<'/painel/itens/[id]'>) {
  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link href="/painel/itens"><ArrowLeft /> Voltar</Link>
      </Button>
      <Suspense fallback={<SkeletonLista linhas={4} />}>
        <Conteudo {...props} />
      </Suspense>
    </>
  );
}
