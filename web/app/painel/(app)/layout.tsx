import { ExternalLink, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { MenuMovel } from '@/components/painel/menu-movel';
import { NavLista, NavPainel } from '@/components/painel/nav';
import { Marca } from '@/components/site/marca';
import { sair } from '@/lib/acoes/auth';
import { negocioOuPadrao } from '@/lib/negocio';

export default async function PainelLayout({ children }: LayoutProps<'/painel'>) {
  const { negocio } = await negocioOuPadrao();
  const topo = (
    <div className="space-y-1">
      <Marca negocio={negocio} quebrar />
      <p className="pl-[3.1rem] text-xs text-muted-foreground">Painel de gestão</p>
    </div>
  );
  const rodape = (
    <div className="space-y-1 border-t pt-4">
      <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground">
        <ExternalLink className="size-[18px]" aria-hidden /> Ver site
      </Link>
      <form action={sair}>
        <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70 hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="size-[18px]" aria-hidden /> Sair
        </button>
      </form>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col gap-8 border-r bg-background p-5 lg:flex">
        {topo}
        <Suspense fallback={<NavLista rotuloItens={negocio.rotuloItens} />}>
          <NavPainel rotuloItens={negocio.rotuloItens} />
        </Suspense>
        <div className="mt-auto">{rodape}</div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/90 px-3 backdrop-blur lg:hidden">
          <MenuMovel rotuloItens={negocio.rotuloItens} topo={topo} rodape={rodape} />
          <span className="truncate font-heading font-bold">{negocio.nome}</span>
        </header>
        <main id="conteudo" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
