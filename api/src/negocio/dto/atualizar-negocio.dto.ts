import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

const HEX = /^#[0-9a-fA-F]{6}$/;

export class AtualizarNegocioDto {
  @ApiProperty({ example: 'Morada Clara Imóveis' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  nome: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  slogan?: string;

  @ApiProperty({ example: '#1f4e5f' })
  @Matches(HEX, { message: 'corPrimaria deve estar no formato #RRGGBB' })
  corPrimaria: string;

  @ApiProperty({ example: '#c8a24a' })
  @Matches(HEX, { message: 'corSecundaria deve estar no formato #RRGGBB' })
  corSecundaria: string;

  @ApiProperty({ enum: ['sans', 'serifa'] })
  @IsIn(['sans', 'serifa'])
  estiloTitulo: 'sans' | 'serifa';

  @ApiProperty({
    example: '5548900000000',
    description: 'Só dígitos, com DDI e DDD',
  })
  @Matches(/^\d{10,15}$/, {
    message: 'whatsapp deve ter só dígitos, com DDI e DDD',
  })
  whatsapp: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf((_, v) => v !== '')
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  endereco?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  cidade?: string;

  @ApiPropertyOptional({ description: 'Usuário do Instagram, sem @' })
  @IsOptional()
  @Matches(/^[\w.]{0,30}$/, {
    message: 'instagram deve ser só o usuário, sem @',
  })
  instagram?: string;

  @ApiProperty({ example: 'Imóveis' })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  rotuloItens: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  heroTitulo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  heroSubtitulo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  sobreTitulo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1500)
  sobreTexto?: string;
}
