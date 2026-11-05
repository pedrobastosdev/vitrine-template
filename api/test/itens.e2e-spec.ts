import request from 'supertest';
import { criarApp, entrar, prepararBanco } from './utils.js';

describe('Itens e atributos (e2e)', () => {
  let ctx: Awaited<ReturnType<typeof criarApp>>;
  let token: string;
  let categorias: Awaited<ReturnType<typeof prepararBanco>>;
  const api = () => request(ctx.app.getHttpServer());

  beforeAll(async () => {
    ctx = await criarApp();
    categorias = await prepararBanco(ctx.prisma);
    token = await entrar(ctx.app);
  });
  afterAll(() => ctx.app.close());

  it('não cria item sem token', async () => {
    await api()
      .post('/itens')
      .send({ titulo: 'X', categoriaId: 1 })
      .expect(401);
  });

  it('cria item com atributos, slug sem acento e preço decimal', async () => {
    const r = await api()
      .post('/itens')
      .set('Authorization', token)
      .send({
        titulo: 'Casa Térrea São José',
        descricao: 'Ótima casa',
        preco: 450000.5,
        categoriaId: categorias.casas.id,
        destaque: true,
        atributos: [
          { nome: 'Quartos', valor: '3' },
          { nome: 'Área', valor: '120 m²' },
        ],
      })
      .expect(201);

    expect(r.body).toMatchObject({
      slug: 'casa-terrea-sao-jose',
      preco: '450000.5',
      ativo: true,
      categoria: { slug: 'casas' },
    });
    expect(r.body.atributos).toEqual([
      expect.objectContaining({ nome: 'Quartos', valor: '3', ordem: 0 }),
      expect.objectContaining({ nome: 'Área', valor: '120 m²', ordem: 1 }),
    ]);
  });

  it('gera sufixo para título repetido e evita slugs reservados', async () => {
    const repetido = await api()
      .post('/itens')
      .set('Authorization', token)
      .send({
        titulo: 'Casa térrea são josé',
        categoriaId: categorias.casas.id,
      })
      .expect(201);
    expect(repetido.body.slug).toBe('casa-terrea-sao-jose-2');

    const reservado = await api()
      .post('/itens')
      .set('Authorization', token)
      .send({ titulo: 'Contato', categoriaId: categorias.casas.id })
      .expect(201);
    expect(reservado.body.slug).toBe('contato-2');
  });

  it('valida o corpo da requisição', async () => {
    const r = await api()
      .post('/itens')
      .set('Authorization', token)
      .send({
        titulo: 'ab',
        preco: -1,
        categoriaId: categorias.casas.id,
        extra: 1,
      })
      .expect(400);
    expect(r.body.message).toEqual(
      expect.arrayContaining([
        expect.stringContaining('titulo'),
        expect.stringContaining('preco'),
      ]),
    );
  });

  it('PUT de atributos substitui a lista inteira', async () => {
    const item = await ctx.prisma.item.findUniqueOrThrow({
      where: { slug: 'casa-terrea-sao-jose' },
    });
    const r = await api()
      .put(`/itens/${item.id}/atributos`)
      .set('Authorization', token)
      .send({ atributos: [{ nome: 'Vagas', valor: '2' }] })
      .expect(200);
    expect(r.body).toEqual([
      expect.objectContaining({ nome: 'Vagas', valor: '2', ordem: 0 }),
    ]);
    expect(
      await ctx.prisma.atributoItem.count({ where: { itemId: item.id } }),
    ).toBe(1);

    await api()
      .put(`/itens/${item.id}/atributos`)
      .set('Authorization', token)
      .send({ atributos: [] })
      .expect(200);
    expect(
      await ctx.prisma.atributoItem.count({ where: { itemId: item.id } }),
    ).toBe(0);
  });

  it('atualiza o item mantendo o slug', async () => {
    const item = await ctx.prisma.item.findUniqueOrThrow({
      where: { slug: 'casa-terrea-sao-jose' },
    });
    const r = await api()
      .patch(`/itens/${item.id}`)
      .set('Authorization', token)
      .send({ titulo: 'Casa reformada', preco: null })
      .expect(200);
    expect(r.body).toMatchObject({
      titulo: 'Casa reformada',
      slug: 'casa-terrea-sao-jose',
      preco: null,
    });
  });

  describe('rotas públicas', () => {
    let inativo: { id: number; slug: string };

    beforeAll(async () => {
      const r = await api()
        .post('/itens')
        .set('Authorization', token)
        .send({
          titulo: 'Apartamento escondido',
          categoriaId: categorias.aptos.id,
          ativo: false,
          destaque: true,
        })
        .expect(201);
      inativo = r.body;
    });

    it('listagem nunca traz itens inativos', async () => {
      const r = await api().get('/itens?porPagina=48').expect(200);
      const slugs = r.body.itens.map((i: { slug: string }) => i.slug);
      expect(slugs).not.toContain(inativo.slug);
      expect(r.body.total).toBe(3);
    });

    it('destaques nunca trazem itens inativos', async () => {
      const r = await api().get('/itens/destaques').expect(200);
      expect(r.body.map((i: { slug: string }) => i.slug)).not.toContain(
        inativo.slug,
      );
    });

    it('busca por slug de item inativo responde 404', async () => {
      await api().get(`/itens/slug/${inativo.slug}`).expect(404);
    });

    it('sitemap não lista itens inativos', async () => {
      const r = await api().get('/itens/slugs').expect(200);
      expect(r.body.map((i: { slug: string }) => i.slug)).not.toContain(
        inativo.slug,
      );
    });

    it('filtra por categoria pelo slug', async () => {
      const r = await api().get('/itens?categoria=apartamentos').expect(200);
      expect(r.body.itens).toHaveLength(0);
      const casas = await api().get('/itens?categoria=casas').expect(200);
      expect(casas.body.itens).toHaveLength(3);
    });

    it('item fica público quando é ativado', async () => {
      await api()
        .patch(`/itens/${inativo.id}`)
        .set('Authorization', token)
        .send({ ativo: true })
        .expect(200);
      const r = await api().get(`/itens/slug/${inativo.slug}`).expect(200);
      expect(r.body.titulo).toBe('Apartamento escondido');
    });

    it('painel enxerga inativos e filtra por eles', async () => {
      await api()
        .patch(`/itens/${inativo.id}`)
        .set('Authorization', token)
        .send({ ativo: false });
      const r = await api()
        .get('/itens/painel?ativo=false')
        .set('Authorization', token)
        .expect(200);
      expect(r.body.itens.map((i: { id: number }) => i.id)).toEqual([
        inativo.id,
      ]);
    });
  });

  it('categoria com itens não pode ser excluída', async () => {
    await api()
      .delete(`/categorias/${categorias.casas.id}`)
      .set('Authorization', token)
      .expect(409);
  });

  it('exclui item e seus atributos', async () => {
    const item = await ctx.prisma.item.findUniqueOrThrow({
      where: { slug: 'contato-2' },
    });
    await api()
      .delete(`/itens/${item.id}`)
      .set('Authorization', token)
      .expect(204);
    await api()
      .get(`/itens/${item.id}`)
      .set('Authorization', token)
      .expect(404);
  });
});
