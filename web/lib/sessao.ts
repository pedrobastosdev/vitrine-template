import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { API_URL } from './config';

export const COOKIE_SESSAO = 'vitrine_sessao';

export async function obterToken() {
  return (await cookies()).get(COOKIE_SESSAO)?.value;
}

export async function salvarToken(token: string) {
  (await cookies()).set(COOKIE_SESSAO, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function apagarToken() {
  (await cookies()).delete(COOKIE_SESSAO);
}

export class ErroApi extends Error {
  constructor(
    public status: number,
    mensagem: string,
  ) {
    super(mensagem);
  }
}

/** Traduz a resposta de erro do Nest (message pode ser texto ou lista). */
async function mensagemDeErro(r: Response) {
  const corpo = (await r.json().catch(() => null)) as { message?: string | string[] } | null;
  const m = corpo?.message;
  if (Array.isArray(m)) return m.join('. ');
  if (m) return m;
  if (r.status === 429) return 'Muitas tentativas. Aguarde um pouco e tente de novo.';
  return 'A API não respondeu como esperado. Tente de novo.';
}

/**
 * Chamada autenticada do painel para a API, feita pelo servidor do Next com o
 * token do cookie httpOnly. Sem sessão válida, volta para o login.
 */
export async function api<T>(caminho: string, init: RequestInit = {}): Promise<T> {
  const token = await obterToken();
  if (!token) redirect('/painel/login');

  let r: Response;
  try {
    r = await fetch(`${API_URL}${caminho}`, {
      ...init,
      cache: 'no-store',
      headers: {
        ...(init.body && !(init.body instanceof FormData) ? { 'content-type': 'application/json' } : {}),
        ...init.headers,
        authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    throw new ErroApi(503, 'A API está iniciando ou fora do ar. Aguarde alguns segundos e tente de novo.');
  }

  if (r.status === 401) redirect('/painel/login?expirou=1');
  if (!r.ok) throw new ErroApi(r.status, await mensagemDeErro(r));
  if (r.status === 204) return undefined as T;
  return (await r.json()) as T;
}
