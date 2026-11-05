import Link from 'next/link';

export default function NaoEncontrado() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-heading text-7xl font-extrabold text-marca-forte">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold">Página não encontrada</h1>
      <p className="mt-2 text-muted-foreground">
        O endereço pode ter mudado ou o item não está mais disponível.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-marca px-6 py-3 font-semibold text-marca-contraste">
          Voltar ao início
        </Link>
        <Link href="/itens" className="rounded-full px-6 py-3 font-semibold ring-1 ring-black/10">
          Ver catálogo
        </Link>
      </div>
    </div>
  );
}
