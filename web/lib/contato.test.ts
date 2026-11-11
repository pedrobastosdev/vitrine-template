import { describe, expect, it } from 'vitest';
import { acaoEfetiva, acoesContato, canalPrincipal, linkTelefone } from './contato';

const base = {
  nome: 'Reboque',
  rotuloItens: 'Serviços',
  whatsapp: '5541900000000',
  telefone: '(41) 3000-0000',
  acaoPrincipal: 'ligar' as const,
};

describe('acoesContato', () => {
  it('põe a ação escolhida primeiro e mantém o catálogo', () => {
    expect(acoesContato(base).map((a) => a.tipo)).toEqual(['ligar', 'whatsapp', 'catalogo']);
    expect(acoesContato({ ...base, acaoPrincipal: 'whatsapp' }).map((a) => a.tipo)).toEqual([
      'whatsapp',
      'ligar',
      'catalogo',
    ]);
    expect(acoesContato({ ...base, acaoPrincipal: 'catalogo' }).map((a) => a.tipo)).toEqual([
      'catalogo',
      'whatsapp',
      'ligar',
    ]);
  });

  it('"ligar" sem telefone cai para o WhatsApp', () => {
    const n = { ...base, telefone: '' };
    expect(acaoEfetiva(n)).toBe('whatsapp');
    expect(canalPrincipal(n)).toBe('whatsapp');
    expect(acoesContato(n).map((a) => a.tipo)).toEqual(['whatsapp', 'catalogo']);
  });

  it('sem nenhum canal (API fora do ar) sobra o catálogo', () => {
    const n = { ...base, telefone: '', whatsapp: '' };
    expect(acaoEfetiva(n)).toBe('catalogo');
    expect(canalPrincipal(n)).toBeNull();
    expect(acoesContato(n)).toHaveLength(1);
  });

  it('monta rótulos e links', () => {
    const [ligar, whats, catalogo] = acoesContato(base, 'Oi');
    expect(ligar).toMatchObject({ href: 'tel:4130000000', rotulo: 'Ligar agora', externo: false });
    expect(whats).toMatchObject({ href: 'https://wa.me/5541900000000?text=Oi', externo: true });
    expect(catalogo).toMatchObject({ href: '/itens', rotulo: 'Ver serviços' });
  });

  it('mantém o + do DDI no link de telefone', () => {
    expect(linkTelefone('+55 (41) 3000-0000')).toBe('tel:+554130000000');
  });
});
