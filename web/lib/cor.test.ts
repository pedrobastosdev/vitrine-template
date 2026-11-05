import { describe, expect, it } from 'vitest';
import {
  ajustarParaContraste,
  contraste,
  corDoTexto,
  hexParaRgb,
  variaveisDoTema,
} from './cor';

describe('cores do tema', () => {
  it('converte hex curto e longo', () => {
    expect(hexParaRgb('#fff')).toEqual([255, 255, 255]);
    expect(hexParaRgb('#1f4e5f')).toEqual([31, 78, 95]);
  });

  it('calcula o contraste WCAG (preto x branco = 21)', () => {
    expect(contraste('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('usa texto escuro sobre amarelo e branco sobre azul-escuro', () => {
    expect(corDoTexto('#facc15')).toBe('#050505');
    expect(corDoTexto('#1f4e5f')).toBe('#ffffff');
  });

  it.each(['#facc15', '#22c55e', '#ff0000', '#00ffff', '#1f4e5f', '#c8a24a', '#777777', '#7a7a7a', '#ff6b00'])(
    'texto sobre %s sempre passa de 4.5:1',
    (cor) => {
      expect(contraste(cor, corDoTexto(cor))).toBeGreaterThanOrEqual(4.5);
      expect(contraste(ajustarParaContraste(cor), '#ffffff')).toBeGreaterThanOrEqual(4.5);
      expect(contraste(ajustarParaContraste(cor, '#0f1115'), '#0f1115')).toBeGreaterThanOrEqual(4.5);
    },
  );

  it('não mexe numa cor que já tem contraste', () => {
    expect(ajustarParaContraste('#1f4e5f')).toBe('#1f4e5f');
  });

  it('gera as variáveis CSS do tema', () => {
    const v = variaveisDoTema({ corPrimaria: '#facc15', corSecundaria: '#111827' });
    expect(v['--marca']).toBe('#facc15');
    expect(v['--marca-contraste']).toBe('#050505');
    expect(v['--destaque-contraste']).toBe('#ffffff');
  });
});
