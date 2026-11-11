'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Acao } from '@/lib/contato';
import { LinkAcao } from './acao-contato';

export function MenuCelular({ links, canais }: { links: { href: string; rotulo: string }[]; canais: Acao[] }) {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [aberto]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        aria-controls="menu-celular"
        aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
        className="grid size-11 place-items-center rounded-full text-foreground hover:bg-black/5"
      >
        {aberto ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>
      {aberto && (
        <nav
          id="menu-celular"
          aria-label="Principal"
          className="absolute inset-x-0 top-16 border-b bg-white px-4 pb-6 shadow-lg animate-in fade-in slide-in-from-top-2"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setAberto(false)}
                  className="block rounded-xl px-4 py-3.5 text-base font-medium hover:bg-marca-suave"
                >
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
          {canais.length > 0 && (
            <div className="mt-4 grid gap-2 border-t border-black/5 pt-4 min-[380px]:grid-cols-2">
              {canais.map((c, i) => (
                <LinkAcao
                  key={c.tipo}
                  acao={c}
                  className={
                    i === 0
                      ? 'min-h-12 rounded-full bg-marca px-4 font-semibold text-marca-contraste'
                      : 'min-h-12 rounded-full px-4 font-semibold ring-1 ring-black/10'
                  }
                >
                  {c.tipo === 'ligar' ? 'Ligar' : 'WhatsApp'}
                </LinkAcao>
              ))}
            </div>
          )}
        </nav>
      )}
    </div>
  );
}
