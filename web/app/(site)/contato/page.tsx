import { Mail, MapPin, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { FormContato } from '@/components/site/form-contato';
import { IconeWhatsApp } from '@/components/site/icones';
import { Mapa } from '@/components/site/mapa';
import { TituloPagina } from '@/components/site/titulo-pagina';
import { obterItem } from '@/lib/api-publica';
import { negocioOuPadrao } from '@/lib/negocio';
import type { Negocio } from '@/lib/tipos';
import { linkWhatsApp } from '@/lib/whatsapp';

export async function generateMetadata(): Promise<Metadata> {
  const { negocio } = await negocioOuPadrao();
  const descricao = `Fale com ${negocio.nome} pelo WhatsApp, telefone ou formulário.${negocio.cidade ? ` Atendimento em ${negocio.cidade}.` : ''}`;
  return {
    title: 'Contato',
    description: descricao,
    alternates: { canonical: '/contato' },
    openGraph: { title: `Contato | ${negocio.nome}`, description: descricao, url: '/contato' },
  };
}

async function Formulario({ searchParams, negocio }: { searchParams: PageProps<'/contato'>['searchParams']; negocio: Negocio }) {
  const { item: slug } = await searchParams;
  const r = typeof slug === 'string' && slug ? await obterItem(slug) : null;
  const item = r?.ok ? { id: r.dados.id, titulo: r.dados.titulo } : undefined;
  return <FormContato key={item?.id ?? 'geral'} item={item} whatsapp={negocio.whatsapp} />;
}

export default async function PaginaContato({ searchParams }: PageProps<'/contato'>) {
  const { negocio } = await negocioOuPadrao();
  const contatos = [
    negocio.whatsapp && { icone: <IconeWhatsApp className="size-5" />, rotulo: 'WhatsApp', valor: 'Resposta mais rápida', href: linkWhatsApp(negocio.whatsapp, `Olá, ${negocio.nome}!`) },
    negocio.telefone && { icone: <Phone className="size-5" aria-hidden />, rotulo: 'Telefone', valor: negocio.telefone, href: `tel:${negocio.telefone.replace(/\D/g, '')}` },
    negocio.email && { icone: <Mail className="size-5" aria-hidden />, rotulo: 'E-mail', valor: negocio.email, href: `mailto:${negocio.email}` },
  ].filter(Boolean) as { icone: React.ReactNode; rotulo: string; valor: string; href: string }[];
  const enderecoCompleto = [negocio.endereco, negocio.cidade].filter(Boolean).join(', ');

  return (
    <>
      <TituloPagina sobre="Contato" titulo="Fale com a gente">
        Mande uma mensagem pelo formulário ou chame direto no WhatsApp.
      </TituloPagina>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-3">
          <Suspense fallback={<div className="h-[480px] animate-pulse rounded-3xl bg-muted" />}>
            <Formulario searchParams={searchParams} negocio={negocio} />
          </Suspense>
        </div>
        <aside className="space-y-4 lg:col-span-2">
          {contatos.map((c) => (
            <a
              key={c.rotulo}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-black/5 transition hover:ring-marca"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-marca text-marca-contraste">{c.icone}</span>
              <span className="min-w-0">
                <span className="block text-sm text-muted-foreground">{c.rotulo}</span>
                <span className="block font-semibold break-words">{c.valor}</span>
              </span>
            </a>
          ))}
          {enderecoCompleto && (
            <div className="space-y-4 rounded-2xl bg-white p-5 ring-1 ring-black/5">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-marca-forte" aria-hidden />
                <span>{enderecoCompleto}</span>
              </p>
              <Mapa endereco={enderecoCompleto} />
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
