import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function CabecalhoPagina({ titulo, descricao, acoes }: { titulo: string; descricao?: string; acoes?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{titulo}</h1>
        {descricao && <p className="mt-1 text-muted-foreground">{descricao}</p>}
      </div>
      {acoes && <div className="flex flex-wrap gap-2">{acoes}</div>}
    </div>
  );
}

export function EstadoVazio({ icone: Icone, titulo, descricao, acao }: { icone: LucideIcon; titulo: string; descricao: string; acao?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed bg-background px-6 py-16 text-center">
      <div className="relative mb-5">
        <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-primary/10 blur-xl" aria-hidden />
        <div className="grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Icone className="size-8" aria-hidden />
        </div>
      </div>
      <h2 className="font-heading text-lg font-bold">{titulo}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{descricao}</p>
      {acao && <div className="mt-6">{acao}</div>}
    </div>
  );
}

export function SkeletonLista({ linhas = 5 }: { linhas?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Carregando">
      {Array.from({ length: linhas }, (_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border bg-background p-4">
          <Skeleton className="size-14 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonPagina() {
  return (
    <div role="status" aria-label="Carregando">
      <Skeleton className="mb-2 h-8 w-48" />
      <Skeleton className="mb-8 h-4 w-72" />
      <SkeletonLista />
    </div>
  );
}
