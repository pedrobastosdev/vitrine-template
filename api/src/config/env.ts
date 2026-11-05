import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(8),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  CLOUDINARY_CLOUD_NAME: z.string().default(''),
  CLOUDINARY_API_KEY: z.string().default(''),
  CLOUDINARY_API_SECRET: z.string().default(''),
  CLOUDINARY_FOLDER: z.string().default('vitrine'),
  WEB_URL: z.string().default(''),
  REVALIDATE_SECRET: z.string().default(''),
  LEADS_LIMITE: z.coerce.number().int().positive().default(5),
  LEADS_JANELA_SEGUNDOS: z.coerce.number().int().positive().default(600),
});

export type Env = z.infer<typeof schema>;

export function validarEnv(config: Record<string, unknown>): Env {
  const resultado = schema.safeParse(config);
  if (!resultado.success) {
    throw new Error(
      `Variáveis de ambiente inválidas:\n${z.prettifyError(resultado.error)}`,
    );
  }
  return resultado.data;
}
