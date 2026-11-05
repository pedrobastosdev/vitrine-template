import { v2 as cloudinary } from 'cloudinary';

/** publicId de imagens que não estão no Cloudinary (ex.: seed sem chaves). */
export const PREFIXO_EXTERNO = 'externo:';

export interface CredenciaisCloudinary {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
}

export function configurarCloudinary(c: CredenciaisCloudinary): boolean {
  if (!c.cloudName || !c.apiKey || !c.apiSecret) return false;
  cloudinary.config({
    cloud_name: c.cloudName,
    api_key: c.apiKey,
    api_secret: c.apiSecret,
    secure: true,
  });
  return true;
}

export { cloudinary };
