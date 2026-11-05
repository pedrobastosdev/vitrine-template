/**
 * Fotos de celular passam fácil de 5 MB, e as funções da Vercel aceitam
 * no máximo ~4,5 MB por requisição. Por isso redimensionamos e comprimimos
 * no navegador antes de enviar: no máximo 1920 px de largura e ~1 MB.
 */
export const LARGURA_MAXIMA = 1920;
export const BYTES_ALVO = 1024 * 1024;
export const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'];
/** Limite do arquivo original, antes de comprimir. */
export const BYTES_ORIGINAL_MAXIMO = 25 * 1024 * 1024;

export function calcularDimensoes(largura: number, altura: number, maxLargura = LARGURA_MAXIMA) {
  if (largura <= maxLargura) return { largura, altura };
  const escala = maxLargura / largura;
  return { largura: maxLargura, altura: Math.round(altura * escala) };
}

export function validarOriginal(arquivo: { type: string; size: number }): string | null {
  if (!TIPOS_ACEITOS.includes(arquivo.type)) return 'Use fotos JPG, PNG ou WebP.';
  if (arquivo.size > BYTES_ORIGINAL_MAXIMO) return 'Foto muito grande (máx. 25 MB).';
  return null;
}

/** Qualidades tentadas em ordem até caber no alvo. */
export const QUALIDADES = [0.85, 0.78, 0.7, 0.6, 0.5];

export async function comprimirImagem(arquivo: File): Promise<File> {
  const bitmap = await createImageBitmap(arquivo, { imageOrientation: 'from-image' });
  const { largura, altura } = calcularDimensoes(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = largura;
  canvas.height = altura;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, largura, altura);
  bitmap.close();

  const gerar = (tipo: string, q: number) =>
    new Promise<Blob | null>((ok) => canvas.toBlob(ok, tipo, q));

  let blob: Blob | null = null;
  for (const q of QUALIDADES) {
    blob = await gerar('image/webp', q);
    // Navegadores sem WebP devolvem PNG: cai para JPEG
    if (blob && blob.type !== 'image/webp') blob = await gerar('image/jpeg', q);
    if (blob && blob.size <= BYTES_ALVO) break;
  }
  if (!blob) throw new Error('Não foi possível processar a foto.');
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
  const nome = arquivo.name.replace(/\.[^.]+$/, '') || 'foto';
  return new File([blob], `${nome}.${ext}`, { type: blob.type });
}
