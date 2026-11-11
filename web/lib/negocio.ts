import { obterNegocio } from './api-publica';
import { NEGOCIO_PADRAO } from './negocio-padrao';

/** Negócio da API ou o padrão, com indicação de disponibilidade. */
export async function negocioOuPadrao() {
  const r = await obterNegocio();
  // Os padrões por baixo cobrem campos que uma API mais antiga ainda não envia
  return r.ok
    ? { negocio: { ...NEGOCIO_PADRAO, ...r.dados }, disponivel: true }
    : { negocio: NEGOCIO_PADRAO, disponivel: false };
}
