import Link from 'next/link';
import { acoesContato, canalPrincipal } from '@/lib/contato';
import type { Negocio } from '@/lib/tipos';
import { IconeAcao, LinkAcao } from './acao-contato';
import { Marca } from './marca';
import { MenuCelular } from './menu-celular';

export function Cabecalho({ negocio }: { negocio: Negocio }) {
  const links = [
    { href: '/', rotulo: 'Início' },
    { href: '/itens', rotulo: negocio.rotuloItens },
    { href: '/contato', rotulo: 'Contato' },
  ];
  const canais = acoesContato(negocio, `Olá, ${negocio.nome}! Vim pelo site.`).filter((a) => a.tipo !== 'catalogo');
  const principal = canais.find((c) => c.tipo === canalPrincipal(negocio));

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
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
          {principal && (
            <LinkAcao
              acao={principal}
              iconeClassName="size-4"
              className="ml-2 rounded-full bg-marca px-5 py-2.5 text-sm font-semibold text-marca-contraste shadow-sm transition hover:brightness-110"
            >
              {principal.tipo === 'ligar' ? negocio.telefone : 'Fale conosco'}
            </LinkAcao>
          )}
        </nav>
        <div className="flex items-center gap-1 md:hidden">
          {principal && (
            <a
              href={principal.href}
              {...(principal.externo && { target: '_blank', rel: 'noopener noreferrer' })}
              aria-label={principal.tipo === 'ligar' ? `Ligar para ${negocio.nome}` : `Chamar ${negocio.nome} no WhatsApp`}
              className="grid size-11 place-items-center rounded-full bg-marca text-marca-contraste shadow-sm transition active:scale-95"
            >
              <IconeAcao tipo={principal.tipo} className="size-5" />
            </a>
          )}
          <MenuCelular links={links} canais={canais} />
        </div>
      </div>
    </header>
  );
}
