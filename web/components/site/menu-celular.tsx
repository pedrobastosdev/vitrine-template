'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function MenuCelular({ links }: { links: { href: string; rotulo: string }[] }) {
  const [aberto, setAberto] = useState(false);
  const caminho = usePathname();

  useEffect(() => {
    if (!aberto) return;
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [aberto]);

  return (
    <div className="md:hidden">
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
                  aria-current={caminho === l.href ? 'page' : undefined}
                  className="block rounded-xl px-4 py-3.5 text-base font-medium hover:bg-marca-suave aria-[current=page]:bg-marca-suave aria-[current=page]:text-marca-forte"
                >
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
