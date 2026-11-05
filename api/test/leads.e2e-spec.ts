import request from 'supertest';
import { criarApp, entrar, prepararBanco } from './utils.js';

const lead = {
  nome: 'Maria',
  telefone: '(48) 99999-0000',
  mensagem: 'Quero visitar',
};

describe('Leads (e2e)', () => {
  let ctx: Awaited<ReturnType<typeof criarApp>>;
  let token: string;
  const api = () => request(ctx.app.getHttpServer());

  beforeAll(async () => {
    ctx = await criarApp();
    const { casas } = await prepararBanco(ctx.prisma);
    await ctx.prisma.item.createMany({
      data: [
        { titulo: 'Ativo', slug: 'ativo', categoriaId: casas.id },
        {
          titulo: 'Inativo',
          slug: 'inativo',
          categoriaId: casas.id,
          ativo: false,
        },
      ],
    });
    token = await entrar(ctx.app);
  });
  afterAll(() => ctx.app.close());

  // Atenção: LEADS_LIMITE=3 nos testes, então este arquivo faz no máximo 3 envios
  it('cria lead público vinculado a item ativo', async () => {
    const item = await ctx.prisma.item.findUniqueOrThrow({
      where: { slug: 'ativo' },
    });
    await api()
      .post('/leads')
      .send({ ...lead, itemId: item.id })
      .expect(201);
    const salvo = await ctx.prisma.lead.findFirstOrThrow({
      orderBy: { id: 'desc' },
    });
    expect(salvo).toMatchObject({
      nome: 'Maria',
      itemId: item.id,
      atendido: false,
    });
  });

  it('não vincula lead a item inativo', async () => {
    const item = await ctx.prisma.item.findUniqueOrThrow({
      where: { slug: 'inativo' },
    });
    await api()
      .post('/leads')
      .send({ ...lead, itemId: item.id })
      .expect(201);
    const salvo = await ctx.prisma.lead.findFirstOrThrow({
      orderBy: { id: 'desc' },
    });
    expect(salvo.itemId).toBeNull();
  });

  it('valida os campos do lead (sem gastar o limite com robôs)', async () => {
    const antes = await ctx.prisma.lead.count();
    await api()
      .post('/leads')
      .send({ ...lead, site: 'http://spam' })
      .expect(201);
    expect(await ctx.prisma.lead.count()).toBe(antes);
  });

  it('lista protegida com filtro por atendido e marcação', async () => {
    await api().get('/leads').expect(401);
    const todos = await api()
      .get('/leads')
      .set('Authorization', token)
      .expect(200);
    expect(todos.body).toMatchObject({ total: 2, pendentes: 2 });

    const id = todos.body.itens[0].id;
    await api()
      .patch(`/leads/${id}`)
      .set('Authorization', token)
      .send({ atendido: true })
      .expect(200);

    const atendidos = await api()
      .get('/leads?atendido=true')
      .set('Authorization', token)
      .expect(200);
    expect(atendidos.body.itens.map((l: { id: number }) => l.id)).toEqual([id]);
    const pendentes = await api()
      .get('/leads?atendido=false')
      .set('Authorization', token)
      .expect(200);
    expect(pendentes.body.total).toBe(1);
  });
});
