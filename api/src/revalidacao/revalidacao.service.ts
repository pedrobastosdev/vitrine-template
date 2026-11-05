import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** Tags de cache usadas pelas páginas públicas do Next. */
export const TAGS = {
  negocio: 'negocio',
  categorias: 'categorias',
  itens: 'itens',
  item: (slug: string) => `item-${slug}`,
};

@Injectable()
export class RevalidacaoService {
  private readonly logger = new Logger(RevalidacaoService.name);
  private readonly url: string;
  private readonly segredo: string;

  constructor(config: ConfigService) {
    const base = config.get<string>('WEB_URL', '').replace(/\/$/, '');
    this.url = base ? `${base}/api/revalidate` : '';
    this.segredo = config.get<string>('REVALIDATE_SECRET', '');
  }

  /**
   * Avisa o Next para descartar o cache dessas tags. Não bloqueia a resposta
   * do painel: se o site estiver fora do ar, a mudança já está salva no banco
   * e aparece no próximo ciclo de revalidação.
   */
  revalidar(...tags: string[]) {
    if (!this.url || !this.segredo) return;
    void fetch(this.url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-revalidate-secret': this.segredo,
      },
      body: JSON.stringify({ tags: [...new Set(tags)] }),
      signal: AbortSignal.timeout(5000),
    })
      .then((r) => {
        if (!r.ok) this.logger.warn(`Revalidação respondeu ${r.status}`);
      })
      .catch((e: unknown) =>
        this.logger.warn(`Revalidação falhou: ${String(e)}`),
      );
  }
}
