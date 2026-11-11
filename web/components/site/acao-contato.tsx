import { ArrowRight, Phone } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Acao } from '@/lib/contato';
import type { AcaoPrincipal } from '@/lib/tipos';
import { cn } from '@/lib/utils';
import { IconeWhatsApp } from './icones';

export function IconeAcao({ tipo, className }: { tipo: AcaoPrincipal; className?: string }) {
  if (tipo === 'whatsapp') return <IconeWhatsApp className={className} />;
  if (tipo === 'ligar') return <Phone className={className} aria-hidden />;
  return <ArrowRight className={className} aria-hidden />;
}

/** Link de uma ação de contato. O catálogo leva a seta no fim; os canais, o ícone no começo. */
export function LinkAcao({
  acao,
  className,
  children,
  iconeClassName = 'size-5',
}: {
  acao: Acao;
  className?: string;
  children?: ReactNode;
  iconeClassName?: string;
}) {
  const icone = <IconeAcao tipo={acao.tipo} className={iconeClassName} />;
  const conteudo = (
    <>
      {acao.tipo !== 'catalogo' && icone}
      {children ?? acao.rotulo}
      {acao.tipo === 'catalogo' && icone}
    </>
  );
  const classes = cn('inline-flex items-center justify-center gap-2', className);
  if (acao.tipo === 'catalogo')
    return (
      <Link href={acao.href} className={classes}>
        {conteudo}
      </Link>
    );
  return (
    <a href={acao.href} className={classes} {...(acao.externo && { target: '_blank', rel: 'noopener noreferrer' })}>
      {conteudo}
    </a>
  );
}
