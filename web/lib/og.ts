/** Versão 1200x630 em JPG da foto, o formato que o WhatsApp e as redes exibem melhor. */
export function imagemOg(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/');
  }
  if (url.includes('images.unsplash.com')) {
    const u = new URL(url);
    u.searchParams.set('w', '1200');
    u.searchParams.set('h', '630');
    u.searchParams.set('fit', 'crop');
    u.searchParams.set('fm', 'jpg');
    u.searchParams.set('q', '75');
    return u.toString();
  }
  return url;
}
