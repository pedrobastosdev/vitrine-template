import { describe, expect, it } from 'vitest';
import { segredoConfere } from './segredo';

describe('segredoConfere', () => {
  it('aceita só o segredo exato', () => {
    expect(segredoConfere('abc123', 'abc123')).toBe(true);
    expect(segredoConfere('abc124', 'abc123')).toBe(false);
    expect(segredoConfere('abc', 'abc123')).toBe(false);
  });

  it('recusa quando falta o segredo de um dos lados', () => {
    expect(segredoConfere(null, 'abc')).toBe(false);
    expect(segredoConfere('abc', undefined)).toBe(false);
    expect(segredoConfere('', '')).toBe(false);
  });
});
