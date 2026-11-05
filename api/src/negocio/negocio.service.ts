import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AtualizarNegocioDto } from './dto/atualizar-negocio.dto.js';

export const ID_NEGOCIO = 1;

@Injectable()
export class NegocioService {
  constructor(private readonly prisma: PrismaService) {}

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
}
