'use server';

import { api } from '../sessao';
import { itemSchema, lerPreco, type ItemForm } from '../schemas';
import type { Imagem, ItemCompleto } from '../tipos';
import { executar } from './resultado';

function paraApi(dados: ItemForm) {
  const v = itemSchema.parse(dados);
  return { ...v, preco: lerPreco(v.preco) };
}

export async function criarItem(dados: ItemForm) {
  return executar(() =>
    api<ItemCompleto>('/itens', { method: 'POST', body: JSON.stringify(paraApi(dados)) }),
  );
}

export async function atualizarItem(id: number, dados: ItemForm) {
  return executar(() =>
    api<ItemCompleto>(`/itens/${id}`, { method: 'PATCH', body: JSON.stringify(paraApi(dados)) }),
  );
}

export async function alternarItem(id: number, campos: { ativo?: boolean; destaque?: boolean }) {
  return executar(() => api<ItemCompleto>(`/itens/${id}`, { method: 'PATCH', body: JSON.stringify(campos) }));
}

export async function excluirItem(id: number) {
  return executar(() => api<void>(`/itens/${id}`, { method: 'DELETE' }));
}

export async function enviarImagem(itemId: number, formData: FormData) {
  return executar(() => api<Imagem>(`/itens/${itemId}/imagens`, { method: 'POST', body: formData }));
}

export async function definirCapa(itemId: number, imagemId: number) {
  return executar(() => api<Imagem[]>(`/itens/${itemId}/imagens/${imagemId}/capa`, { method: 'PATCH' }));
}

export async function ordenarImagens(itemId: number, ids: number[]) {
  return executar(() =>
    api<Imagem[]>(`/itens/${itemId}/imagens/ordem`, { method: 'PUT', body: JSON.stringify({ ids }) }),
  );
}

export async function removerImagem(itemId: number, imagemId: number) {
  return executar(() => api<Imagem[]>(`/itens/${itemId}/imagens/${imagemId}`, { method: 'DELETE' }));
}
