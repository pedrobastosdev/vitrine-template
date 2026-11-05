import { describe, expect, it } from 'vitest';
import { tokenExpirado } from './jwt';

const token = (payload: object) =>
  `x.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.assinatura`;

describe('tokenExpirado', () => {
  it('confere o exp do payload', () => {
    const agora = 1_700_000_000_000;
    expect(tokenExpirado(token({ exp: agora / 1000 + 60 }), agora)).toBe(false);
    expect(tokenExpirado(token({ exp: agora / 1000 - 1 }), agora)).toBe(true);
  });

  it('trata token ausente ou malformado como expirado', () => {
    expect(tokenExpirado(undefined)).toBe(true);
    expect(tokenExpirado('abc')).toBe(true);
    expect(tokenExpirado('a.@@@.c')).toBe(true);
  });
});
