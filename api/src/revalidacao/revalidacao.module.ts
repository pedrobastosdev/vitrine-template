import { Global, Module } from '@nestjs/common';
import { RevalidacaoService } from './revalidacao.service.js';

@Global()
@Module({ providers: [RevalidacaoService], exports: [RevalidacaoService] })
export class RevalidacaoModule {}
