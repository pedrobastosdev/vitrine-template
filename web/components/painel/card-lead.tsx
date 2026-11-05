'use client';

import { Check, ExternalLink, Phone, RotateCcw, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { IconeWhatsApp } from '@/components/site/icones';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { excluirLead, marcarLead } from '@/lib/acoes/leads';
import { formatarData } from '@/lib/formato';
import type { Lead } from '@/lib/tipos';
import { cn } from '@/lib/utils';
import { linkWhatsApp } from '@/lib/whatsapp';
import { Confirmar } from './confirmar';

export function CardLead({ lead, whatsapp }: { lead: Lead; whatsapp: string }) {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();

  const executar = (acao: () => Promise<{ ok: boolean; erro?: string }>, sucesso: string) =>
    iniciar(async () => {
      const r = await acao();
      if (!r.ok) return void toast.error(r.erro);
      toast.success(sucesso);
      router.refresh();
    });

  const mensagem = lead.item
    ? `Olá, ${lead.nome}! Vi sua mensagem sobre "${lead.item.titulo}".`
    : `Olá, ${lead.nome}! Recebemos sua mensagem pelo site.`;

  return (
    <li className={cn('rounded-xl bg-background p-4 ring-1 ring-foreground/10 transition sm:p-5', pendente && 'opacity-60', lead.atendido && 'bg-muted/40')}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-heading font-bold">{lead.nome}</p>
          <p className="text-sm text-muted-foreground">
            <time dateTime={lead.criadoEm}>{formatarData(lead.criadoEm)}</time> · {lead.telefone}
          </p>
        </div>
        {lead.atendido ? <Badge variant="secondary"><Check /> Atendido</Badge> : <Badge>Novo</Badge>}
      </div>
      {lead.item && (
        <a href={`/${lead.item.slug}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          {lead.item.titulo} <ExternalLink className="size-3.5" aria-hidden />
        </a>
      )}
      <p className="mt-3 text-sm whitespace-pre-line">{lead.mensagem}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild size="lg" className="bg-[#25D366] text-[#05301a] hover:bg-[#25D366]/85">
          <a href={linkWhatsApp(whatsapp, mensagem)} target="_blank" rel="noopener noreferrer">
            <IconeWhatsApp className="size-4" /> Chamar no WhatsApp
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={`tel:${lead.telefone.replace(/\D/g, '')}`}><Phone /> Ligar</a>
        </Button>
        <Button
          size="lg"
          variant="outline"
          disabled={pendente}
          onClick={() => executar(() => marcarLead(lead.id, !lead.atendido), lead.atendido ? 'Marcado como pendente' : 'Marcado como atendido')}
        >
          {lead.atendido ? <RotateCcw /> : <Check />} {lead.atendido ? 'Reabrir' : 'Marcar atendido'}
        </Button>
        <Confirmar titulo="Excluir este lead?" descricao="O contato some da lista para sempre." onConfirmar={() => executar(() => excluirLead(lead.id), 'Lead excluído')}>
          <Button size="icon-lg" variant="ghost" aria-label={`Excluir lead de ${lead.nome}`} className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive">
            <Trash2 />
          </Button>
        </Confirmar>
      </div>
    </li>
  );
}
