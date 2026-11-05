import { describe, expect, it } from 'vitest';
import { calcularDimensoes, validarOriginal } from './comprimir-imagem';

describe('calcularDimensoes', () => {
  it('reduz para 1920 px de largura mantendo a proporção', () => {
    expect(calcularDimensoes(4000, 3000)).toEqual({ largura: 1920, altura: 1440 });
  });
  it('não aumenta fotos pequenas', () => {
    expect(calcularDimensoes(800, 600)).toEqual({ largura: 800, altura: 600 });
  });
});

describe('validarOriginal', () => {
  it('aceita jpg, png e webp', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp']) {
      expect(validarOriginal({ type, size: 1000 })).toBeNull();
    }
  });
  it('recusa outros tipos e arquivos enormes', () => {
    expect(validarOriginal({ type: 'image/gif', size: 1 })).toMatch(/JPG/);
    expect(validarOriginal({ type: 'image/jpeg', size: 30 * 1024 * 1024 })).toMatch(/25 MB/);
  });
});
