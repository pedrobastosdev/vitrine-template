import type { Prisma } from '../generated/prisma/client.js';

export interface AtributoEntrada {
  nome: string;
  valor: string;
}

/** Tira espaços, descarta linhas vazias e define a ordem pela posição na lista. */
export function normalizarAtributos(lista: AtributoEntrada[]) {
  return lista
    .map((a) => ({ nome: a.nome.trim(), valor: a.valor.trim() }))
    .filter((a) => a.nome && a.valor)
    .map((a, ordem) => ({ ...a, ordem }));
}

/**
 * Substitui a lista inteira de atributos do item. Deve rodar dentro de uma
 * transação: se algo falhar, o item fica com a lista antiga, nunca pela metade.
 */
export async function substituirAtributos(
  tx: Pick<Prisma.TransactionClient, 'atributoItem'>,
  itemId: number,
  lista: AtributoEntrada[],
) {
  await tx.atributoItem.deleteMany({ where: { itemId } });
  const dados = normalizarAtributos(lista).map((a) => ({ ...a, itemId }));
  if (dados.length) await tx.atributoItem.createMany({ data: dados });
  return dados.length;
}
