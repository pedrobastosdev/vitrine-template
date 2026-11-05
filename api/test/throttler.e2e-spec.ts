import request from 'supertest';
import { criarApp, prepararBanco } from './utils.js';

describe('Limite de envios de lead (e2e)', () => {
  let ctx: Awaited<ReturnType<typeof criarApp>>;

  beforeAll(async () => {
    ctx = await criarApp();
    await prepararBanco(ctx.prisma);
  });
  afterAll(() => ctx.app.close());

  it('bloqueia com 429 depois de LEADS_LIMITE envios do mesmo IP', async () => {
    const limite = Number(process.env.LEADS_LIMITE);
    const enviar = () =>
      request(ctx.app.getHttpServer())
        .post('/leads')
        .send({ nome: 'Robô', telefone: '11999990000', mensagem: 'spam' });

    for (let i = 0; i < limite; i++) await enviar().expect(201);
    await enviar().expect(429);
    expect(await ctx.prisma.lead.count()).toBe(limite);
  });

  it('o limite não afeta as rotas públicas de leitura', async () => {
    for (let i = 0; i < 5; i++) {
      await request(ctx.app.getHttpServer()).get('/itens').expect(200);
    }
  });
});
