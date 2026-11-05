import { normalizarAtributos, substituirAtributos } from './atributos.js';

function txFalso() {
  const chamadas: string[] = [];
  const tx = {
    atributoItem: {
      deleteMany: vi.fn(async () => {
        chamadas.push('deleteMany');
        return { count: 2 };
      }),
      createMany: vi.fn(async () => {
        chamadas.push('createMany');
        return { count: 0 };
      }),
    },
  };
  return { tx, chamadas };
}

describe('normalizarAtributos', () => {
  it('apara espaços, descarta vazios e numera a ordem pela posição', () => {
    expect(
      normalizarAtributos([
        { nome: ' Quartos ', valor: ' 3 ' },
        { nome: '', valor: 'sem nome' },
        { nome: 'Área', valor: '   ' },
        { nome: 'Vagas', valor: '2' },
      ]),
    ).toEqual([
      { nome: 'Quartos', valor: '3', ordem: 0 },
      { nome: 'Vagas', valor: '2', ordem: 1 },
    ]);
  });
});

describe('substituirAtributos', () => {
  it('apaga a lista antiga antes de criar a nova', async () => {
    const { tx, chamadas } = txFalso();
    const total = await substituirAtributos(tx as never, 7, [
      { nome: 'Capacidade', valor: '3,5 t' },
      { nome: 'Área de atendimento', valor: 'Curitiba' },
    ]);

    expect(total).toBe(2);
    expect(chamadas).toEqual(['deleteMany', 'createMany']);
    expect(tx.atributoItem.deleteMany).toHaveBeenCalledWith({
      where: { itemId: 7 },
    });
    expect(tx.atributoItem.createMany).toHaveBeenCalledWith({
      data: [
        { nome: 'Capacidade', valor: '3,5 t', ordem: 0, itemId: 7 },
        { nome: 'Área de atendimento', valor: 'Curitiba', ordem: 1, itemId: 7 },
      ],
    });
  });

  it('com lista vazia, só apaga (remove todos os atributos)', async () => {
    const { tx, chamadas } = txFalso();
    await expect(substituirAtributos(tx as never, 7, [])).resolves.toBe(0);
    expect(chamadas).toEqual(['deleteMany']);
  });
});
