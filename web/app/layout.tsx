import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { preconnect } from 'react-dom';
import { Toaster } from '@/components/ui/sonner';
import { SITE_URL } from '@/lib/config';
import { variaveisDoTema } from '@/lib/cor';
import { negocioOuPadrao } from '@/lib/negocio';
import './globals.css';

const corpo = Inter({ subsets: ['latin'], variable: '--font-corpo', display: 'swap' });
const tituloSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-titulo-sans',
  display: 'swap',
  weight: ['600', '700', '800'],
  preload: false,
});
const tituloSerifa = Fraunces({
  subsets: ['latin'],
  variable: '--font-titulo-serifa',
  display: 'swap',
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const { negocio } = await negocioOuPadrao();
  const descricao = negocio.slogan || negocio.heroSubtitulo || negocio.nome;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: negocio.nome, template: `%s | ${negocio.nome}` },
    description: descricao,
    applicationName: negocio.nome,
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: negocio.nome,
      title: negocio.nome,
      description: descricao,
    },
    icons: negocio.logoUrl ? { icon: negocio.logoUrl } : undefined,
  };
}

export async function generateViewport(): Promise<Viewport> {
  const { negocio } = await negocioOuPadrao();
  return { themeColor: negocio.corPrimaria };
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  // Adianta a conexão com os CDNs das fotos (a capa costuma ser o LCP).
  preconnect('https://res.cloudinary.com');
  preconnect('https://images.unsplash.com');
  const { negocio } = await negocioOuPadrao();
  return (
    <html
      lang="pt-BR"
      data-titulo={negocio.estiloTitulo}
      style={variaveisDoTema(negocio)}
      className={`${corpo.variable} ${tituloSans.variable} ${tituloSerifa.variable}`}
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
