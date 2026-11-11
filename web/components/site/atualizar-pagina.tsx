'use client';

import { RotateCw } from 'lucide-react';

export function AtualizarPagina({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.location.reload()} className={className}>
      <RotateCw className="size-4" aria-hidden /> Atualizar página
    </button>
  );
}
