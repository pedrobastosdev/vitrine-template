import Link from 'next/link';
import type { Negocio } from '@/lib/tipos';
import { linkWhatsApp } from '@/lib/whatsapp';
import { IconeWhatsApp } from './icones';
import { Marca } from './marca';
import { MenuCelular } from './menu-celular';

export function Cabecalho({ negocio }: { negocio: Negocio }) {
  const links = [
    { href: '/', rotulo: 'Início' },
    { href: '/itens', rotulo: negocio.rotuloItens },
    { href: '/contato', rotulo: 'Contato' },
  ];
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Marca negocio={negocio} />
        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-marca-suave hover:text-marca-forte"
            >
              {l.rotulo}
            </Link>
          ))}
          {negocio.whatsapp && (
            <a
              href={linkWhatsApp(negocio.whatsapp, `Olá, ${negocio.nome}! Vim pelo site.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-marca px-5 py-2.5 text-sm font-semibold text-marca-contraste shadow-sm transition hover:brightness-110"
            >
              <IconeWhatsApp className="size-4" />
              Fale conosco
            </a>
          )}
        </nav>
        <MenuCelular links={links} />
      </div>
    </header>
  );
}
