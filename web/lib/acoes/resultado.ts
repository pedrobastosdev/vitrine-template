import 'server-only';
import { unstable_rethrow } from 'next/navigation';
import { ErroApi } from '../sessao';

export type Resultado<T = undefined> = { ok: true; dados: T } | { ok: false; erro: string };

/** Executa a chamada e transforma erros da API em mensagem para o toast. */
export async function executar<T>(fn: () => Promise<T>): Promise<Resultado<T>> {
  try {
    return { ok: true, dados: await fn() };
  } catch (e) {
    unstable_rethrow(e); // deixa passar o redirect() para o login
    if (e instanceof ErroApi) return { ok: false, erro: e.message };
    console.error(e);
    return { ok: false, erro: 'Algo deu errado. Tente de novo.' };
  }
}
