import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginacaoDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina = 1;

  @ApiPropertyOptional({ default: 12, maximum: 48 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(48)
  porPagina = 12;
}

export function paginar<T>(itens: T[], total: number, p: PaginacaoDto) {
  return {
    itens,
    total,
    pagina: p.pagina,
    porPagina: p.porPagina,
    totalPaginas: Math.max(1, Math.ceil(total / p.porPagina)),
  };
}
