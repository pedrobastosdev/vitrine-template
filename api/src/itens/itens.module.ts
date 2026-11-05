import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller.js';
import { CategoriasService } from './categorias.service.js';
import { ItensController } from './itens.controller.js';
import { ItensService } from './itens.service.js';

@Module({
  controllers: [CategoriasController, ItensController],
  providers: [CategoriasService, ItensService],
  exports: [ItensService],
})
export class ItensModule {}
