'use client';

import { ExternalLink, MoreHorizontal, Pencil, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { alternarItem, excluirItem } from '@/lib/acoes/itens';
import { Confirmar } from './confirmar';

export function AlternarAtivo({ id, ativo, titulo }: { id: number; ativo: boolean; titulo: string }) {
  const router = useRouter();
  const [, iniciar] = useTransition();
  const [otimista, setOtimista] = useOptimistic(ativo);
  return (
    <Switch
      checked={otimista}
      aria-label={`${titulo}: ${otimista ? 'visível no site' : 'oculto'}`}
      onCheckedChange={(v) =>
        iniciar(async () => {
          setOtimista(v);
          const r = await alternarItem(id, { ativo: v });
          if (!r.ok) return void toast.error(r.erro);
          toast.success(v ? 'Item visível no site' : 'Item ocultado do site');
          router.refresh();
        })
      }
    />
  );
}

export function MenuItem({ id, slug, titulo, destaque, ativo }: { id: number; slug: string; titulo: string; destaque: boolean; ativo: boolean }) {
  const router = useRouter();
  const executar = async (acao: () => Promise<{ ok: boolean; erro?: string }>, sucesso: string) => {
    const r = await acao();
    if (!r.ok) return void toast.error(r.erro);
    toast.success(sucesso);
    router.refresh();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-lg" aria-label={`Ações de ${titulo}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem asChild>
          <Link href={`/painel/itens/${id}`}><Pencil /> Editar</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => executar(() => alternarItem(id, { destaque: !destaque }), destaque ? 'Removido dos destaques' : 'Adicionado aos destaques')}>
          <Star /> {destaque ? 'Tirar dos destaques' : 'Destacar na home'}
        </DropdownMenuItem>
        {ativo && (
          <DropdownMenuItem asChild>
            <a href={`/${slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink /> Ver no site</a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <Confirmar
          titulo="Excluir este item?"
          descricao={`"${titulo}" e todas as fotos dele serão apagados. Isso não pode ser desfeito.`}
          onConfirmar={() => executar(() => excluirItem(id), 'Item excluído')}
        >
          <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
            <Trash2 /> Excluir
          </DropdownMenuItem>
        </Confirmar>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
