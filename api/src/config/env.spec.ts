import { validarEnv } from './env.js';

describe('validarEnv', () => {
  it('aplica valores padrão e converte números', () => {
    const env = validarEnv({
      DATABASE_URL: 'postgresql://x',
      JWT_SECRET: '12345678',
      LEADS_LIMITE: '10',
    });
    expect(env.PORT).toBe(3001);
    expect(env.LEADS_LIMITE).toBe(10);
  });

  it('falha sem DATABASE_URL', () => {
    expect(() => validarEnv({ JWT_SECRET: '12345678' })).toThrow(
      /DATABASE_URL/,
    );
  });
});
