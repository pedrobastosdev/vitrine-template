import { describe, expect, it } from 'vitest';
import { formatarPreco, resumir } from './formato';
import { linkWhatsApp, mensagemInteresse } from './whatsapp';

describe('formatarPreco', () => {
  it('formata em reais e trata preço ausente', () => {
    expect(formatarPreco('1250000')).toMatch(/^R\$\s1\.250\.000$/);
    expect(formatarPreco('180.5')).toMatch(/^R\$\s180,50$/);
    expect(formatarPreco(null)).toBe('Sob consulta');
  });
});

describe('resumir', () => {
  it('corta textos longos com reticências', () => {
    expect(resumir('a'.repeat(200), 10)).toHaveLength(10);
    expect(resumir('curto')).toBe('curto');
  });
});

describe('linkWhatsApp', () => {
  it('monta o link wa.me só com dígitos e mensagem codificada', () => {
    expect(linkWhatsApp('+55 (48) 90000-0000', mensagemInteresse('Casa & Jardim'))).toBe(
      'https://wa.me/5548900000000?text=Ol%C3%A1!%20Tenho%20interesse%20no%20item%20%22Casa%20%26%20Jardim%22.',
    );
  });
});

describe('mascararTelefone', () => {
  it('formata fixo e celular', async () => {
    const { mascararTelefone } = await import('./formato');
    expect(mascararTelefone('4830000000')).toBe('(48) 3000-0000');
    expect(mascararTelefone('48999990000')).toBe('(48) 99999-0000');
    expect(mascararTelefone('48')).toBe('(48');
  });
});
