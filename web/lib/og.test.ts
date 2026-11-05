import { describe, expect, it } from 'vitest';
import { imagemOg } from './og';

describe('imagemOg', () => {
  it('recorta 1200x630 no Cloudinary', () => {
    expect(imagemOg('https://res.cloudinary.com/x/image/upload/v1/a.webp')).toBe(
      'https://res.cloudinary.com/x/image/upload/c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/v1/a.webp',
    );
  });
  it('recorta no Unsplash e ignora ausência', () => {
    expect(imagemOg('https://images.unsplash.com/photo-1?w=10')).toContain('h=630');
    expect(imagemOg(null)).toBeUndefined();
  });
});
