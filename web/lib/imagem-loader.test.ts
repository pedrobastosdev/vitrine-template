import { describe, expect, it } from 'vitest';
import loader from './imagem-loader';

describe('imagemLoader', () => {
  it('redimensiona pela URL do Cloudinary', () => {
    expect(
      loader({ src: 'https://res.cloudinary.com/demo/image/upload/v1/vitrine/a.jpg', width: 640 }),
    ).toBe('https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_limit,w_640/v1/vitrine/a.jpg');
  });

  it('ajusta largura e formato no Unsplash', () => {
    const url = new URL(
      loader({ src: 'https://images.unsplash.com/photo-1?w=1920&q=80&fm=jpg', width: 384 }),
    );
    expect(url.searchParams.get('w')).toBe('384');
    expect(url.searchParams.get('auto')).toBe('format');
    expect(url.searchParams.has('fm')).toBe(false);
  });

  it('mantém outras URLs', () => {
    expect(loader({ src: '/logo.svg', width: 100 })).toBe('/logo.svg');
  });
});
