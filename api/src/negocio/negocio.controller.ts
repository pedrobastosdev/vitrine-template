import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Protegido } from '../auth/protegido.decorator.js';
import { AtualizarNegocioDto } from './dto/atualizar-negocio.dto.js';
import { NegocioService } from './negocio.service.js';

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
}
