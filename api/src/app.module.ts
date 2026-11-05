import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validarEnv } from './config/env.js';
import { SaudeController } from './saude/saude.controller.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate: validarEnv })],
  controllers: [SaudeController],
})
export class AppModule {}
