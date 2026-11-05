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
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Protegido } from '../auth/protegido.decorator.js';
import {
  AtualizarItemDto,
  CriarItemDto,
  FiltroItensPainelDto,
  FiltroItensPublicoDto,
} from './dto/item.dto.js';
import { ItensService } from './itens.service.js';

@ApiTags('itens')
@Controller('itens')
export class ItensController {
  constructor(private readonly itens: ItensService) {}

  @Get()
  @ApiOperation({
    summary: 'Itens ativos, com filtro por categoria e paginação',
  })
  listar(@Query() filtro: FiltroItensPublicoDto) {
    return this.itens.listarPublico(filtro);
  }

  @Get('destaques')
  @ApiOperation({ summary: 'Itens ativos em destaque para a home' })
  destaques() {
    return this.itens.destaques();
  }

  @Get('slugs')
  @ApiOperation({ summary: 'Slugs dos itens ativos (sitemap)' })
  slugs() {
    return this.itens.slugsPublicos();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Item ativo pelo slug' })
  porSlug(@Param('slug') slug: string) {
    return this.itens.porSlugPublico(slug);
  }

  @Get('painel')
  @Protegido()
  @ApiOperation({ summary: 'Todos os itens (inclusive inativos), com busca' })
  listarPainel(@Query() filtro: FiltroItensPainelDto) {
    return this.itens.listarPainel(filtro);
  }

  @Get(':id')
  @Protegido()
  porId(@Param('id', ParseIntPipe) id: number) {
    return this.itens.porId(id);
  }

  @Post()
  @Protegido()
  criar(@Body() dto: CriarItemDto) {
    return this.itens.criar(dto);
  }

  @Patch(':id')
  @Protegido()
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarItemDto,
  ) {
    return (await this.itens.atualizar(id, dto)).atual;
  }

  @Delete(':id')
  @Protegido()
  @HttpCode(204)
  async remover(@Param('id', ParseIntPipe) id: number) {
    await this.itens.remover(id);
  }
}
