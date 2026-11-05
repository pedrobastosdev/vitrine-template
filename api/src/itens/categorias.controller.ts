import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Protegido } from '../auth/protegido.decorator.js';
import { CategoriasService } from './categorias.service.js';
import {
  AtualizarCategoriaDto,
  CriarCategoriaDto,
} from './dto/categoria.dto.js';

@ApiTags('categorias')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categorias: CategoriasService) {}

  @Get()
  listar() {
    return this.categorias.listar();
  }

  @Post()
  @Protegido()
  criar(@Body() dto: CriarCategoriaDto) {
    return this.categorias.criar(dto);
  }

  @Patch(':id')
  @Protegido()
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarCategoriaDto,
  ) {
    return this.categorias.atualizar(id, dto);
  }

  @Delete(':id')
  @Protegido()
  @HttpCode(204)
  async remover(@Param('id', ParseIntPipe) id: number) {
    await this.categorias.remover(id);
  }
}
