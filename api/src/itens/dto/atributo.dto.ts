import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class AtributoDto {
  @ApiProperty({ example: 'Quartos' })
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  nome: string;

  @ApiProperty({ example: '3' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  valor: string;
}

export class SalvarAtributosDto {
  @ApiProperty({
    type: [AtributoDto],
    description: 'A lista inteira, na ordem de exibição',
  })
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => AtributoDto)
  atributos: AtributoDto[];
}
