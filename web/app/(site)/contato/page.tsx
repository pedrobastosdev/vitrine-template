import { Mail, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { FormContato } from '@/components/site/form-contato';
import { IconeAcao } from '@/components/site/acao-contato';
import { Mapa } from '@/components/site/mapa';
import { TituloPagina } from '@/components/site/titulo-pagina';
import { MensagemWhatsApp } from '@/components/site/whatsapp-contexto';
import { obterItem } from '@/lib/api-publica';
import { canalPrincipal, linkTelefone } from '@/lib/contato';
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
  return <FormContato key={item?.id ?? 'geral'} item={item} whatsapp={negocio.whatsapp} rotuloItem={negocio.rotuloItem} />;
}

type Contato = { chave: string; icone: React.ReactNode; rotulo: string; valor: string; href: string };

export default async function PaginaContato({ searchParams }: PageProps<'/contato'>) {
  const { negocio } = await negocioOuPadrao();
  const canal = canalPrincipal(negocio);
  const whats: Contato | null = negocio.whatsapp
    ? { chave: 'whatsapp', icone: <IconeAcao tipo="whatsapp" className="size-5" />, rotulo: 'WhatsApp', valor: 'Chamar no WhatsApp', href: linkWhatsApp(negocio.whatsapp, `Olá, ${negocio.nome}!`) }
    : null;
  const tel: Contato | null = negocio.telefone
    ? { chave: 'ligar', icone: <IconeAcao tipo="ligar" className="size-5" />, rotulo: 'Telefone', valor: negocio.telefone, href: linkTelefone(negocio.telefone) }
    : null;
  const email: Contato | null = negocio.email
    ? { chave: 'email', icone: <Mail className="size-5" aria-hidden />, rotulo: 'E-mail', valor: negocio.email, href: `mailto:${negocio.email}` }
    : null;
  // O canal que o dono prefere vem primeiro e maior
  const [principal, ...outros] = [...(canal === 'ligar' ? [tel, whats] : [whats, tel]), email].filter(
    (c): c is Contato => !!c,
  );
  const enderecoCompleto = [negocio.endereco, negocio.cidade].filter(Boolean).join(', ');
  const externo = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {});
  const subtitulo =
    canal === 'ligar'
      ? 'Ligue ou chame no WhatsApp. Se preferir, deixe uma mensagem e a gente retorna.'
      : 'Chame no WhatsApp para uma resposta mais rápida, ou deixe uma mensagem.';

  return (
    <>
      {/* Os canais já estão no topo; no celular o botão flutuante cobriria o "Enviar" */}
      <MensagemWhatsApp mensagem={`Olá, ${negocio.nome}!`} barra />
      <TituloPagina titulo="Fale com a gente">{subtitulo}</TituloPagina>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-5 lg:px-8">
        <aside aria-label="Canais de contato" className="space-y-3 lg:col-span-2">
          {principal && (
            <a
              href={principal.href}
              {...externo(principal.href)}
              className="flex items-center gap-4 rounded-2xl bg-marca p-5 text-marca-contraste shadow-md transition hover:brightness-110"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-black/10">{principal.icone}</span>
              <span className="min-w-0">
                <span className="block text-sm opacity-85">{principal.rotulo}</span>
                <span className="block text-lg font-bold break-words">{principal.valor}</span>
              </span>
            </a>
          )}
          {outros.map((c) => (
            <a
              key={c.chave}
              href={c.href}
              {...externo(c.href)}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5 transition hover:ring-marca"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-marca-suave text-marca-forte">{c.icone}</span>
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
        <section aria-labelledby="deixe-mensagem" className="lg:col-span-3">
          <h2 id="deixe-mensagem" className="mb-5 font-heading text-2xl font-bold">
            {principal ? 'Ou deixe uma mensagem' : 'Deixe uma mensagem'}
          </h2>
          <Suspense fallback={<div className="h-[480px] animate-pulse rounded-3xl bg-muted" />}>
            <Formulario searchParams={searchParams} negocio={negocio} />
          </Suspense>
        </section>
      </div>
    </>
  );
}
