'use client';

import { Check, LoaderCircle, Pencil, Plus, Shapes, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { excluirCategoria, salvarCategoria } from '@/lib/acoes/categorias';
import type { Categoria } from '@/lib/tipos';
import { EstadoVazio } from './comum';
import { Confirmar } from './confirmar';

export function GerenciarCategorias({ categorias }: { categorias: Categoria[] }) {
  const router = useRouter();
  const [nova, setNova] = useState('');
  const [editando, setEditando] = useState<{ id: number; nome: string } | null>(null);
  const [pendente, iniciar] = useTransition();

  const salvar = (id: number | null, nome: string, aoConcluir: () => void) =>
    iniciar(async () => {
      if (nome.trim().length < 2) return void toast.error('O nome precisa de pelo menos 2 letras.');
      const ordem = id ? undefined : categorias.length;
      const r = await salvarCategoria(id, nome, ordem);
      if (!r.ok) return void toast.error(r.erro);
      toast.success(id ? 'Categoria renomeada' : 'Categoria criada');
      aoConcluir();
      router.refresh();
    });

  const excluir = (c: Categoria) =>
    iniciar(async () => {
      const r = await excluirCategoria(c.id);
      if (!r.ok) return void toast.error(r.erro);
      toast.success('Categoria excluída');
      router.refresh();
    });

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          salvar(null, nova, () => setNova(''));
        }}
        className="flex gap-2"
      >
        <Input value={nova} onChange={(e) => setNova(e.target.value)} placeholder="Nova categoria, ex.: Coberturas" aria-label="Nome da nova categoria" className="h-10 bg-background" />
        <Button type="submit" size="lg" className="h-10" disabled={pendente}>
          {pendente ? <LoaderCircle className="animate-spin" /> : <Plus />} Criar
        </Button>
      </form>

      {categorias.length === 0 ? (
        <EstadoVazio icone={Shapes} titulo="Nenhuma categoria" descricao="Categorias organizam o catálogo e viram filtros no site." />
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl bg-background ring-1 ring-foreground/10">
          {categorias.map((c) => (
            <li key={c.id} className="flex items-center gap-3 p-3 sm:px-4">
              {editando?.id === c.id ? (
                <form
                  className="flex flex-1 gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    salvar(c.id, editando.nome, () => setEditando(null));
                  }}
                >
                  <Input autoFocus value={editando.nome} onChange={(e) => setEditando({ id: c.id, nome: e.target.value })} aria-label="Novo nome" className="h-10" />
                  <Button type="submit" size="icon-lg" aria-label="Salvar nome"><Check /></Button>
                  <Button type="button" size="icon-lg" variant="ghost" aria-label="Cancelar" onClick={() => setEditando(null)}><X /></Button>
                </form>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{c.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {c.totalItens} {c.totalItens === 1 ? 'item no site' : 'itens no site'} · /itens?categoria={c.slug}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon-lg" aria-label={`Renomear ${c.nome}`} onClick={() => setEditando({ id: c.id, nome: c.nome })}>
                    <Pencil />
                  </Button>
                  <Confirmar titulo={`Excluir "${c.nome}"?`} descricao="Só é possível excluir categorias sem itens." onConfirmar={() => excluir(c)}>
                    <Button variant="ghost" size="icon-lg" aria-label={`Excluir ${c.nome}`} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 />
                    </Button>
                  </Confirmar>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
