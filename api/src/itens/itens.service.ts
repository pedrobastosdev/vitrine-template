import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { paginar } from '../comum/paginacao.dto.js';
import { gerarSlugUnico } from '../comum/slug.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  AtualizarItemDto,
  CriarItemDto,
  FiltroItensPainelDto,
  FiltroItensPublicoDto,
} from './dto/item.dto.js';
import { includeCompleto, paraCard, selectCard } from './itens.selects.js';

@Injectable()
export class ItensService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------- Público: sempre filtra ativo = true ----------

  async listarPublico(filtro: FiltroItensPublicoDto) {
    const where: Prisma.ItemWhereInput = {
      ativo: true,
      categoria: filtro.categoria ? { slug: filtro.categoria } : undefined,
    };
    const [itens, total] = await this.prisma.$transaction([
      this.prisma.item.findMany({
        where,
        select: selectCard,
        orderBy: [{ destaque: 'desc' }, { criadoEm: 'desc' }],
        skip: (filtro.pagina - 1) * filtro.porPagina,
        take: filtro.porPagina,
      }),
      this.prisma.item.count({ where }),
    ]);
    return paginar(itens.map(paraCard), total, filtro);
  }

  async destaques(limite = 6) {
    const itens = await this.prisma.item.findMany({
      where: { ativo: true, destaque: true },
      select: selectCard,
      orderBy: { atualizadoEm: 'desc' },
      take: limite,
    });
    return itens.map(paraCard);
  }

  async porSlugPublico(slug: string) {
    const item = await this.prisma.item.findFirst({
      where: { slug, ativo: true },
      include: includeCompleto,
    });
    if (!item) throw new NotFoundException('Item não encontrado');
    return item;
  }

  /** Para o sitemap: só o necessário. */
  slugsPublicos() {
    return this.prisma.item.findMany({
      where: { ativo: true },
      select: { slug: true, atualizadoEm: true },
      orderBy: { atualizadoEm: 'desc' },
    });
  }

  // ---------- Painel ----------

  async listarPainel(filtro: FiltroItensPainelDto) {
    const where: Prisma.ItemWhereInput = {
      ativo: filtro.ativo,
      categoriaId: filtro.categoriaId,
      titulo: filtro.busca
        ? { contains: filtro.busca, mode: 'insensitive' }
        : undefined,
    };
    const [itens, total] = await this.prisma.$transaction([
      this.prisma.item.findMany({
        where,
        select: {
          ...selectCard,
          ativo: true,
          atualizadoEm: true,
          _count: { select: { imagens: true } },
        },
        orderBy: { atualizadoEm: 'desc' },
        skip: (filtro.pagina - 1) * filtro.porPagina,
        take: filtro.porPagina,
      }),
      this.prisma.item.count({ where }),
    ]);
    return paginar(
      itens.map(({ _count, ...i }) => ({
        ...paraCard(i),
        ativo: i.ativo,
        atualizadoEm: i.atualizadoEm,
        totalImagens: _count.imagens,
      })),
      total,
      filtro,
    );
  }

  async porId(id: number) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: includeCompleto,
    });
    if (!item) throw new NotFoundException('Item não encontrado');
    return item;
  }

  private gerarSlug(titulo: string) {
    return gerarSlugUnico(
      titulo,
      async (slug) => (await this.prisma.item.count({ where: { slug } })) > 0,
    );
  }

  private async garantirCategoria(categoriaId?: number) {
    if (categoriaId === undefined) return;
    const existe = await this.prisma.categoria.count({
      where: { id: categoriaId },
    });
    if (!existe) throw new BadRequestException('Categoria inexistente');
  }

  async criar(dto: CriarItemDto) {
    await this.garantirCategoria(dto.categoriaId);
    const slug = await this.gerarSlug(dto.titulo);
    const item = await this.prisma.item.create({
      data: {
        titulo: dto.titulo,
        slug,
        descricao: dto.descricao ?? '',
        preco: dto.preco ?? null,
        destaque: dto.destaque ?? false,
        ativo: dto.ativo ?? true,
        categoriaId: dto.categoriaId,
      },
    });
    return this.porId(item.id);
  }

  /**
   * O slug não muda quando o título é editado: links já compartilhados
   * no WhatsApp e indexados pelo Google continuam funcionando.
   */
  async atualizar(id: number, dto: AtualizarItemDto) {
    const anterior = await this.porId(id);
    await this.garantirCategoria(dto.categoriaId);
    await this.prisma.item.update({
      where: { id },
      data: {
        titulo: dto.titulo,
        descricao: dto.descricao,
        preco: dto.preco,
        destaque: dto.destaque,
        ativo: dto.ativo,
        categoriaId: dto.categoriaId,
      },
    });
    return { anterior, atual: await this.porId(id) };
  }

  async remover(id: number) {
    const item = await this.porId(id);
    await this.prisma.item.delete({ where: { id } });
    return item;
  }
}
