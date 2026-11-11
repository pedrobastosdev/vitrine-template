import Image from 'next/image';
import Link from 'next/link';
import type { Negocio } from '@/lib/tipos';

export function Marca({ negocio, claro = false, quebrar = false }: { negocio: Negocio; claro?: boolean; quebrar?: boolean }) {
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
      <span
        className={`${quebrar ? 'line-clamp-2 text-base' : 'max-sm:line-clamp-2 max-sm:text-base sm:truncate sm:text-lg'} font-heading leading-tight font-bold ${claro ? 'text-white' : 'text-foreground'}`}
      >
        {negocio.nome}
      </span>
    </Link>
  );
}
