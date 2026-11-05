import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CriarCategoriaDto {
  @ApiProperty({ example: 'Apartamentos' })
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  nome: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  ordem?: number;
}

export class AtualizarCategoriaDto extends PartialType(CriarCategoriaDto) {}
