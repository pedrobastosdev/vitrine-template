'use client';

import { ChevronLeft, ChevronRight, Expand, Images, X, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Foto {
  id: number;
  url: string;
}

/** Índice da foto visível a partir da rolagem horizontal do trilho. */
function useIndiceVisivel(trilho: React.RefObject<HTMLDivElement | null>) {
  const [indice, setIndice] = useState(0);
  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    const aoRolar = () => setIndice(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener('scroll', aoRolar, { passive: true });
    return () => el.removeEventListener('scroll', aoRolar);
  }, [trilho]);
  const irPara = (i: number, suave = true) => {
    const el = trilho.current;
    if (!el) return;
    el.scrollTo({
      left: i * el.clientWidth,
      behavior: suave ? 'smooth' : 'instant',
    });
  };
  return { indice, irPara };
}

function BotaoSeta({
  lado,
  onClick,
  rotulo,
  claro,
}: {
  lado: 'esq' | 'dir';
  onClick: () => void;
  rotulo: string;
  claro?: boolean;
}) {
  const Icone = lado === 'esq' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      className={cn(
        'absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full shadow-md transition hover:scale-105',
        lado === 'esq' ? 'left-3' : 'right-3',
        claro ? 'bg-white/15 text-white ring-1 ring-white/30 backdrop-blur' : 'bg-white/90 text-foreground',
      )}
    >
      <Icone className="size-6" aria-hidden />
    </button>
  );
}

export function Galeria({ fotos, titulo }: { fotos: Foto[]; titulo: string }) {
  const trilho = useRef<HTMLDivElement>(null);
  const trilhoTela = useRef<HTMLDivElement>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const { indice, irPara } = useIndiceVisivel(trilho);
  const tela = useIndiceVisivel(trilhoTela);
  const [zoom, setZoom] = useState(false);
  // Só a primeira foto entra no carregamento inicial; as outras vêm depois, sem disputar banda com ela.
  const [todas, setTodas] = useState(false);
  useEffect(() => {
    const liberar = () => setTodas(true);
    const depoisDoLoad = () => window.setTimeout(liberar, 1500);
    if (document.readyState === 'complete') depoisDoLoad();
    else window.addEventListener('load', depoisDoLoad, { once: true });
    return () => window.removeEventListener('load', depoisDoLoad);
  }, []);

  const abrir = (i: number) => {
    dialogo.current?.showModal();
    setZoom(false);
    requestAnimationFrame(() => tela.irPara(i, false));
  };
  const fechar = () => {
    irPara(tela.indice, false);
    dialogo.current?.close();
  };

  if (!fotos.length) {
    return (
      <div className="grid aspect-[4/3] place-items-center rounded-3xl bg-marca-suave text-marca-forte/60">
        <Images className="size-12" aria-hidden />
        <span className="sr-only">Sem fotos</span>
      </div>
    );
  }

  const total = fotos.length;
  const alt = (i: number) => `${titulo} — foto ${i + 1} de ${total}`;

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-3xl bg-muted"
        aria-roledescription="carrossel"
        aria-label={`Fotos de ${titulo}`}
      >
        <div
          ref={trilho}
          onPointerEnter={() => setTodas(true)}
          onTouchStart={() => setTodas(true)}
          onFocus={() => setTodas(true)}
          className="sem-barra flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto overscroll-x-contain sm:aspect-[16/10]"
        >
          {fotos.map((f, i) => (
            <button
              key={f.id}
              type="button"
              onClick={() => abrir(i)}
              className="relative h-full w-full shrink-0 snap-center cursor-zoom-in"
              aria-label={`Ampliar ${alt(i)}`}
            >
              {(i === 0 || todas) && (
                <Image
                  src={f.url}
                  alt={alt(i)}
                  fill
                  priority={i === 0}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  quality={i === 0 ? 50 : undefined}
                  sizes="(min-width: 1024px) 60vw, calc(100vw - 32px)"
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
        {total > 1 && (
          <>
            <div className="hidden sm:block">
              {indice > 0 && <BotaoSeta lado="esq" rotulo="Foto anterior" onClick={() => irPara(indice - 1)} />}
              {indice < total - 1 && <BotaoSeta lado="dir" rotulo="Próxima foto" onClick={() => irPara(indice + 1)} />}
            </div>
            <span
              className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white"
              aria-live="polite"
            >
              {indice + 1} / {total}
            </span>
          </>
        )}
        <button
          type="button"
          onClick={() => abrir(indice)}
          className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold shadow"
        >
          <Expand className="size-3.5" aria-hidden /> Ampliar
        </button>
      </div>

      {total > 1 && (
        <ul className="sem-barra mt-3 flex gap-2 overflow-x-auto">
          {fotos.map((f, i) => (
            <li key={f.id} className="shrink-0">
              <button
                type="button"
                onClick={() => irPara(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === indice}
                className={cn(
                  'relative block h-16 w-24 overflow-hidden rounded-xl bg-muted ring-2 transition sm:h-20 sm:w-28',
                  i === indice ? 'ring-marca' : 'opacity-70 ring-transparent hover:opacity-100',
                )}
              >
                {todas && <Image src={f.url} alt="" fill sizes="112px" className="object-cover" />}
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogo}
        onClose={() => setZoom(false)}
        aria-label={`Fotos de ${titulo} em tela cheia`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-black p-0 text-white backdrop:bg-black"
      >
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
            {tela.indice + 1} / {total}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setZoom((z) => !z)}
              aria-label={zoom ? 'Diminuir' : 'Ampliar foto'}
              className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20"
            >
              {zoom ? <ZoomOut className="size-5" aria-hidden /> : <ZoomIn className="size-5" aria-hidden />}
            </button>
            <button
              type="button"
              onClick={fechar}
              aria-label="Fechar"
              className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <X className="size-6" aria-hidden />
            </button>
          </div>
        </div>
        <div
          ref={trilhoTela}
          className={cn('sem-barra flex h-full snap-x snap-mandatory', zoom ? 'overflow-hidden' : 'overflow-x-auto')}
        >
          {fotos.map((f, i) => (
            <div
              key={f.id}
              className={cn(
                'relative h-full w-full shrink-0 snap-center',
                zoom && i === tela.indice && 'overflow-auto',
              )}
            >
              <div
                className={cn(
                  'relative h-full w-full transition-[width,height]',
                  zoom && i === tela.indice && 'h-[200%] w-[200%]',
                )}
                onDoubleClick={() => setZoom((z) => !z)}
              >
                <Image src={f.url} alt={alt(i)} fill sizes={zoom ? '200vw' : '100vw'} className="object-contain" />
              </div>
            </div>
          ))}
        </div>
        {total > 1 && !zoom && (
          <>
            {tela.indice > 0 && (
              <BotaoSeta claro lado="esq" rotulo="Foto anterior" onClick={() => tela.irPara(tela.indice - 1)} />
            )}
            {tela.indice < total - 1 && (
              <BotaoSeta claro lado="dir" rotulo="Próxima foto" onClick={() => tela.irPara(tela.indice + 1)} />
            )}
          </>
        )}
      </dialog>
    </div>
  );
}
