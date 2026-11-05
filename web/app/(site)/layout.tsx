import { BotaoWhatsAppFlutuante } from '@/components/site/botao-whatsapp-flutuante';
import { Cabecalho } from '@/components/site/cabecalho';
import { Rodape } from '@/components/site/rodape';
import { WhatsAppProvider } from '@/components/site/whatsapp-contexto';
import { negocioOuPadrao } from '@/lib/negocio';

export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const { negocio } = await negocioOuPadrao();
  return (
    <WhatsAppProvider>
      <Cabecalho negocio={negocio} />
      <main id="conteudo" className="min-h-[60vh]">
        {children}
      </main>
      <Rodape negocio={negocio} />
      <BotaoWhatsAppFlutuante numero={negocio.whatsapp} nome={negocio.nome} />
    </WhatsAppProvider>
  );
}
