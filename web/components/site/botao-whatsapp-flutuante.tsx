'use client';

import { linkWhatsApp } from '@/lib/whatsapp';
import { IconeWhatsApp } from './icones';
import { useMensagemWhatsApp } from './whatsapp-contexto';

export function BotaoWhatsAppFlutuante({ numero, nome }: { numero: string; nome: string }) {
  const { mensagem, barra } = useMensagemWhatsApp();
  if (!numero) return null;
  const texto = mensagem ?? `Olá, ${nome}! Vim pelo site e gostaria de mais informações.`;
  return (
    <a
      href={linkWhatsApp(numero, texto)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      className={`group fixed right-4${barra ? ' max-lg:hidden' : ''} bottom-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-[#05301a] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:right-6 sm:bottom-6`}
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s] [animation-iteration-count:3]" />
      <IconeWhatsApp className="size-7" />
      <span className="hidden pr-1 text-sm font-semibold sm:group-hover:inline">WhatsApp</span>
    </a>
  );
}
