import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { TAMANHO_MAXIMO_BYTES } from './validacao.js';

/** Multer em memória: o arquivo vai direto para o Cloudinary, sem tocar no disco. */
export const UploadDeImagem = () =>
  applyDecorators(
    UseInterceptors(
      FileInterceptor('arquivo', {
        storage: memoryStorage(),
        limits: { fileSize: TAMANHO_MAXIMO_BYTES, files: 1 },
      }),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['arquivo'],
        properties: { arquivo: { type: 'string', format: 'binary' } },
      },
    }),
  );
