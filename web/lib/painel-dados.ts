import 'server-only';
import { api } from './sessao';
import type { Categoria, ItemCard, Lead, Pagina } from './tipos';

export type ItemPainel = ItemCard & { ativo: boolean; atualizadoEm: string; totalImagens: number };

export const listarItensPainel = (q: URLSearchParams) => api<Pagina<ItemPainel>>(`/itens/painel?${q}`);
export const listarLeads = (q: URLSearchParams) => api<Pagina<Lead> & { pendentes: number }>(`/leads?${q}`);
export const listarCategorias = () => api<Categoria[]>('/categorias');

/** Link do WhatsApp a partir do telefone digitado pelo visitante (assume Brasil sem DDI). */
export function whatsDoLead(telefone: string) {
  const d = telefone.replace(/\D/g, '');
  return d.length <= 11 ? `55${d}` : d;
}

/** Nomes de atributos já usados no catálogo, para sugerir no formulário. */
export async function sugestoesDeAtributos(): Promise<string[]> {
  const r = await listarItensPainel(new URLSearchParams({ porPagina: '48' }));
  const contagem = new Map<string, number>();
  for (const item of r.itens) for (const a of item.atributos) contagem.set(a.nome, (contagem.get(a.nome) ?? 0) + 1);
  return [...contagem.entries()].sort((a, b) => b[1] - a[1]).map(([nome]) => nome);
}
