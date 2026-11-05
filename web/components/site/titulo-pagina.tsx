import type { ReactNode } from 'react';

export function TituloPagina({ sobre, titulo, children }: { sobre?: string; titulo: string; children?: ReactNode }) {
  return (
    <div className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {sobre && <p className="text-sm font-semibold tracking-wider text-marca-forte uppercase">{sobre}</p>}
        <h1 className="mt-2 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">{titulo}</h1>
        {children && <div className="mt-4 max-w-2xl text-lg text-muted-foreground">{children}</div>}
      </div>
    </div>
  );
}
