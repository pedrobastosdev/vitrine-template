import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '../imagens/cloudinary.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AtualizarNegocioDto } from './dto/atualizar-negocio.dto.js';

export const ID_NEGOCIO = 1;

@Injectable()
export class NegocioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async obter() {
    const negocio = await this.prisma.negocio.findUnique({
      where: { id: ID_NEGOCIO },
    });
    if (!negocio)
      throw new NotFoundException(
        'Negócio ainda não configurado. Rode o seed.',
      );
    const { logoPublicId: _l, heroPublicId: _h, ...publico } = negocio;
    return publico;
  }

  async atualizar(dto: AtualizarNegocioDto) {
    await this.prisma.negocio.upsert({
      where: { id: ID_NEGOCIO },
      create: Object.assign({ id: ID_NEGOCIO }, dto),
      update: Object.assign({}, dto),
    });
    return this.obter();
  }

  /** Troca o logo ou a imagem do hero, apagando a anterior no Cloudinary. */
  async trocarImagem(campo: 'logo' | 'hero', buffer: Buffer) {
    const atual = await this.prisma.negocio.findUnique({
      where: { id: ID_NEGOCIO },
    });
    if (!atual)
      throw new NotFoundException(
        'Negócio ainda não configurado. Rode o seed.',
      );
    const nova = await this.cloudinary.enviar(buffer, 'negocio');
    const anterior = campo === 'logo' ? atual.logoPublicId : atual.heroPublicId;
    await this.prisma.negocio.update({
      where: { id: ID_NEGOCIO },
      data:
        campo === 'logo'
          ? { logoUrl: nova.url, logoPublicId: nova.publicId }
          : { heroImagemUrl: nova.url, heroPublicId: nova.publicId },
    });
    await this.cloudinary.removerVarias(anterior ? [anterior] : []);
    return this.obter();
  }

  async removerImagem(campo: 'logo' | 'hero') {
    const atual = await this.prisma.negocio.findUnique({
      where: { id: ID_NEGOCIO },
    });
    if (!atual)
      throw new NotFoundException(
        'Negócio ainda não configurado. Rode o seed.',
      );
    const anterior = campo === 'logo' ? atual.logoPublicId : atual.heroPublicId;
    await this.cloudinary.remover(anterior);
    await this.prisma.negocio.update({
      where: { id: ID_NEGOCIO },
      data:
        campo === 'logo'
          ? { logoUrl: null, logoPublicId: null }
          : { heroImagemUrl: null, heroPublicId: null },
    });
    return this.obter();
  }
}
