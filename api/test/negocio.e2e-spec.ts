import request from 'supertest';
import { criarApp, entrar, prepararBanco } from './utils.js';

const base = {
  nome: 'Reboque Teste',
  corPrimaria: '#facc15',
  corSecundaria: '#111827',
  estiloTitulo: 'sans',
  whatsapp: '5541900000000',
  rotuloItens: 'Serviços',
};

describe('Negócio (e2e)', () => {
  let ctx: Awaited<ReturnType<typeof criarApp>>;
  let token: string;
  const api = () => request(ctx.app.getHttpServer());

  beforeAll(async () => {
    ctx = await criarApp();
    await prepararBanco(ctx.prisma);
    token = await entrar(ctx.app);
  });
  afterAll(() => ctx.app.close());

  it('expõe os padrões de ação principal, CTA e fatos', async () => {
    const r = await api().get('/negocio').expect(200);
    expect(r.body).toMatchObject({
      acaoPrincipal: 'whatsapp',
      ctaItem: 'Tenho interesse',
      rotuloItem: 'item',
      fatos: [],
    });
  });

  it('salva ação principal, CTA do item e fatos', async () => {
    const fatos = [
      { rotulo: 'Atendimento', valor: '24 horas, todos os dias' },
      { rotulo: 'Região', valor: 'Curitiba e região' },
    ];
    const r = await api()
      .put('/negocio')
      .set('Authorization', token)
      .send({
        ...base,
        acaoPrincipal: 'ligar',
        ctaItem: 'Chamar guincho',
        rotuloItem: 'serviço',
        fatos,
      })
      .expect(200);
    expect(r.body).toMatchObject({
      acaoPrincipal: 'ligar',
      ctaItem: 'Chamar guincho',
      rotuloItem: 'serviço',
      fatos,
    });
  });

  it('mantém os campos novos quando o corpo não os envia', async () => {
    const r = await api()
      .put('/negocio')
      .set('Authorization', token)
      .send(base)
      .expect(200);
    expect(r.body).toMatchObject({
      acaoPrincipal: 'ligar',
      ctaItem: 'Chamar guincho',
    });
    expect(r.body.fatos).toHaveLength(2);
  });

  it('recusa ação desconhecida, mais de 4 fatos e fato com campo extra', async () => {
    const fato = { rotulo: 'A', valor: 'B' };
    for (const extra of [
      { acaoPrincipal: 'email' },
      { fatos: Array(5).fill(fato) },
      { fatos: [{ ...fato, icone: 'x' }] },
      { fatos: [{ rotulo: '', valor: 'B' }] },
      { ctaItem: 'x'.repeat(25) },
    ]) {
      await api()
        .put('/negocio')
        .set('Authorization', token)
        .send({ ...base, ...extra })
        .expect(400);
    }
  });
});
