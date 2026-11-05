import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaginacaoDto } from '../../comum/paginacao.dto.js';

export class CriarLeadDto {
  @ApiProperty({ example: 'Mariana Souza' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  nome: string;

  @ApiProperty({ example: '(48) 99999-0000' })
  @Matches(/^[\d\s()+-]{8,20}$/, { message: 'Telefone inválido' })
  telefone: string;

  @ApiProperty({ example: 'Gostaria de agendar uma visita.' })
  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  mensagem: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  itemId?: number;

  /** Armadilha para robôs: campo escondido no formulário, humanos deixam vazio. */
  @ApiPropertyOptional({ description: 'Deixe vazio (anti-spam)' })
  @IsOptional()
  @IsString()
  site?: string;
}

export class AtualizarLeadDto {
  @ApiProperty()
  @IsBoolean()
  atendido: boolean;
}

export class FiltroLeadsDto extends PaginacaoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === undefined || value === ''
      ? undefined
      : value === true || value === 'true',
  )
  @IsBoolean()
  atendido?: boolean;
}
