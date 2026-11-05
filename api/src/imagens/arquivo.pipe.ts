import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { validarArquivo } from './validacao.js';

@Injectable()
export class ArquivoImagemPipe implements PipeTransform {
  transform(arquivo?: Express.Multer.File) {
    const r = validarArquivo(arquivo);
    if (r.ok) return arquivo!;
    if (r.motivo === 'tamanho') throw new PayloadTooLargeException(r.mensagem);
    if (r.motivo === 'tipo')
      throw new UnsupportedMediaTypeException(r.mensagem);
    throw new BadRequestException(r.mensagem);
  }
}
