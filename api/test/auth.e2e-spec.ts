import request from 'supertest';
import { ADMIN, criarApp, entrar, prepararBanco } from './utils.js';

describe('Auth (e2e)', () => {
  let ctx: Awaited<ReturnType<typeof criarApp>>;

  beforeAll(async () => {
    ctx = await criarApp();
    await prepararBanco(ctx.prisma);
  });
  afterAll(() => ctx.app.close());

  it('faz login com e-mail e senha corretos', async () => {
    const r = await request(ctx.app.getHttpServer())
      .post('/auth/login')
      .send(ADMIN)
      .expect(200);
    expect(r.body.token).toEqual(expect.any(String));
    expect(r.body.usuario).toMatchObject({ email: ADMIN.email });
    expect(r.body.usuario.senhaHash).toBeUndefined();
  });

  it('recusa senha errada com 401', async () => {
    await request(ctx.app.getHttpServer())
      .post('/auth/login')
      .send({ ...ADMIN, senha: 'errada' })
      .expect(401);
  });

  it('recusa e-mail inexistente com a mesma mensagem', async () => {
    const r = await request(ctx.app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'ninguem@teste.com', senha: 'x' })
      .expect(401);
    expect(r.body.message).toBe('E-mail ou senha inválidos');
  });

  it('bloqueia rota protegida sem token e libera com token', async () => {
    await request(ctx.app.getHttpServer()).get('/auth/eu').expect(401);
    await request(ctx.app.getHttpServer()).put('/negocio').send({}).expect(401);
    const token = await entrar(ctx.app);
    const r = await request(ctx.app.getHttpServer())
      .get('/auth/eu')
      .set('Authorization', token)
      .expect(200);
    expect(r.body.email).toBe(ADMIN.email);
  });
});
