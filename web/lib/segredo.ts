import { timingSafeEqual } from 'node:crypto';

/** Compara segredos em tempo constante (não vaza o tamanho do acerto pelo tempo). */
export function segredoConfere(recebido: string | null | undefined, esperado: string | undefined) {
  if (!recebido || !esperado) return false;
  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}
