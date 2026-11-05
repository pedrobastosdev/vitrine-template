import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { escolherCapa } from './capa.js';
import { CloudinaryService } from './cloudinary.service.js';

export const MAXIMO_IMAGENS_POR_ITEM = 20;

@Injectable()
export class ImagensService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  private async item(itemId: number) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
      select: { id: true, slug: true },
    });
    if (!item) throw new NotFoundException('Item não encontrado');
    return item;
  }

  private listar(itemId: number) {
    return this.prisma.imagemItem.findMany({
      where: { itemId },
      orderBy: { ordem: 'asc' },
      select: { id: true, url: true, ordem: true, capa: true },
    });
  }

  /** Garante uma única capa no item, numa transação. */
  private async aplicarCapa(itemId: number, preferida?: number) {
    const imagens = await this.prisma.imagemItem.findMany({
      where: { itemId },
      select: { id: true, ordem: true, capa: true },
    });
    const capa = escolherCapa(imagens, preferida);
    if (capa === null) return;
    await this.prisma.$transaction([
      this.prisma.imagemItem.updateMany({
        where: { itemId, id: { not: capa } },
        data: { capa: false },
      }),
      this.prisma.imagemItem.update({
        where: { id: capa },
        data: { capa: true },
      }),
    ]);
  }

  async adicionar(itemId: number, arquivo: Express.Multer.File) {
    const item = await this.item(itemId);
    const total = await this.prisma.imagemItem.count({ where: { itemId } });
    if (total >= MAXIMO_IMAGENS_POR_ITEM) {
      throw new BadRequestException(
        `Cada item aceita até ${MAXIMO_IMAGENS_POR_ITEM} fotos.`,
      );
    }
    const enviada = await this.cloudinary.enviar(arquivo.buffer, 'itens');
    const ultima = await this.prisma.imagemItem.findFirst({
      where: { itemId },
      orderBy: { ordem: 'desc' },
      select: { ordem: true },
    });
    const imagem = await this.prisma.imagemItem.create({
      data: { ...enviada, itemId, ordem: (ultima?.ordem ?? -1) + 1 },
      select: { id: true },
    });
    await this.aplicarCapa(itemId);
    const imagens = await this.listar(itemId);
    return { item, imagem: imagens.find((i) => i.id === imagem.id)!, imagens };
  }

  async definirCapa(itemId: number, imagemId: number) {
    const item = await this.item(itemId);
    const existe = await this.prisma.imagemItem.count({
      where: { id: imagemId, itemId },
    });
    if (!existe)
      throw new NotFoundException('Imagem não encontrada neste item');
    await this.aplicarCapa(itemId, imagemId);
    return { item, imagens: await this.listar(itemId) };
  }

  async ordenar(itemId: number, ids: number[]) {
    const item = await this.item(itemId);
    const atuais = await this.prisma.imagemItem.findMany({
      where: { itemId },
      select: { id: true },
    });
    const mesmoConjunto =
      ids.length === atuais.length && atuais.every((a) => ids.includes(a.id));
    if (!mesmoConjunto) {
      throw new BadRequestException(
        'Envie todos os IDs das imagens do item, uma vez cada.',
      );
    }
    await this.prisma.$transaction(
      ids.map((id, ordem) =>
        this.prisma.imagemItem.update({ where: { id }, data: { ordem } }),
      ),
    );
    return { item, imagens: await this.listar(itemId) };
  }

  async remover(itemId: number, imagemId: number) {
    const item = await this.item(itemId);
    const imagem = await this.prisma.imagemItem.findFirst({
      where: { id: imagemId, itemId },
    });
    if (!imagem)
      throw new NotFoundException('Imagem não encontrada neste item');
    // Apaga primeiro no Cloudinary: se falhar, o registro fica e dá para tentar de novo
    await this.cloudinary.remover(imagem.publicId);
    await this.prisma.imagemItem.delete({ where: { id: imagemId } });
    await this.aplicarCapa(itemId);
    return { item, imagens: await this.listar(itemId) };
  }
}
