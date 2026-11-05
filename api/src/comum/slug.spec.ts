import { SLUGS_RESERVADOS, gerarSlugUnico, slugify } from './slug.js';

const nenhumExiste = () => Promise.resolve(false);
const existentes = (lista: string[]) => (slug: string) =>
  Promise.resolve(lista.includes(slug));

describe('slugify', () => {
  it('remove acentos, espaços e caracteres especiais', () => {
    expect(slugify('Apartamento 3 Quartos — Ação & Coração!')).toBe(
      'apartamento-3-quartos-acao-coracao',
    );
  });

  it('remove hífens nas pontas e repetidos', () => {
    expect(slugify('  --Casa   na   Praia--  ')).toBe('casa-na-praia');
  });

  it('limita o tamanho sem terminar em hífen', () => {
    const slug = slugify('a'.repeat(79) + ' bcd');
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug.endsWith('-')).toBe(false);
  });
});

describe('gerarSlugUnico', () => {
  it('usa o slug base quando está livre', async () => {
    await expect(gerarSlugUnico('Guincho Pesado', nenhumExiste)).resolves.toBe(
      'guincho-pesado',
    );
  });

  it('acrescenta sufixo quando o slug já existe', async () => {
    await expect(
      gerarSlugUnico('Casa', existentes(['casa', 'casa-2'])),
    ).resolves.toBe('casa-3');
  });

  it('nunca gera um slug reservado por rota do site', async () => {
    for (const reservado of ['Painel', 'Contato', 'Itens', 'API']) {
      const slug = await gerarSlugUnico(reservado, nenhumExiste);
      expect(SLUGS_RESERVADOS.has(slug)).toBe(false);
      expect(slug).toBe(`${reservado.toLowerCase()}-2`);
    }
  });

  it('usa o padrão quando o texto não gera slug', async () => {
    await expect(gerarSlugUnico('!!!', nenhumExiste)).resolves.toBe('item');
  });
});
