/** Utilitários de cor para montar o tema a partir das cores do negócio. */

type RGB = [number, number, number];

export function hexParaRgb(hex: string): RGB {
  const limpo = hex.replace('#', '').trim();
  const cheio =
    limpo.length === 3
      ? limpo
          .split('')
          .map((c) => c + c)
          .join('')
      : limpo;
  if (!/^[0-9a-fA-F]{6}$/.test(cheio)) return [0, 0, 0];
  const n = parseInt(cheio, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbParaHex([r, g, b]: RGB): string {
  return `#${[r, g, b]
    .map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0'))
    .join('')}`;
}

/** Luminância relativa (WCAG 2.x). */
export function luminancia(hex: string): number {
  const [r, g, b] = hexParaRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste entre duas cores, de 1 a 21. */
export function contraste(a: string, b: string): number {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

export const BRANCO = '#ffffff';
// Preto profundo o bastante para que qualquer cor alcance 4.5:1 com branco ou com ele
export const QUASE_PRETO = '#050505';

/** Cor do texto sobre um fundo: branco ou quase preto, o que contrastar mais. */
export function corDoTexto(fundo: string): string {
  return contraste(fundo, BRANCO) >= contraste(fundo, QUASE_PRETO) ? BRANCO : QUASE_PRETO;
}

/** Mistura duas cores; peso 0 = a, peso 1 = b. */
export function misturar(a: string, b: string, peso: number): string {
  const ca = hexParaRgb(a);
  const cb = hexParaRgb(b);
  return rgbParaHex(ca.map((v, i) => v + (cb[i] - v) * peso) as RGB);
}

/**
 * Escurece (ou clareia) a cor até atingir o contraste mínimo sobre o fundo.
 * Serve para usar a cor da marca em textos e links sobre fundo branco:
 * um amarelo vira um mostarda legível, um azul-escuro fica como está.
 */
export function ajustarParaContraste(cor: string, fundo = BRANCO, minimo = 4.5): string {
  if (contraste(cor, fundo) >= minimo) return cor;
  const alvo = luminancia(fundo) > 0.5 ? QUASE_PRETO : BRANCO;
  for (let peso = 0.05; peso <= 1; peso += 0.05) {
    const candidata = misturar(cor, alvo, peso);
    if (contraste(candidata, fundo) >= minimo) return candidata;
  }
  return alvo;
}

export interface CoresTema {
  corPrimaria: string;
  corSecundaria: string;
}

/** Variáveis CSS aplicadas no <html>. */
export function variaveisDoTema({ corPrimaria, corSecundaria }: CoresTema) {
  return {
    '--marca': corPrimaria,
    '--marca-contraste': corDoTexto(corPrimaria),
    '--marca-forte': ajustarParaContraste(corPrimaria),
    '--marca-suave': misturar(corPrimaria, BRANCO, 0.9),
    '--marca-escura': misturar(corPrimaria, QUASE_PRETO, 0.55),
    '--destaque': corSecundaria,
    '--destaque-contraste': corDoTexto(corSecundaria),
    '--destaque-forte': ajustarParaContraste(corSecundaria),
  } as Record<string, string>;
}
