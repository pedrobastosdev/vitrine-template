'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowDown, ArrowUp, LoaderCircle, Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { atualizarItem, criarItem } from '@/lib/acoes/itens';
import { itemSchema, type ItemForm } from '@/lib/schemas';
import type { Categoria } from '@/lib/tipos';

function Erro({ mensagem, id }: { mensagem?: string; id: string }) {
  return mensagem ? <p id={id} className="text-sm text-destructive">{mensagem}</p> : null;
}

interface Props {
  id?: number;
  valores: ItemForm;
  categorias: Categoria[];
  sugestoes: string[];
}

export function FormItem({ id, valores, categorias, sugestoes }: Props) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ItemForm>({ resolver: zodResolver(itemSchema), defaultValues: valores });
  const { fields, append, remove, move } = useFieldArray({ control, name: 'atributos' });

  const salvar = async (dados: ItemForm) => {
    const r = id ? await atualizarItem(id, dados) : await criarItem(dados);
    if (!r.ok) return void toast.error(r.erro);
    if (!id) {
      toast.success('Item criado! Agora adicione as fotos.');
      router.push(`/painel/itens/${r.dados.id}?novo=1#fotos`);
      return;
    }
    toast.success('Alterações salvas. O site já foi atualizado.');
    reset(dados);
    router.refresh();
  };

  const nomesUsados = new Set(fields.map((f) => f.nome.toLowerCase()));
  const sugestoesLivres = sugestoes.filter((s) => !nomesUsados.has(s.toLowerCase())).slice(0, 8);

  return (
    <form onSubmit={handleSubmit(salvar)} noValidate className="space-y-6 pb-24 lg:pb-0">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Informações</CardTitle>
          <CardDescription>O que aparece no card e no topo da página do item.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" className="h-10" placeholder="Ex.: Apartamento 3 quartos com vista para o mar" aria-invalid={!!errors.titulo} aria-describedby="erro-titulo" {...register('titulo')} />
            <Erro id="erro-titulo" mensagem={errors.titulo?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Controller
              control={control}
              name="categoriaId"
              render={({ field }) => (
                <Select value={field.value ? String(field.value) : ''} onValueChange={(v) => field.onChange(Number(v))}>
                  <SelectTrigger id="categoria" className="h-10 w-full" aria-invalid={!!errors.categoriaId}>
                    <SelectValue placeholder="Escolha..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Erro id="erro-categoria" mensagem={errors.categoriaId?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preco">Preço (R$)</Label>
            <Input id="preco" inputMode="decimal" className="h-10" placeholder="Vazio = Sob consulta" aria-invalid={!!errors.preco} aria-describedby="erro-preco" {...register('preco')} />
            <Erro id="erro-preco" mensagem={errors.preco?.message} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" rows={6} placeholder="Conte os detalhes que fazem a diferença." aria-invalid={!!errors.descricao} {...register('descricao')} />
            <Erro id="erro-descricao" mensagem={errors.descricao?.message} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Atributos</CardTitle>
          <CardDescription>Características em destaque, como &quot;Quartos: 3&quot; ou &quot;Capacidade: 3,5 t&quot;.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {fields.length === 0 && (
            <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              Nenhum atributo ainda. Adicione abaixo.
            </p>
          )}
          {fields.map((f, i) => (
            <div key={f.id} className="flex items-start gap-2 rounded-lg bg-muted/50 p-2 sm:p-3">
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <div>
                  <Label htmlFor={`atr-nome-${i}`} className="sr-only">Nome do atributo {i + 1}</Label>
                  <Input id={`atr-nome-${i}`} placeholder="Nome (ex.: Quartos)" className="h-10 bg-background" aria-invalid={!!errors.atributos?.[i]?.nome} {...register(`atributos.${i}.nome`)} />
                  <Erro id={`erro-atr-nome-${i}`} mensagem={errors.atributos?.[i]?.nome?.message} />
                </div>
                <div>
                  <Label htmlFor={`atr-valor-${i}`} className="sr-only">Valor do atributo {i + 1}</Label>
                  <Input id={`atr-valor-${i}`} placeholder="Valor (ex.: 3)" className="h-10 bg-background" aria-invalid={!!errors.atributos?.[i]?.valor} {...register(`atributos.${i}.valor`)} />
                  <Erro id={`erro-atr-valor-${i}`} mensagem={errors.atributos?.[i]?.valor?.message} />
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row">
                <Button type="button" variant="ghost" size="icon-lg" aria-label="Mover para cima" disabled={i === 0} onClick={() => move(i, i - 1)}>
                  <ArrowUp />
                </Button>
                <Button type="button" variant="ghost" size="icon-lg" aria-label="Mover para baixo" disabled={i === fields.length - 1} onClick={() => move(i, i + 1)}>
                  <ArrowDown />
                </Button>
                <Button type="button" variant="ghost" size="icon-lg" aria-label={`Remover atributo ${i + 1}`} className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => remove(i)}>
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button type="button" variant="outline" size="lg" onClick={() => append({ nome: '', valor: '' })}>
              <Plus /> Adicionar atributo
            </Button>
            {sugestoesLivres.map((s) => (
              <Button key={s} type="button" variant="secondary" size="sm" onClick={() => append({ nome: s, valor: '' })}>
                + {s}
              </Button>
            ))}
          </div>
          {errors.atributos?.message && <p className="text-sm text-destructive">{errors.atributos.message}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Visibilidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {([
            ['ativo', 'Mostrar no site', 'Desligado, o item fica salvo só aqui no painel.'],
            ['destaque', 'Destacar na página inicial', 'Aparece na seção "Destaques" da home.'],
          ] as const).map(([nome, rotulo, ajuda]) => (
            <Controller
              key={nome}
              control={control}
              name={nome}
              render={({ field }) => (
                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4">
                  <span>
                    <span className="block font-medium">{rotulo}</span>
                    <span className="text-sm text-muted-foreground">{ajuda}</span>
                  </span>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </label>
              )}
            />
          ))}
        </CardContent>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/95 p-3 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:p-0">
        <Button type="submit" size="lg" disabled={isSubmitting || (!!id && !isDirty)} className="h-11 w-full text-base lg:w-auto lg:px-8">
          {isSubmitting ? <LoaderCircle className="animate-spin" /> : <Save />}
          {isSubmitting ? 'Salvando...' : id ? 'Salvar alterações' : 'Criar item'}
        </Button>
      </div>
    </form>
  );
}
