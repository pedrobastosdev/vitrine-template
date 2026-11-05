import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { gerarSlugUnico } from '../comum/slug.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  AtualizarCategoriaDto,
  CriarCategoriaDto,
} from './dto/categoria.dto.js';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  /** Público: categorias com a contagem de itens ativos. */
  async listar() {
    const categorias = await this.prisma.categoria.findMany({
      orderBy: [{ ordem: 'asc' }, { nome: 'asc' }],
      select: {
        id: true,
        nome: true,
        slug: true,
        ordem: true,
        _count: { select: { itens: { where: { ativo: true } } } },
      },
    });
    return categorias.map(({ _count, ...c }) => ({
      ...c,
      totalItens: _count.itens,
    }));
  }

  private gerarSlug(nome: string, ignorarId?: number) {
    return gerarSlugUnico(
      nome,
      async (slug) =>
        (await this.prisma.categoria.count({
          where: { slug, NOT: ignorarId ? { id: ignorarId } : undefined },
        })) > 0,
      'categoria',
    );
  }

  async criar(dto: CriarCategoriaDto) {
    return this.prisma.categoria.create({
      data: {
        nome: dto.nome,
        ordem: dto.ordem ?? 0,
        slug: await this.gerarSlug(dto.nome),
      },
    });
  }

  async atualizar(id: number, dto: AtualizarCategoriaDto) {
    const atual = await this.prisma.categoria.findUnique({ where: { id } });
    if (!atual) throw new NotFoundException('Categoria não encontrada');
    // Categoria não tem página própria, então o slug pode acompanhar o nome
    const slug =
      dto.nome && dto.nome !== atual.nome
        ? await this.gerarSlug(dto.nome, id)
        : undefined;
    return this.prisma.categoria.update({
      where: { id },
      data: { nome: dto.nome, ordem: dto.ordem, slug },
    });
  }

  async remover(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: { _count: { select: { itens: true } } },
    });
    if (!categoria) throw new NotFoundException('Categoria não encontrada');
    if (categoria._count.itens > 0) {
      throw new ConflictException(
        `A categoria tem ${categoria._count.itens} item(ns). Mova-os para outra categoria antes de excluir.`,
      );
    }
    await this.prisma.categoria.delete({ where: { id } });
    return categoria;
  }
}
