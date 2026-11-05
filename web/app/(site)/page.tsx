import { negocioOuPadrao } from '@/lib/negocio';

export default async function Home() {
  const { negocio } = await negocioOuPadrao();
  return <h1 className="p-10 text-4xl">{negocio.heroTitulo || negocio.nome}</h1>;
}
