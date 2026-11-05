export interface ImagemParaCapa {
  id: number;
  ordem: number;
  capa: boolean;
}

/**
 * Decide qual imagem deve ser a capa (no máximo uma por item):
 * 1. a preferida, se pertencer ao item;
 * 2. senão, a capa atual (se houver mais de uma por algum erro, a de menor ordem);
 * 3. senão, a primeira da ordem.
 * Retorna null quando o item não tem imagens.
 */
export function escolherCapa(
  imagens: ImagemParaCapa[],
  preferida?: number,
): number | null {
  if (!imagens.length) return null;
  if (preferida !== undefined && imagens.some((i) => i.id === preferida))
    return preferida;
  const porOrdem = [...imagens].sort(
    (a, b) => a.ordem - b.ordem || a.id - b.id,
  );
  return (porOrdem.find((i) => i.capa) ?? porOrdem[0]).id;
}
