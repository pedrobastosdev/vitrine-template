import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { UploadApiResponse } from 'cloudinary';
import {
  PREFIXO_EXTERNO,
  cloudinary,
  configurarCloudinary,
} from './cloudinary.js';

export interface ImagemEnviada {
  url: string;
  publicId: string;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly configurado: boolean;
  private readonly pasta: string;

  constructor(config: ConfigService) {
    this.pasta = config.get('CLOUDINARY_FOLDER', 'vitrine');
    this.configurado = configurarCloudinary({
      cloudName: config.get('CLOUDINARY_CLOUD_NAME'),
      apiKey: config.get('CLOUDINARY_API_KEY'),
      apiSecret: config.get('CLOUDINARY_API_SECRET'),
    });
  }

  enviar(buffer: Buffer, subpasta: string): Promise<ImagemEnviada> {
    if (!this.configurado) {
      throw new ServiceUnavailableException(
        'Cloudinary não configurado. Preencha CLOUDINARY_* no .env da API.',
      );
    }
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `${this.pasta}/${subpasta}`, resource_type: 'image' },
          (erro, r?: UploadApiResponse) => {
            if (erro || !r)
              return reject(
                new ServiceUnavailableException('Falha ao enviar a imagem'),
              );
            resolve({ url: r.secure_url, publicId: r.public_id });
          },
        )
        .end(buffer);
    });
  }

  /** Apaga no Cloudinary. Imagens externas (seed sem chaves) são ignoradas. */
  async remover(publicId: string | null | undefined) {
    if (!publicId || publicId.startsWith(PREFIXO_EXTERNO) || !this.configurado)
      return;
    const r = (await cloudinary.uploader.destroy(publicId)) as {
      result: string;
    };
    if (r.result !== 'ok' && r.result !== 'not found') {
      throw new ServiceUnavailableException(
        'Não foi possível apagar a imagem no Cloudinary',
      );
    }
  }

  /** Remoção em lote sem bloquear quem chamou (ex.: ao excluir um item). */
  async removerVarias(publicIds: string[]) {
    const ids = publicIds.filter((id) => !id.startsWith(PREFIXO_EXTERNO));
    if (!ids.length || !this.configurado) return;
    try {
      await cloudinary.api.delete_resources(ids);
    } catch (e) {
      this.logger.warn(
        `Imagens órfãs no Cloudinary: ${ids.join(', ')} (${String(e)})`,
      );
    }
  }
}
