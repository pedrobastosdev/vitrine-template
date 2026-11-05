import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayUnique, IsArray, IsInt } from 'class-validator';

export class OrdenarImagensDto {
  @ApiProperty({ type: [Number], description: 'IDs das imagens na nova ordem' })
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(50)
  @IsInt({ each: true })
  ids: number[];
}
