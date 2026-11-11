import { BedDouble, CircleCheck, MapPin, Ruler, Weight } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { iconeDoAtributo } from './icone-atributo';

describe('iconeDoAtributo', () => {
  it.each([
    ['Capacidade', Weight],
    ['Cidade', MapPin],
    ['Bairro', MapPin],
    ['Área', Ruler],
    ['Quartos', BedDouble],
    ['Cor', CircleCheck],
  ])('%s', (nome, icone) => {
    expect(iconeDoAtributo(nome)).toBe(icone);
  });
});
