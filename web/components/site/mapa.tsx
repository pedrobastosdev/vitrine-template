'use client';

import { MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/** O iframe do mapa (pesado) só é criado quando o bloco aparece na tela. */
export function Mapa({ endereco }: { endereco: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const q = encodeURIComponent(endereco);
  return (
    <div ref={ref} className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-marca-suave ring-1 ring-black/5 sm:aspect-[16/9]">
      {visivel ? (
        <iframe
          title={`Mapa: ${endereco}`}
          src={`https://maps.google.com/maps?q=${q}&z=15&hl=pt-BR&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="grid h-full place-items-center text-marca-forte">
          <MapPin className="size-10" aria-hidden />
        </div>
      )}
    </div>
  );
}
