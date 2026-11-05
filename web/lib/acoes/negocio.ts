'use server';

import { api } from '../sessao';
import { negocioSchema, type NegocioForm } from '../schemas';
import type { Negocio } from '../tipos';
import { executar } from './resultado';

export async function salvarNegocio(dados: NegocioForm) {
  return executar(() =>
    api<Negocio>('/negocio', { method: 'PUT', body: JSON.stringify(negocioSchema.parse(dados)) }),
  );
}

export async function enviarImagemNegocio(campo: 'logo' | 'hero', formData: FormData) {
  return executar(() => api<Negocio>(`/negocio/${campo}`, { method: 'POST', body: formData }));
}

export async function removerImagemNegocio(campo: 'logo' | 'hero') {
  return executar(() => api<Negocio>(`/negocio/${campo}`, { method: 'DELETE' }));
}
