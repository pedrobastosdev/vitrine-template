'use client';

import { Inbox, LayoutGrid, Package, Settings, Shapes } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function linksPainel(rotuloItens: string) {
  return [
    { href: '/painel', rotulo: 'Visão geral', icone: LayoutGrid },
    { href: '/painel/itens', rotulo: rotuloItens, icone: Package },
    { href: '/painel/categorias', rotulo: 'Categorias', icone: Shapes },
    { href: '/painel/leads', rotulo: 'Leads', icone: Inbox },
    { href: '/painel/configuracoes', rotulo: 'Configurações', icone: Settings },
  ];
}

export function NavPainel({ rotuloItens, aoNavegar }: { rotuloItens: string; aoNavegar?: () => void }) {
  const caminho = usePathname();
  return <NavLista rotuloItens={rotuloItens} caminho={caminho} aoNavegar={aoNavegar} />;
}

/** Versão sem hook, usada como fallback do Suspense. */
export function NavLista({ rotuloItens, caminho, aoNavegar }: { rotuloItens: string; caminho?: string; aoNavegar?: () => void }) {
  return (
    <nav aria-label="Painel" className="flex flex-col gap-1">
      {linksPainel(rotuloItens).map(({ href, rotulo, icone: Icone }) => {
        const ativo = href === '/painel' ? caminho === href : caminho?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={aoNavegar}
            aria-current={ativo ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              ativo ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70 hover:bg-muted hover:text-foreground',
            )}
          >
            <Icone className="size-[18px]" aria-hidden />
            {rotulo}
          </Link>
        );
      })}
    </nav>
  );
}
