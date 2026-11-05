'use client';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ImagePlus, LoaderCircle, Star, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { definirCapa, enviarImagem, ordenarImagens, removerImagem } from '@/lib/acoes/itens';
import { comprimirImagem, validarOriginal } from '@/lib/comprimir-imagem';
import type { Imagem } from '@/lib/tipos';
import { cn } from '@/lib/utils';
import { Confirmar } from './confirmar';

interface Envio {
  chave: string;
  previa: string;
  nome: string;
}

function Foto({
  imagem,
  posicao,
  total,
  onCapa,
  onRemover,
}: {
  imagem: Imagem;
  posicao: number;
  total: number;
  onCapa: () => void;
  onRemover: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: imagem.id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10',
        isDragging && 'z-10 scale-105 shadow-xl ring-2 ring-primary',
        imagem.capa && 'ring-2 ring-primary',
      )}
    >
      <Image src={imagem.url} alt={`Foto ${posicao + 1} de ${total}`} fill sizes="(min-width: 1024px) 220px, 50vw" className="object-cover" />
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Arrastar foto ${posicao + 1}. Use espaço e as setas para mover pelo teclado.`}
        className="absolute top-2 left-2 grid size-9 cursor-grab touch-none place-items-center rounded-lg bg-background/90 shadow active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>
      {imagem.capa && (
        <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow">
          <Star className="size-3 fill-current" aria-hidden /> Capa
        </span>
      )}
      <div className="absolute inset-x-2 bottom-2 flex justify-end gap-1.5">
        {!imagem.capa && (
          <Button type="button" size="icon-sm" variant="secondary" className="shadow" onClick={onCapa} aria-label={`Usar foto ${posicao + 1} como capa`} title="Usar como capa">
            <Star />
          </Button>
        )}
        <Confirmar titulo="Remover esta foto?" descricao="Ela será apagada do site e do Cloudinary." rotulo="Remover" onConfirmar={onRemover}>
          <Button type="button" size="icon-sm" variant="secondary" aria-label={`Remover foto ${posicao + 1}`} className="text-destructive shadow">
            <Trash2 />
          </Button>
        </Confirmar>
      </div>
    </li>
  );
}

export function GerenciadorFotos({ itemId, iniciais }: { itemId: number; iniciais: Imagem[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [imagens, setImagens] = useState(iniciais);
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [arrastandoArquivo, setArrastandoArquivo] = useState(false);

  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const adicionar = async (arquivos: FileList | File[]) => {
    const lista = Array.from(arquivos);
    for (const arquivo of lista) {
      const problema = validarOriginal(arquivo);
      if (problema) {
        toast.error(`${arquivo.name}: ${problema}`);
        continue;
      }
      const envio = { chave: crypto.randomUUID(), previa: URL.createObjectURL(arquivo), nome: arquivo.name };
      setEnvios((e) => [...e, envio]);
      try {
        const comprimido = await comprimirImagem(arquivo);
        const dados = new FormData();
        dados.append('arquivo', comprimido);
        const r = await enviarImagem(itemId, dados);
        if (!r.ok) toast.error(`${arquivo.name}: ${r.erro}`);
        else setImagens((atual) => [...atual.map((i) => (r.dados.capa ? { ...i, capa: false } : i)), r.dados]);
      } catch {
        toast.error(`${arquivo.name}: não foi possível processar a foto.`);
      } finally {
        URL.revokeObjectURL(envio.previa);
        setEnvios((e) => e.filter((x) => x.chave !== envio.chave));
      }
    }
    if (lista.length) {
      toast.success('Fotos enviadas');
      router.refresh();
    }
  };

  const aoSoltar = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const de = imagens.findIndex((i) => i.id === active.id);
    const para = imagens.findIndex((i) => i.id === over.id);
    const anterior = imagens;
    const nova = arrayMove(imagens, de, para);
    setImagens(nova);
    const r = await ordenarImagens(itemId, nova.map((i) => i.id));
    if (!r.ok) {
      setImagens(anterior);
      toast.error(r.erro);
    }
  };

  const capa = async (id: number) => {
    const r = await definirCapa(itemId, id);
    if (!r.ok) return void toast.error(r.erro);
    setImagens(r.dados);
    toast.success('Capa atualizada');
  };

  const remover = async (id: number) => {
    const r = await removerImagem(itemId, id);
    if (!r.ok) return void toast.error(r.erro);
    setImagens(r.dados);
    toast.success('Foto removida');
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setArrastandoArquivo(true);
        }}
        onDragLeave={() => setArrastandoArquivo(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastandoArquivo(false);
          void adicionar(e.dataTransfer.files);
        }}
        className={cn(
          'flex flex-col items-center rounded-xl border-2 border-dashed p-8 text-center transition',
          arrastandoArquivo ? 'border-primary bg-primary/5' : 'border-foreground/15',
        )}
      >
        <ImagePlus className="size-8 text-muted-foreground" aria-hidden />
        <p className="mt-2 font-medium">Arraste fotos aqui ou</p>
        <Button type="button" className="mt-3" size="lg" onClick={() => input.current?.click()}>
          Escolher fotos
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">JPG, PNG ou WebP. Reduzimos para até 1920 px e ~1 MB antes de enviar.</p>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          aria-label="Escolher fotos"
          onChange={(e) => {
            if (e.target.files) void adicionar(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {imagens.length === 0 && envios.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">Nenhuma foto ainda. A primeira enviada vira a capa.</p>
      ) : (
        <DndContext sensors={sensores} collisionDetection={closestCenter} onDragEnd={aoSoltar}>
          <SortableContext items={imagens.map((i) => i.id)} strategy={rectSortingStrategy}>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
              {imagens.map((img, i) => (
                <Foto key={img.id} imagem={img} posicao={i} total={imagens.length} onCapa={() => capa(img.id)} onRemover={() => remover(img.id)} />
              ))}
              {envios.map((e) => (
                <li key={e.chave} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element -- prévia local (blob:) */}
                  <img src={e.previa} alt={`Enviando ${e.nome}`} className="h-full w-full object-cover opacity-50" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium shadow">
                      <LoaderCircle className="size-3.5 animate-spin" aria-hidden /> Enviando...
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
      {imagens.length > 1 && <p className="text-xs text-muted-foreground">Arraste pelo ícone ⠿ para mudar a ordem. No celular, segure e arraste.</p>}
    </div>
  );
}
