'use client';

import { Menu } from 'lucide-react';
import { Suspense, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NavLista, NavPainel } from './nav';

export function MenuMovel({ rotuloItens, topo, rodape }: { rotuloItens: string; topo: ReactNode; rodape: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  return (
    <Sheet open={aberto} onOpenChange={setAberto}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" aria-label="Abrir menu" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 flex-col gap-6 p-5">
        <SheetTitle className="sr-only">Menu do painel</SheetTitle>
        <SheetDescription className="sr-only">Navegue pelas seções do painel</SheetDescription>
        {topo}
        <Suspense fallback={<NavLista rotuloItens={rotuloItens} />}>
          <NavPainel rotuloItens={rotuloItens} aoNavegar={() => setAberto(false)} />
        </Suspense>
        <div className="mt-auto">{rodape}</div>
      </SheetContent>
    </Sheet>
  );
}
