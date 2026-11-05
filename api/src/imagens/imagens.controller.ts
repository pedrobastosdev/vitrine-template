import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Protegido } from '../auth/protegido.decorator.js';
import { ArquivoImagemPipe } from './arquivo.pipe.js';
import { OrdenarImagensDto } from './dto/ordem.dto.js';
import { ImagensService } from './imagens.service.js';
import { UploadDeImagem } from './upload.decorator.js';

@ApiTags('imagens')
@Controller('itens/:id/imagens')
@Protegido()
export class ImagensController {
  constructor(private readonly imagens: ImagensService) {}

  @Post()
  @UploadDeImagem()
  @ApiOperation({ summary: 'Envia uma foto (jpg, png ou webp, até 5 MB)' })
  async enviar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(ArquivoImagemPipe) arquivo: Express.Multer.File,
  ) {
    return (await this.imagens.adicionar(id, arquivo)).imagem;
  }

  @Put('ordem')
  @ApiOperation({ summary: 'Reordena as fotos do item' })
  async ordenar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: OrdenarImagensDto,
  ) {
    return (await this.imagens.ordenar(id, dto.ids)).imagens;
  }

  @Patch(':imagemId/capa')
  @ApiOperation({ summary: 'Define a foto de capa (única por item)' })
  async capa(
    @Param('id', ParseIntPipe) id: number,
    @Param('imagemId', ParseIntPipe) imagemId: number,
  ) {
    return (await this.imagens.definirCapa(id, imagemId)).imagens;
  }

  @Delete(':imagemId')
  @ApiOperation({ summary: 'Remove a foto do item e do Cloudinary' })
  async remover(
    @Param('id', ParseIntPipe) id: number,
    @Param('imagemId', ParseIntPipe) imagemId: number,
  ) {
    return (await this.imagens.remover(id, imagemId)).imagens;
  }
}
