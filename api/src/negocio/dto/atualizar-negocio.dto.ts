import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

const HEX = /^#[0-9a-fA-F]{6}$/;

export const ACOES_PRINCIPAIS = ['whatsapp', 'ligar', 'catalogo'] as const;
export type AcaoPrincipal = (typeof ACOES_PRINCIPAIS)[number];

/** Um fato curto sobre o negócio, mostrado na home (ex.: "Atendimento" / "24h"). */
export class FatoDto {
  @ApiProperty({ example: 'Atendimento' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  rotulo: string;

  @ApiProperty({ example: '24 horas, todos os dias' })
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  valor: string;
}

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

  @ApiPropertyOptional({
    example: 'imóvel',
    description: 'Nome de um item, no singular',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  rotuloItem?: string;

  @ApiPropertyOptional({
    enum: ACOES_PRINCIPAIS,
    description: 'Botão mais forte do site. "ligar" exige telefone.',
  })
  @IsOptional()
  @IsIn(ACOES_PRINCIPAIS)
  acaoPrincipal?: AcaoPrincipal;

  @ApiPropertyOptional({
    example: 'Agendar visita',
    description: 'Botão da página do item',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(24)
  ctaItem?: string;

  @ApiPropertyOptional({
    type: [FatoDto],
    description: 'Até 4, na ordem de exibição',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => FatoDto)
  fatos?: FatoDto[];
}
