import Image from 'next/image';
import Link from 'next/link';
import type { Negocio } from '@/lib/tipos';

export function Marca({ negocio, claro = false }: { negocio: Negocio; claro?: boolean }) {
  const iniciais = negocio.nome
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
  return (
    <Link href="/" className="flex min-w-0 items-center gap-2.5 rounded-md" aria-label={`${negocio.nome}, página inicial`}>
      {negocio.logoUrl ? (
        <Image src={negocio.logoUrl} alt="" width={40} height={40} className="size-10 rounded-lg object-contain" />
      ) : (
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-marca font-heading text-sm font-extrabold text-marca-contraste">
          {iniciais}
        </span>
      )}
      <span className={`truncate font-heading text-lg leading-tight font-bold ${claro ? 'text-white' : 'text-foreground'}`}>
        {negocio.nome}
      </span>
    </Link>
  );
}
