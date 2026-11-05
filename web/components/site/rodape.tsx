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
    <footer className="mt-24 bg-[#0f1115] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4 lg:col-span-1">
          <Marca negocio={negocio} claro />
          {negocio.slogan && <p className="max-w-xs text-sm opacity-80">{negocio.slogan}</p>}
          {negocio.instagram && (
            <a
              href={`https://instagram.com/${negocio.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100"
            >
              <IconeInstagram className="size-4" /> @{negocio.instagram}
            </a>
          )}
        </div>

        <nav aria-label="Rodapé" className="space-y-4">
          <h2 className="font-heading text-sm font-bold tracking-wider text-marca-clara uppercase">Navegação</h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link className="opacity-85 hover:opacity-100 hover:underline" href="/">Início</Link></li>
            <li><Link className="opacity-85 hover:opacity-100 hover:underline" href="/itens">{negocio.rotuloItens}</Link></li>
            <li><Link className="opacity-85 hover:opacity-100 hover:underline" href="/contato">Contato</Link></li>
          </ul>
        </nav>

        {categorias.ok && categorias.dados.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-heading text-sm font-bold tracking-wider text-marca-clara uppercase">Categorias</h2>
            <ul className="space-y-2.5 text-sm">
              {categorias.dados.map((c) => (
                <li key={c.id}>
                  <Link className="opacity-85 hover:opacity-100 hover:underline" href={`/itens?categoria=${c.slug}`}>
                    {c.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="font-heading text-sm font-bold tracking-wider text-marca-clara uppercase">Fale com a gente</h2>
          <ul className="space-y-3 text-sm">
            {negocio.whatsapp && (
              <li>
                <a href={linkWhatsApp(negocio.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 opacity-85 hover:opacity-100">
                  <IconeWhatsApp className="size-4 shrink-0" /> {telefoneWhats}
                </a>
              </li>
            )}
            {negocio.telefone && (
              <li>
                <a href={`tel:${negocio.telefone.replace(/\D/g, '')}`} className="flex items-center gap-2.5 opacity-85 hover:opacity-100">
                  <Phone className="size-4 shrink-0" aria-hidden /> {negocio.telefone}
                </a>
              </li>
            )}
            {negocio.email && (
              <li>
                <a href={`mailto:${negocio.email}`} className="flex items-center gap-2.5 break-all opacity-85 hover:opacity-100">
                  <Mail className="size-4 shrink-0" aria-hidden /> {negocio.email}
                </a>
              </li>
            )}
            {negocio.endereco && (
              <li className="flex items-start gap-2.5 opacity-85">
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
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs opacity-70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {ano} {negocio.nome}. Todos os direitos reservados.</p>
          <p>Site com painel próprio</p>
        </div>
      </div>
    </footer>
  );
}
