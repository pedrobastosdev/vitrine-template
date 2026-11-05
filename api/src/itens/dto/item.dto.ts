import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PaginacaoDto } from '../../comum/paginacao.dto.js';
import { AtributoDto } from './atributo.dto.js';

export class CriarItemDto {
  @ApiProperty({ example: 'Apartamento 3 quartos com vista para o mar' })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  titulo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  descricao?: string;

  @ApiPropertyOptional({ example: 1250000.5, nullable: true })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  preco?: number | null;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  destaque?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty()
  @IsInt()
  categoriaId: number;

  @ApiPropertyOptional({
    type: [AtributoDto],
    description: 'Se enviado, substitui a lista inteira de atributos',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMaxSize(30)
  @Type(() => AtributoDto)
  atributos?: AtributoDto[];
}

export class AtualizarItemDto extends PartialType(CriarItemDto) {}

const paraBooleano = ({ value }: { value: unknown }) =>
  value === undefined ? undefined : value === true || value === 'true';

export class FiltroItensPublicoDto extends PaginacaoDto {
  @ApiPropertyOptional({
    description: 'Slug da categoria',
    example: 'apartamentos',
  })
  @IsOptional()
  @IsString()
  categoria?: string;
}

export class FiltroItensPainelDto extends PaginacaoDto {
  @ApiPropertyOptional({ description: 'Busca no título' })
  @IsOptional()
  @IsString()
  busca?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoriaId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(paraBooleano)
  @IsBoolean()
  ativo?: boolean;
}
