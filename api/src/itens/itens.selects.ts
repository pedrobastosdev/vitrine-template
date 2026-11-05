import type { Prisma } from '../generated/prisma/client.js';

/** Capa primeiro; se nenhuma foto estiver marcada, vale a primeira da ordem. */
export const ordemImagens: Prisma.ImagemItemOrderByWithRelationInput[] = [
  { capa: 'desc' },
  { ordem: 'asc' },
];

export const selectCard = {
  id: true,
  titulo: true,
  slug: true,
  preco: true,
  destaque: true,
  categoria: { select: { id: true, nome: true, slug: true } },
  imagens: { orderBy: ordemImagens, take: 1, select: { url: true } },
  atributos: {
    orderBy: { ordem: 'asc' },
    take: 4,
    select: { nome: true, valor: true },
  },
} satisfies Prisma.ItemSelect;

export const includeCompleto = {
  categoria: { select: { id: true, nome: true, slug: true } },
  imagens: {
    orderBy: { ordem: 'asc' },
    select: { id: true, url: true, ordem: true, capa: true },
  },
  atributos: {
    orderBy: { ordem: 'asc' },
    select: { id: true, nome: true, valor: true, ordem: true },
  },
} satisfies Prisma.ItemInclude;

type Card = Prisma.ItemGetPayload<{ select: typeof selectCard }>;

/** Achata a capa para um campo simples, mais fácil de usar no front. */
export function paraCard({ imagens, ...item }: Card) {
  return { ...item, capa: imagens[0]?.url ?? null };
}
