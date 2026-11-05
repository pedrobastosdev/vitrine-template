import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Protegido } from '../auth/protegido.decorator.js';
import { ArquivoImagemPipe } from '../imagens/arquivo.pipe.js';
import { UploadDeImagem } from '../imagens/upload.decorator.js';
import { AtualizarNegocioDto } from './dto/atualizar-negocio.dto.js';
import { NegocioService } from './negocio.service.js';

enum CampoImagem {
  logo = 'logo',
  hero = 'hero',
}

@ApiTags('negócio')
@Controller('negocio')
export class NegocioController {
  constructor(private readonly negocio: NegocioService) {}

  @Get()
  obter() {
    return this.negocio.obter();
  }

  @Put()
  @Protegido()
  atualizar(@Body() dto: AtualizarNegocioDto) {
    return this.negocio.atualizar(dto);
  }

  @Post(':campo')
  @Protegido()
  @UploadDeImagem()
  @ApiParam({ name: 'campo', enum: CampoImagem })
  @ApiOperation({ summary: 'Envia o logo ou a imagem de fundo da home' })
  trocarImagem(
    @Param('campo', new ParseEnumPipe(CampoImagem)) campo: CampoImagem,
    @UploadedFile(ArquivoImagemPipe) arquivo: Express.Multer.File,
  ) {
    return this.negocio.trocarImagem(campo, arquivo.buffer);
  }

  @Delete(':campo')
  @Protegido()
  @ApiParam({ name: 'campo', enum: CampoImagem })
  removerImagem(
    @Param('campo', new ParseEnumPipe(CampoImagem)) campo: CampoImagem,
  ) {
    return this.negocio.removerImagem(campo);
  }
}
