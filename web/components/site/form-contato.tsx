'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck, LoaderCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { API_URL } from '@/lib/config';
import { mascararTelefone } from '@/lib/formato';
import { leadSchema, type LeadForm } from '@/lib/schemas';
import { linkWhatsApp } from '@/lib/whatsapp';
import { IconeWhatsApp } from './icones';

const campo =
  'w-full rounded-xl border-0 bg-white px-4 py-3.5 text-base text-foreground ring-1 ring-black/10 transition placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-marca-forte focus:outline-none aria-[invalid=true]:ring-destructive';

interface Props {
  item?: { id: number; titulo: string };
  whatsapp: string;
  /** Nome de um item no singular ("imóvel", "serviço"). */
  rotuloItem: string;
}

export function FormContato({ item, whatsapp, rotuloItem }: Props) {
  const [enviado, setEnviado] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nome: '',
      telefone: '',
      mensagem: item ? `Olá! Tenho interesse em "${item.titulo}". Pode me passar mais informações?` : '',
      itemId: item?.id,
      site: '',
    },
  });

  // Vai direto do navegador para a API: o limite por IP vale para quem visita, não para o servidor
  const enviar = async (dados: LeadForm) => {
    try {
      const r = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (r.status === 429) {
        toast.error('Muitas mensagens em pouco tempo. Tente de novo em alguns minutos ou chame no WhatsApp.');
        return;
      }
      if (!r.ok) throw new Error(String(r.status));
      setEnviado(true);
      reset();
      toast.success('Mensagem enviada! Logo entraremos em contato.');
    } catch {
      toast.error('Não conseguimos enviar agora. Tente de novo ou fale pelo WhatsApp.');
    }
  };

  const aviso = item
    ? `Olá! Acabei de enviar uma mensagem pelo site sobre "${item.titulo}".`
    : 'Olá! Acabei de enviar uma mensagem pelo site.';

  if (enviado) {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5" role="status">
        <CircleCheck className="size-14 text-marca-forte" aria-hidden />
        <h2 className="mt-4 font-heading text-2xl font-bold">Mensagem recebida!</h2>
        <p className="mt-2 text-muted-foreground">Responderemos pelo telefone informado o quanto antes.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {whatsapp && (
            <a href={linkWhatsApp(whatsapp, aviso)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-marca px-6 py-3 font-semibold text-marca-contraste">
              <IconeWhatsApp className="size-5" /> Adiantar pelo WhatsApp
            </a>
          )}
          <button type="button" onClick={() => setEnviado(false)} className="rounded-full px-6 py-3 font-semibold ring-1 ring-black/10">
            Enviar outra
          </button>
        </div>
      </div>
    );
  }

  const erro = (nome: keyof LeadForm) =>
    errors[nome] && (
      <p id={`erro-${nome}`} className="mt-1.5 text-sm font-medium text-destructive">
        {errors[nome]?.message}
      </p>
    );

  const telefone = register('telefone');

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-5 rounded-3xl bg-white/60 p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
      {item && (
        <p className="rounded-xl bg-marca-suave px-4 py-3 text-sm">
          <span className="first-letter:uppercase inline-block">{rotuloItem}</span>: <strong>{item.titulo}</strong>
        </p>
      )}
      <div>
        <label htmlFor="nome" className="mb-1.5 block text-sm font-semibold">Seu nome</label>
        <input id="nome" autoComplete="name" className={campo} aria-invalid={!!errors.nome} aria-describedby={errors.nome ? 'erro-nome' : undefined} {...register('nome')} />
        {erro('nome')}
      </div>
      <div>
        <label htmlFor="telefone" className="mb-1.5 block text-sm font-semibold">Telefone ou WhatsApp</label>
        <input
          id="telefone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(00) 00000-0000"
          className={campo}
          aria-invalid={!!errors.telefone}
          aria-describedby={errors.telefone ? 'erro-telefone' : 'ajuda-telefone'}
          {...telefone}
          onChange={(e) => {
            setValue('telefone', mascararTelefone(e.target.value));
            void telefone.onChange(e);
          }}
        />
        {errors.telefone ? (
          erro('telefone')
        ) : (
          <p id="ajuda-telefone" className="mt-1.5 text-sm text-muted-foreground">
            Usado só para responder a sua mensagem.
          </p>
        )}
      </div>
      <div>
        <label htmlFor="mensagem" className="mb-1.5 block text-sm font-semibold">Mensagem</label>
        <textarea id="mensagem" rows={5} className={campo} aria-invalid={!!errors.mensagem} aria-describedby={errors.mensagem ? 'erro-mensagem' : undefined} {...register('mensagem')} />
        {erro('mensagem')}
      </div>
      {/* Humanos não veem este campo; robôs costumam preencher */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label htmlFor="site">Site</label>
        <input id="site" tabIndex={-1} autoComplete="off" {...register('site')} />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-marca px-6 py-4 text-base font-semibold text-marca-contraste shadow-md transition hover:brightness-110 disabled:opacity-70"
      >
        {isSubmitting ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : <Send className="size-5" aria-hidden />}
        {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
      </button>
    </form>
  );
}
