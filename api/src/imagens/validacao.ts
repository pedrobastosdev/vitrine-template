export const TAMANHO_MAXIMO_BYTES = 5 * 1024 * 1024;

export const TIPOS_PERMITIDOS = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export interface ArquivoEnviado {
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export type ResultadoValidacao =
  | { ok: true }
  | { ok: false; motivo: 'ausente' | 'tipo' | 'tamanho'; mensagem: string };

/** Confere os primeiros bytes: o mimetype vem do navegador e pode mentir. */
function tipoPelaAssinatura(b: Buffer): string | null {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff)
    return 'image/jpeg';
  if (
    b.length >= 8 &&
    b
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return 'image/png';
  }
  if (
    b.length >= 12 &&
    b.subarray(0, 4).toString('ascii') === 'RIFF' &&
    b.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}

export function validarArquivo(
  arquivo?: ArquivoEnviado | null,
): ResultadoValidacao {
  if (!arquivo || !arquivo.buffer?.length) {
    return {
      ok: false,
      motivo: 'ausente',
      mensagem: 'Envie uma imagem no campo "arquivo".',
    };
  }
  if (arquivo.size > TAMANHO_MAXIMO_BYTES) {
    return {
      ok: false,
      motivo: 'tamanho',
      mensagem: 'A imagem deve ter no máximo 5 MB.',
    };
  }
  const real = tipoPelaAssinatura(arquivo.buffer);
  const declarado = arquivo.mimetype;
  if (
    !real ||
    !(TIPOS_PERMITIDOS as readonly string[]).includes(declarado) ||
    real !== declarado
  ) {
    return {
      ok: false,
      motivo: 'tipo',
      mensagem: 'Use imagens JPG, PNG ou WebP.',
    };
  }
  return { ok: true };
}
