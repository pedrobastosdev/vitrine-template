import request from 'supertest';
import { criarApp, entrar, prepararBanco } from './utils.js';

const JPG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4]);

describe('Imagens (e2e)', () => {
  let ctx: Awaited<ReturnType<typeof criarApp>>;
  let token: string;
  let itemId: number;
  const api = () => request(ctx.app.getHttpServer());
  const enviar = () =>
    api()
      .post(`/itens/${itemId}/imagens`)
      .set('Authorization', token)
      .attach('arquivo', JPG, {
        filename: 'foto.jpg',
        contentType: 'image/jpeg',
      });

  beforeAll(async () => {
    ctx = await criarApp();
    const { casas } = await prepararBanco(ctx.prisma);
    token = await entrar(ctx.app);
    const item = await ctx.prisma.item.create({
      data: { titulo: 'Casa', slug: 'casa', categoriaId: casas.id },
    });
    itemId = item.id;
  });
  afterAll(() => ctx.app.close());

  it('primeira foto vira capa e as seguintes não', async () => {
    const a = await enviar().expect(201);
    const b = await enviar().expect(201);
    expect(a.body).toMatchObject({ capa: true, ordem: 0 });
    expect(b.body).toMatchObject({ capa: false, ordem: 1 });
    expect(ctx.cloudinary.enviar).toHaveBeenCalledTimes(2);
  });

  it('recusa tipo não permitido', async () => {
    await api()
      .post(`/itens/${itemId}/imagens`)
      .set('Authorization', token)
      .attach('arquivo', Buffer.from('GIF89a....'), {
        filename: 'x.gif',
        contentType: 'image/gif',
      })
      .expect(415);
  });

  it('troca a capa mantendo só uma', async () => {
    const imagens = await ctx.prisma.imagemItem.findMany({
      where: { itemId },
      orderBy: { ordem: 'asc' },
    });
    const r = await api()
      .patch(`/itens/${itemId}/imagens/${imagens[1].id}/capa`)
      .set('Authorization', token)
      .expect(200);
    expect(r.body.filter((i: { capa: boolean }) => i.capa)).toEqual([
      expect.objectContaining({ id: imagens[1].id }),
    ]);
  });

  it('reordena as fotos', async () => {
    const imagens = await ctx.prisma.imagemItem.findMany({
      where: { itemId },
      orderBy: { ordem: 'asc' },
    });
    const ids = imagens.map((i) => i.id).reverse();
    const r = await api()
      .put(`/itens/${itemId}/imagens/ordem`)
      .set('Authorization', token)
      .send({ ids })
      .expect(200);
    expect(r.body.map((i: { id: number }) => i.id)).toEqual(ids);
  });

  it('remove a capa: apaga no Cloudinary e outra foto assume', async () => {
    const capa = await ctx.prisma.imagemItem.findFirstOrThrow({
      where: { itemId, capa: true },
    });
    const r = await api()
      .delete(`/itens/${itemId}/imagens/${capa.id}`)
      .set('Authorization', token)
      .expect(200);
    expect(ctx.cloudinary.remover).toHaveBeenCalledWith(capa.publicId);
    expect(r.body).toHaveLength(1);
    expect(r.body[0].capa).toBe(true);
  });
});
