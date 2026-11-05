'use client';

import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

export function Compartilhar({ titulo }: { titulo: string }) {
  const compartilhar = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: titulo, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success('Link copiado!');
  };
  return (
    <button
      type="button"
      onClick={compartilhar}
      className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-foreground/70 hover:bg-black/5"
    >
      <Share2 className="size-4" aria-hidden /> Compartilhar
    </button>
  );
}
