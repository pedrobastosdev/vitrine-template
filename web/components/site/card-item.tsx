import { ArrowRight, Images, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatarPreco } from '@/lib/formato';
import type { ItemCard } from '@/lib/tipos';
import { IconeAtributo } from './icone-atributo';

export function CardItem({ item, prioridade = false }: { item: ItemCard; prioridade?: boolean }) {
  const atributos = item.atributos.slice(0, 3);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-marca-suave">
        {item.capa ? (
          <Image
            src={item.capa}
            alt={item.titulo}
            fill
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
            priority={prioridade}
            className="object-cover transition duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-marca-forte/50">
            <Images className="size-10" aria-hidden />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
            {item.categoria.nome}
          </span>
          {item.destaque && (
            <span className="inline-flex items-center gap-1 rounded-full bg-destaque px-3 py-1 text-xs font-semibold text-destaque-contraste shadow-sm">
              <Sparkles className="size-3" aria-hidden /> Destaque
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <h3 className="font-heading text-lg leading-snug font-bold text-foreground">
          <Link href={`/${item.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {item.titulo}
          </Link>
        </h3>
        {atributos.length > 0 && (
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {atributos.map((a) => (
              <li key={a.nome} className="inline-flex items-center gap-1.5">
                <IconeAtributo nome={a.nome} className="size-4 text-marca-forte" />
                <span className="sr-only">{a.nome}:</span>
                {a.valor}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 border-t pt-4">
          <p className="font-heading text-xl font-extrabold text-marca-forte">{formatarPreco(item.preco)}</p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground/70 transition group-hover:translate-x-0.5 group-hover:text-marca-forte">
            Ver detalhes <ArrowRight className="size-4" aria-hidden />
          </span>
        </div>
      </div>
      {/* Anel de foco do link "esticado" para o card inteiro */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-marca-forte ring-offset-2 group-has-[a:focus-visible]:ring-3" />
    </article>
  );
}

export function CardItemSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5" aria-hidden>
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function GradeItens({ itens, prioridade = 0 }: { itens: ItemCard[]; prioridade?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {itens.map((item, i) => (
        <CardItem key={item.id} item={item} prioridade={i < prioridade} />
      ))}
    </div>
  );
}

export function GradeSkeleton({ quantidade = 6 }: { quantidade?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Carregando">
      {Array.from({ length: quantidade }, (_, i) => (
        <CardItemSkeleton key={i} />
      ))}
    </div>
  );
}
