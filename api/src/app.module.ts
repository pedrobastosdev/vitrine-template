import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module.js';
import { validarEnv } from './config/env.js';
import { ImagensModule } from './imagens/imagens.module.js';
import { ItensModule } from './itens/itens.module.js';
import { LeadsModule } from './leads/leads.module.js';
import { NegocioModule } from './negocio/negocio.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { RevalidacaoModule } from './revalidacao/revalidacao.module.js';
import { SaudeController } from './saude/saude.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validarEnv }),
    // O guard não é global: as páginas do Next consultam a API pelo servidor,
    // todas do mesmo IP. O limite vale só onde é aplicado (leads e login).
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'default',
          limit: config.getOrThrow<number>('LEADS_LIMITE'),
          ttl: config.getOrThrow<number>('LEADS_JANELA_SEGUNDOS') * 1000,
        },
      ],
    }),
    PrismaModule,
    RevalidacaoModule,
    ImagensModule,
    AuthModule,
    NegocioModule,
    ItensModule,
    LeadsModule,
  ],
  controllers: [SaudeController],
})
export class AppModule {}
