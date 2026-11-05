/**
 * Slugs que colidem com rotas do site Next. Como a página do item fica em
 * /[slug], um item chamado "Contato" não pode virar /contato.
 */
export const SLUGS_RESERVADOS = new Set([
  'painel',
  'contato',
  'itens',
  'api',
  'sitemap.xml',
  'sitemap',
  'robots.txt',
  'robots',
  'favicon.ico',
  'icon',
  'apple-icon',
  'opengraph-image',
  'twitter-image',
  'manifest.webmanifest',
  'manifest',
  '_next',
  'login',
  'docs',
  'sobre',
  'busca',
  'categorias',
  'imagens',
  'leads',
  'negocio',
  'saude',
]);

const TAMANHO_MAXIMO = 80;

export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, TAMANHO_MAXIMO)
    .replace(/-+$/g, '');
}

/**
 * Gera um slug sem acento e único. Se já existir (ou for reservado),
 * acrescenta -2, -3... até achar um livre.
 */
export async function gerarSlugUnico(
  texto: string,
  existe: (slug: string) => Promise<boolean>,
  padrao = 'item',
): Promise<string> {
  const base = slugify(texto) || padrao;
  let candidato = base;
  for (
    let n = 2;
    SLUGS_RESERVADOS.has(candidato) || (await existe(candidato));
    n++
  ) {
    const sufixo = `-${n}`;
    candidato = `${base.slice(0, TAMANHO_MAXIMO - sufixo.length)}${sufixo}`;
  }
  return candidato;
}
