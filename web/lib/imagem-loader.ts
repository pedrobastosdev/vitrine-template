'use client';

import type { ImageLoaderProps } from 'next/image';

/**
 * Loader do next/image: em vez de otimizar no servidor do Next, pede ao CDN
 * de origem a foto já no tamanho e formato certos.
 * Cloudinary: insere "f_auto,q_auto,w_<largura>" logo depois de /upload/.
 */
export default function imagemLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.includes('res.cloudinary.com') && src.includes('/upload/')) {
    const q = quality ? `q_${quality}` : 'q_auto';
    return src.replace('/upload/', `/upload/f_auto,${q},c_limit,w_${width}/`);
  }
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('w', String(width));
    url.searchParams.set('q', String(quality ?? 70));
    url.searchParams.set('auto', 'format');
    url.searchParams.delete('fm');
    return url.toString();
  }
  return src;
}
