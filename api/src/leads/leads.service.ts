import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { paginar } from '../comum/paginacao.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CriarLeadDto, FiltroLeadsDto } from './dto/lead.dto.js';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CriarLeadDto) {
    if (dto.site) return { ok: true }; // robô caiu na armadilha: finge sucesso
    // Só aceita vínculo com item ativo; senão o lead entra sem item
    const item = dto.itemId
      ? await this.prisma.item.findFirst({
          where: { id: dto.itemId, ativo: true },
          select: { id: true },
        })
      : null;
    await this.prisma.lead.create({
      data: {
        nome: dto.nome.trim(),
        telefone: dto.telefone.trim(),
        mensagem: dto.mensagem.trim(),
        itemId: item?.id,
      },
    });
    return { ok: true };
  }

  async listar(filtro: FiltroLeadsDto) {
    const where: Prisma.LeadWhereInput = { atendido: filtro.atendido };
    const [leads, total, pendentes] = await this.prisma.$transaction([
      this.prisma.lead.findMany({
        where,
        include: { item: { select: { id: true, titulo: true, slug: true } } },
        orderBy: [{ atendido: 'asc' }, { criadoEm: 'desc' }],
        skip: (filtro.pagina - 1) * filtro.porPagina,
        take: filtro.porPagina,
      }),
      this.prisma.lead.count({ where }),
      this.prisma.lead.count({ where: { atendido: false } }),
    ]);
    return { ...paginar(leads, total, filtro), pendentes };
  }

  async marcar(id: number, atendido: boolean) {
    const existe = await this.prisma.lead.count({ where: { id } });
    if (!existe) throw new NotFoundException('Lead não encontrado');
    return this.prisma.lead.update({
      where: { id },
      data: { atendido },
      include: { item: { select: { id: true, titulo: true, slug: true } } },
    });
  }

  async remover(id: number) {
    const existe = await this.prisma.lead.count({ where: { id } });
    if (!existe) throw new NotFoundException('Lead não encontrado');
    await this.prisma.lead.delete({ where: { id } });
  }
}
