'use server';

import { api } from '../sessao';
import type { Lead } from '../tipos';
import { executar } from './resultado';

export async function marcarLead(id: number, atendido: boolean) {
  return executar(() => api<Lead>(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify({ atendido }) }));
}

export async function excluirLead(id: number) {
  return executar(() => api<void>(`/leads/${id}`, { method: 'DELETE' }));
}
