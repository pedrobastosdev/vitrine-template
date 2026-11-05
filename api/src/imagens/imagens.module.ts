import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service.js';
import { ImagensController } from './imagens.controller.js';
import { ImagensService } from './imagens.service.js';

@Global()
@Module({
  controllers: [ImagensController],
  providers: [CloudinaryService, ImagensService],
  exports: [CloudinaryService],
})
export class ImagensModule {}
