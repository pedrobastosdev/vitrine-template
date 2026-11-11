import { Mail, MapPin, Phone } from 'lucide-react';
import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { obterCategorias } from '@/lib/api-publica';
import type { Negocio } from '@/lib/tipos';
import { linkWhatsApp } from '@/lib/whatsapp';
import { IconeInstagram, IconeWhatsApp } from './icones';
import { Marca } from './marca';

async function anoAtual() {
  'use cache';
  cacheLife('days');
  return new Date().getFullYear();
}

export async function Rodape({ negocio }: { negocio: Negocio }) {
  const [categorias, ano] = await Promise.all([obterCategorias(), anoAtual()]);
  const telefoneWhats = negocio.whatsapp.replace(/^55/, '').replace(/(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');

  return (
    <footer className="mt-24 bg-[#0f1115] text-white [--foco:var(--marca-clara)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4 lg:col-span-1">
          <Marca negocio={negocio} claro />
          {negocio.slogan && <p className="max-w-xs text-sm opacity-80">{negocio.slogan}</p>}
          {negocio.instagram && (
            <a
              href={`https://instagram.com/${negocio.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-sm opacity-80 hover:opacity-100 md:min-h-0"
            >
              <IconeInstagram className="size-4" /> @{negocio.instagram}
            </a>
          )}
        </div>

        <nav aria-label="Rodapé" className="space-y-4">
          <h2 className="font-heading text-sm font-bold tracking-wider text-marca-clara uppercase">Navegação</h2>
          <ul className="text-sm md:space-y-2.5">
            <li><Link className="inline-flex min-h-11 items-center opacity-85 hover:opacity-100 hover:underline md:min-h-0" href="/">Início</Link></li>
            <li><Link className="inline-flex min-h-11 items-center opacity-85 hover:opacity-100 hover:underline md:min-h-0" href="/itens">{negocio.rotuloItens}</Link></li>
            <li><Link className="inline-flex min-h-11 items-center opacity-85 hover:opacity-100 hover:underline md:min-h-0" href="/contato">Contato</Link></li>
          </ul>
        </nav>

        {categorias.ok && categorias.dados.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-heading text-sm font-bold tracking-wider text-marca-clara uppercase">Categorias</h2>
            <ul className="text-sm md:space-y-2.5">
              {categorias.dados.map((c) => (
                <li key={c.id}>
                  <Link className="inline-flex min-h-11 items-center opacity-85 hover:opacity-100 hover:underline md:min-h-0" href={`/itens?categoria=${c.slug}`}>
                    {c.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="font-heading text-sm font-bold tracking-wider text-marca-clara uppercase">Fale com a gente</h2>
          <ul className="text-sm md:space-y-3">
            {negocio.whatsapp && (
              <li>
                <a href={linkWhatsApp(negocio.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2.5 opacity-85 hover:opacity-100 md:min-h-0">
                  <IconeWhatsApp className="size-4 shrink-0" /> {telefoneWhats}
                </a>
              </li>
            )}
            {negocio.telefone && (
              <li>
                <a href={`tel:${negocio.telefone.replace(/\D/g, '')}`} className="flex min-h-11 items-center gap-2.5 opacity-85 hover:opacity-100 md:min-h-0">
                  <Phone className="size-4 shrink-0" aria-hidden /> {negocio.telefone}
                </a>
              </li>
            )}
            {negocio.email && (
              <li>
                <a href={`mailto:${negocio.email}`} className="flex min-h-11 items-center gap-2.5 break-all opacity-85 hover:opacity-100 md:min-h-0">
                  <Mail className="size-4 shrink-0" aria-hidden /> {negocio.email}
                </a>
              </li>
            )}
            {negocio.endereco && (
              <li className="flex items-start gap-2.5 pt-3 opacity-85 md:pt-0">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  {negocio.endereco}
                  {negocio.cidade && <><br />{negocio.cidade}</>}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs opacity-70 sm:px-6 lg:px-8">
          <p>© {ano} {negocio.nome}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
