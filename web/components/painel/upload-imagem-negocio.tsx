'use client';

import { ImagePlus, LoaderCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { enviarImagemNegocio, removerImagemNegocio } from '@/lib/acoes/negocio';
import { comprimirImagem, validarOriginal } from '@/lib/comprimir-imagem';
import { cn } from '@/lib/utils';

export function UploadImagemNegocio({ campo, url, rotulo, ajuda }: { campo: 'logo' | 'hero'; url: string | null; rotulo: string; ajuda: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [atual, setAtual] = useState(url);
  const [enviando, setEnviando] = useState(false);

  const enviar = async (arquivo: File) => {
    const problema = validarOriginal(arquivo);
    if (problema) return void toast.error(problema);
    setEnviando(true);
    try {
      const dados = new FormData();
      dados.append('arquivo', await comprimirImagem(arquivo));
      const r = await enviarImagemNegocio(campo, dados);
      if (!r.ok) return void toast.error(r.erro);
      setAtual(campo === 'logo' ? r.dados.logoUrl : r.dados.heroImagemUrl);
      toast.success(`${rotulo} atualizado`);
      router.refresh();
    } finally {
      setEnviando(false);
    }
  };

  const remover = async () => {
    const r = await removerImagemNegocio(campo);
    if (!r.ok) return void toast.error(r.erro);
    setAtual(null);
    toast.success(`${rotulo} removido`);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-4">
      <div className={cn('relative shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10', campo === 'logo' ? 'size-20' : 'aspect-video w-36')}>
        {atual ? (
          <Image src={atual} alt={rotulo} fill sizes="144px" className={campo === 'logo' ? 'object-contain p-1' : 'object-cover'} />
        ) : (
          <ImagePlus className="absolute inset-0 m-auto size-6 text-muted-foreground" aria-hidden />
        )}
        {enviando && (
          <span className="absolute inset-0 grid place-items-center bg-background/70">
            <LoaderCircle className="size-5 animate-spin" aria-hidden />
          </span>
        )}
      </div>
      <div className="space-y-2">
        <p className="font-medium">{rotulo}</p>
        <p className="text-xs text-muted-foreground">{ajuda}</p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" disabled={enviando} onClick={() => input.current?.click()}>
            {atual ? 'Trocar' : 'Enviar'}
          </Button>
          {atual && (
            <Button type="button" variant="ghost" size="icon" aria-label={`Remover ${rotulo}`} onClick={remover}>
              <Trash2 />
            </Button>
          )}
        </div>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-label={`Escolher ${rotulo}`}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void enviar(f);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
