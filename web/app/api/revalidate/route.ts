import { revalidateTag } from 'next/cache';
import { segredoConfere } from '@/lib/segredo';

/**
 * Chamado pela API quando o dono salva algo no painel.
 * expire: 0 faz a próxima visita já buscar o dado novo.
 */
export async function POST(request: Request) {
  if (!segredoConfere(request.headers.get('x-revalidate-secret'), process.env.REVALIDATE_SECRET)) {
    return Response.json({ erro: 'Não autorizado' }, { status: 401 });
  }

  const corpo = (await request.json().catch(() => ({}))) as { tags?: unknown };
  const tags = Array.isArray(corpo.tags)
    ? corpo.tags.filter((t): t is string => typeof t === 'string' && t.length <= 256).slice(0, 50)
    : [];
  if (!tags.length) return Response.json({ erro: 'Informe as tags' }, { status: 400 });

  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidado: true, tags });
}
