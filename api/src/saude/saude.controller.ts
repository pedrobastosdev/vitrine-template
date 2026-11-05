import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('saúde')
@Controller('saude')
export class SaudeController {
  /** Usado pelo health check do Render e para "acordar" a API. */
  @Get()
  verificar() {
    return { ok: true };
  }
}
