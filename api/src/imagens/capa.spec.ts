import { escolherCapa } from './capa.js';

const img = (id: number, ordem: number, capa = false) => ({ id, ordem, capa });

describe('escolherCapa', () => {
  it('retorna null quando não há imagens', () => {
    expect(escolherCapa([])).toBeNull();
  });

  it('a primeira foto enviada vira capa automaticamente', () => {
    expect(escolherCapa([img(10, 0)])).toBe(10);
  });

  it('mantém a capa atual quando chega uma foto nova', () => {
    expect(escolherCapa([img(1, 0), img(2, 1, true), img(3, 2)])).toBe(2);
  });

  it('troca para a preferida quando ela é do item', () => {
    expect(escolherCapa([img(1, 0, true), img(2, 1)], 2)).toBe(2);
  });

  it('ignora preferida que não pertence ao item', () => {
    expect(escolherCapa([img(1, 0, true), img(2, 1)], 99)).toBe(1);
  });

  it('ao remover a capa, a primeira da ordem assume', () => {
    expect(escolherCapa([img(5, 3), img(4, 1), img(6, 2)])).toBe(4);
  });

  it('corrige dados com duas capas, ficando só uma', () => {
    expect(escolherCapa([img(1, 2, true), img(2, 0, true)])).toBe(2);
  });
});
