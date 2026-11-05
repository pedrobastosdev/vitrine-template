import type { MetadataRoute } from 'next';
import { obterSlugs } from '@/lib/api-publica';
import { SITE_URL } from '@/lib/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const r = await obterSlugs();
  const itens = r.ok ? r.dados : [];
  const recente = itens[0]?.atualizadoEm;
  return [
    { url: `${SITE_URL}/`, lastModified: recente, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/itens`, lastModified: recente, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/contato`, changeFrequency: 'yearly', priority: 0.5 },
    ...itens.map((i) => ({
      url: `${SITE_URL}/${i.slug}`,
      lastModified: i.atualizadoEm,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
