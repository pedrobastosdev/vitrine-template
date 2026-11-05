import { obterNegocio } from './api-publica';
import { NEGOCIO_PADRAO } from './negocio-padrao';

/** Negócio da API ou o padrão, com indicação de disponibilidade. */
export async function negocioOuPadrao() {
  const r = await obterNegocio();
  return r.ok ? { negocio: r.dados, disponivel: true } : { negocio: NEGOCIO_PADRAO, disponivel: false };
}
