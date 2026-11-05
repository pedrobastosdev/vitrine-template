import { ConfigService } from '@nestjs/config';
import { RevalidacaoService, TAGS } from './revalidacao.service.js';

const criar = (env: Record<string, string>) =>
  new RevalidacaoService(new ConfigService(env));

describe('RevalidacaoService', () => {
  const fetchFalso = vi.fn(async () => new Response(null, { status: 200 }));

  beforeEach(() => {
    fetchFalso.mockClear();
    vi.stubGlobal('fetch', fetchFalso);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('chama /api/revalidate do Next com o segredo e as tags sem repetição', () => {
    criar({ WEB_URL: 'https://site.com/', REVALIDATE_SECRET: 's3gr3do' }).revalidar(
      TAGS.itens,
      TAGS.item('casa'),
      TAGS.itens,
    );
    expect(fetchFalso).toHaveBeenCalledWith(
      'https://site.com/api/revalidate',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'x-revalidate-secret': 's3gr3do' }),
        body: JSON.stringify({ tags: ['itens', 'item-casa'] }),
      }),
    );
  });

  it('não chama nada sem WEB_URL ou sem segredo', () => {
    criar({ WEB_URL: '', REVALIDATE_SECRET: 'x' }).revalidar('itens');
    criar({ WEB_URL: 'https://site.com', REVALIDATE_SECRET: '' }).revalidar('itens');
    expect(fetchFalso).not.toHaveBeenCalled();
  });
});
