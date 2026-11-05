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
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Protegido } from '../auth/protegido.decorator.js';
import {
  AtualizarLeadDto,
  CriarLeadDto,
  FiltroLeadsDto,
} from './dto/lead.dto.js';
import { LeadsService } from './leads.service.js';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @ApiOperation({
    summary: 'Formulário de contato do site (limite de envios por IP)',
  })
  @ApiTooManyRequestsResponse({ description: 'Muitos envios do mesmo IP' })
  criar(@Body() dto: CriarLeadDto) {
    return this.leads.criar(dto);
  }

  @Get()
  @Protegido()
  listar(@Query() filtro: FiltroLeadsDto) {
    return this.leads.listar(filtro);
  }

  @Patch(':id')
  @Protegido()
  marcar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarLeadDto) {
    return this.leads.marcar(id, dto.atendido);
  }

  @Delete(':id')
  @Protegido()
  @HttpCode(204)
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.leads.remover(id);
  }
}
