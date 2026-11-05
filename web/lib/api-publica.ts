import { cacheLife, cacheTag } from 'next/cache';
import { API_URL } from './config';
import type { Categoria, ItemCard, ItemCompleto, Negocio, Pagina } from './tipos';

export type Resultado<T> =
  | { ok: true; dados: T }
  | { ok: false; status: 'nao-encontrado' | 'indisponivel' };

/**
 * Busca dados públicos com cache do Next.
 * - Deu certo: guarda até a API avisar que mudou (revalidação por tag).
 * - 404: guarda por algumas horas.
 * - API dormindo ou fora do ar: guarda por pouco tempo (perfil "minutes"),
 *   então o build não quebra e a página se recupera sozinha.
 */
async function buscar<T>(caminho: string, tags: string[]): Promise<Resultado<T>> {
  'use cache';
  cacheTag(...tags);
  try {
    const r = await fetch(`${API_URL}${caminho}`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(15_000),
    });
    if (r.status === 404) {
      cacheLife('hours');
      return { ok: false, status: 'nao-encontrado' };
    }
    if (!r.ok) throw new Error(`API respondeu ${r.status}`);
    cacheLife('max');
    return { ok: true, dados: (await r.json()) as T };
  } catch (erro) {
    console.warn(`[api] ${caminho}: ${String(erro)}`);
    cacheLife('minutes');
    return { ok: false, status: 'indisponivel' };
  }
}

export const TAGS = {
  negocio: 'negocio',
  categorias: 'categorias',
  itens: 'itens',
  item: (slug: string) => `item-${slug}`,
};

export const obterNegocio = () => buscar<Negocio>('/negocio', [TAGS.negocio]);

export const obterCategorias = () =>
  buscar<Categoria[]>('/categorias', [TAGS.categorias, TAGS.itens]);

export const obterDestaques = () => buscar<ItemCard[]>('/itens/destaques', [TAGS.itens]);

export function obterItens({ categoria, pagina = 1 }: { categoria?: string; pagina?: number }) {
  const q = new URLSearchParams({ pagina: String(pagina), porPagina: '12' });
  if (categoria) q.set('categoria', categoria);
  return buscar<Pagina<ItemCard>>(`/itens?${q}`, [TAGS.itens, TAGS.categorias]);
}

export const obterItem = (slug: string) =>
  buscar<ItemCompleto>(`/itens/slug/${encodeURIComponent(slug)}`, [
    TAGS.itens,
    TAGS.item(slug),
  ]);

export const obterSlugs = () =>
  buscar<{ slug: string; atualizadoEm: string }[]>('/itens/slugs', [TAGS.itens]);
