import { TAMANHO_MAXIMO_BYTES, validarArquivo } from './validacao.js';

const JPG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0]);
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]);
const WEBP = Buffer.concat([
  Buffer.from('RIFF'),
  Buffer.alloc(4),
  Buffer.from('WEBP'),
]);
const GIF = Buffer.from('GIF89a......');

const arquivo = (buffer: Buffer, mimetype: string, size = buffer.length) => ({
  buffer,
  mimetype,
  size,
});

describe('validarArquivo', () => {
  it.each([
    [JPG, 'image/jpeg'],
    [PNG, 'image/png'],
    [WEBP, 'image/webp'],
  ])('aceita %s', (buffer, tipo) => {
    expect(validarArquivo(arquivo(buffer, tipo))).toEqual({ ok: true });
  });

  it('recusa tipos fora da lista (gif)', () => {
    expect(validarArquivo(arquivo(GIF, 'image/gif'))).toMatchObject({
      ok: false,
      motivo: 'tipo',
    });
  });

  it('recusa arquivo disfarçado: mimetype de imagem com conteúdo de outro tipo', () => {
    const pdf = Buffer.from('%PDF-1.7 .....');
    expect(validarArquivo(arquivo(pdf, 'image/jpeg'))).toMatchObject({
      motivo: 'tipo',
    });
  });

  it('recusa quando o mimetype declarado não bate com o conteúdo', () => {
    expect(validarArquivo(arquivo(PNG, 'image/jpeg'))).toMatchObject({
      motivo: 'tipo',
    });
  });

  it('aceita exatamente 5 MB e recusa acima disso', () => {
    expect(
      validarArquivo(arquivo(JPG, 'image/jpeg', TAMANHO_MAXIMO_BYTES)).ok,
    ).toBe(true);
    expect(
      validarArquivo(arquivo(JPG, 'image/jpeg', TAMANHO_MAXIMO_BYTES + 1)),
    ).toMatchObject({
      motivo: 'tamanho',
    });
  });

  it('recusa quando nenhum arquivo foi enviado', () => {
    expect(validarArquivo(undefined)).toMatchObject({ motivo: 'ausente' });
  });
});
