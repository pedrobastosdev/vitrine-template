import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.e2e-spec.ts'],
    // Um arquivo por vez: todos compartilham o mesmo banco de teste
    fileParallelism: false,
    hookTimeout: 30000,
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL_TEST ??
        'postgresql://vitrine:vitrine@localhost:5441/vitrine_test',
      JWT_SECRET: 'segredo-de-teste',
      JWT_EXPIRES_IN: '1h',
      CORS_ORIGINS: 'http://localhost:3000',
      CLOUDINARY_CLOUD_NAME: '',
      CLOUDINARY_API_KEY: '',
      CLOUDINARY_API_SECRET: '',
      CLOUDINARY_FOLDER: 'vitrine-test',
      WEB_URL: '',
      REVALIDATE_SECRET: 'segredo-de-teste',
      LEADS_LIMITE: '3',
      LEADS_JANELA_SEGUNDOS: '60',
    },
  },
});
