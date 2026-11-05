import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { FormLogin } from '@/components/painel/form-login';
import { negocioOuPadrao } from '@/lib/negocio';

export const metadata: Metadata = { title: 'Entrar' };

async function Formulario({ searchParams }: { searchParams: PageProps<'/painel/login'>['searchParams'] }) {
  const { de, expirou } = await searchParams;
  return <FormLogin destino={typeof de === 'string' ? de : undefined} expirou={expirou === '1'} />;
}

export default async function Login({ searchParams }: PageProps<'/painel/login'>) {
  const { negocio } = await negocioOuPadrao();
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-marca-escura p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-marca/40 blur-3xl" aria-hidden />
        <div className="absolute -bottom-40 -left-20 size-96 rounded-full bg-destaque/30 blur-3xl" aria-hidden />
        <p className="relative font-heading text-xl font-bold">{negocio.nome}</p>
        <div className="relative">
          <h2 className="font-heading text-4xl leading-tight font-extrabold">Seu site, do seu jeito.</h2>
          <p className="mt-4 max-w-md text-lg text-white/80">
            Cadastre {negocio.rotuloItens.toLowerCase()}, troque fotos e responda contatos. Tudo aparece no site na hora.
          </p>
        </div>
        <p className="relative text-sm text-white/60">Painel de gestão</p>
      </div>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden /> Voltar ao site
          </Link>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Entrar no painel</h1>
          <p className="mt-2 mb-8 text-muted-foreground">Use o e-mail e a senha de administrador.</p>
          <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
            <Formulario searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
