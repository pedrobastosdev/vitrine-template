'use server';

import { redirect } from 'next/navigation';
import { API_URL } from '../config';
import { loginSchema, type LoginForm } from '../schemas';
import { apagarToken, salvarToken } from '../sessao';

export async function entrar(dados: LoginForm, destino?: string): Promise<{ erro: string } | void> {
  const valido = loginSchema.safeParse(dados);
  if (!valido.success) return { erro: 'Confira o e-mail e a senha.' };

  let r: Response;
  try {
    r = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(valido.data),
      cache: 'no-store',
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    return { erro: 'A API está iniciando (pode levar até 1 minuto no plano gratuito). Tente de novo.' };
  }
  if (r.status === 401) return { erro: 'E-mail ou senha inválidos.' };
  if (r.status === 429) return { erro: 'Muitas tentativas. Aguarde um minuto.' };
  if (!r.ok) return { erro: 'Não foi possível entrar agora. Tente de novo.' };

  const { token } = (await r.json()) as { token: string };
  await salvarToken(token);
  // Só aceita destinos internos do painel (evita redirecionar para outro site)
  redirect(destino?.startsWith('/painel') && !destino.startsWith('//') ? destino : '/painel');
}

export async function sair() {
  await apagarToken();
  redirect('/painel/login');
}
