import { describe, expect, it } from 'vitest';
import { itemSchema, leadSchema, lerPreco, loginSchema, negocioSchema } from './schemas';

const itemValido = {
  titulo: 'Casa com piscina',
  descricao: '',
  preco: '1.250.000,50',
  categoriaId: 1,
  destaque: false,
  ativo: true,
  atributos: [{ nome: 'Quartos', valor: '3' }],
};

describe('lerPreco', () => {
  it('entende formato brasileiro e com ponto', () => {
    expect(lerPreco('1.250.000,50')).toBe(1250000.5);
    expect(lerPreco('R$ 180')).toBe(180);
    expect(lerPreco('99.9')).toBe(99.9);
    expect(lerPreco('')).toBeNull();
    expect(lerPreco('abc')).toBeNaN();
  });
});

describe('itemSchema', () => {
  it('aceita um item válido e preço vazio', () => {
    expect(itemSchema.safeParse(itemValido).success).toBe(true);
    expect(itemSchema.safeParse({ ...itemValido, preco: '' }).success).toBe(true);
  });

  it('recusa título curto, preço inválido e sem categoria', () => {
    const r = itemSchema.safeParse({ ...itemValido, titulo: 'ab', preco: '-5', categoriaId: 0 });
    expect(r.success).toBe(false);
    const campos = r.error!.issues.map((i) => i.path[0]);
    expect(campos).toEqual(expect.arrayContaining(['titulo', 'preco', 'categoriaId']));
  });

  it('recusa atributo com nome ou valor vazio', () => {
    const r = itemSchema.safeParse({ ...itemValido, atributos: [{ nome: ' ', valor: '3' }] });
    expect(r.success).toBe(false);
    expect(r.error!.issues[0].path).toEqual(['atributos', 0, 'nome']);
  });
});

describe('negocioSchema', () => {
  const base = {
    nome: 'Loja',
    slogan: '',
    corPrimaria: '#112233',
    corSecundaria: '#ffffff',
    estiloTitulo: 'sans',
    whatsapp: '+55 (48) 99999-0000',
    telefone: '',
    email: '',
    endereco: '',
    cidade: '',
    instagram: '@loja.oficial',
    rotuloItens: 'Produtos',
    rotuloItem: 'produto',
    acaoPrincipal: 'whatsapp',
    ctaItem: 'Tenho interesse',
    fatos: [{ rotulo: 'Entrega', valor: 'Em toda a cidade' }],
    heroTitulo: '',
    heroSubtitulo: '',
    sobreTitulo: '',
    sobreTexto: '',
  };

  it('limpa WhatsApp e Instagram', () => {
    const r = negocioSchema.parse(base);
    expect(r.whatsapp).toBe('5548999990000');
    expect(r.instagram).toBe('loja.oficial');
  });

  it('recusa cor fora do formato e WhatsApp sem DDI', () => {
    expect(negocioSchema.safeParse({ ...base, corPrimaria: 'red' }).success).toBe(false);
    expect(negocioSchema.safeParse({ ...base, whatsapp: '48999990000' }).success).toBe(false);
  });

  it('limita os destaques a 4 e o botão do item a 24 caracteres', () => {
    const fato = { rotulo: 'A', valor: 'B' };
    expect(negocioSchema.safeParse({ ...base, fatos: Array(4).fill(fato) }).success).toBe(true);
    expect(negocioSchema.safeParse({ ...base, fatos: Array(5).fill(fato) }).success).toBe(false);
    expect(negocioSchema.safeParse({ ...base, fatos: [{ rotulo: ' ', valor: 'B' }] }).success).toBe(false);
    expect(negocioSchema.safeParse({ ...base, ctaItem: 'x'.repeat(25) }).success).toBe(false);
    expect(negocioSchema.safeParse({ ...base, acaoPrincipal: 'email' }).success).toBe(false);
  });
});

describe('leadSchema e loginSchema', () => {
  it('exige telefone com DDD', () => {
    expect(leadSchema.safeParse({ nome: 'Ana', telefone: '9999-0000', mensagem: 'Oi' }).success).toBe(false);
    expect(leadSchema.safeParse({ nome: 'Ana', telefone: '(48) 99999-0000', mensagem: 'Oi' }).success).toBe(true);
  });

  it('recusa robô que preencheu o campo escondido', () => {
    expect(leadSchema.safeParse({ nome: 'Ana', telefone: '48999990000', mensagem: 'Oi', site: 'x' }).success).toBe(false);
  });

  it('valida e-mail no login', () => {
    expect(loginSchema.safeParse({ email: 'nao-e-email', senha: '1' }).success).toBe(false);
  });
});
