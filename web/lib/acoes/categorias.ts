'use server';

import { api } from '../sessao';
import { categoriaSchema } from '../schemas';
import type { Categoria } from '../tipos';
import { executar } from './resultado';

export async function salvarCategoria(id: number | null, nome: string, ordem?: number) {
  return executar(() => {
    const dados = { ...categoriaSchema.parse({ nome }), ordem };
    return id
      ? api<Categoria>(`/categorias/${id}`, { method: 'PATCH', body: JSON.stringify(dados) })
      : api<Categoria>('/categorias', { method: 'POST', body: JSON.stringify(dados) });
  });
}

export async function excluirCategoria(id: number) {
  return executar(() => api<void>(`/categorias/${id}`, { method: 'DELETE' }));
}
