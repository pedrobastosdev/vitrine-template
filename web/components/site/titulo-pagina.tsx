import type { ReactNode } from 'react';

export function TituloPagina({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">{titulo}</h1>
        {children && <div className="mt-3 max-w-2xl text-lg text-muted-foreground sm:mt-4">{children}</div>}
      </div>
    </div>
  );
}
