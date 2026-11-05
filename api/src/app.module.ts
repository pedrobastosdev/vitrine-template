import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module.js';
import { validarEnv } from './config/env.js';
import { ImagensModule } from './imagens/imagens.module.js';
import { ItensModule } from './itens/itens.module.js';
import { NegocioModule } from './negocio/negocio.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SaudeController } from './saude/saude.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validarEnv }),
    ThrottlerModule.forRoot([{ name: 'default', limit: 120, ttl: 60_000 }]),
    PrismaModule,
    ImagensModule,
    AuthModule,
    NegocioModule,
    ItensModule,
  ],
  controllers: [SaudeController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
