import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/** Configuração compartilhada entre o main.ts e os testes e2e. */
export function configurarApp(app: INestApplication) {
  const config = app.get(ConfigService);

  // Atrás do proxy do Render: necessário para o throttler enxergar o IP real
  (app as NestExpressApplication).set('trust proxy', 1);

  const origens = config
    .get<string>('CORS_ORIGINS', '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({ origin: origens, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const doc = new DocumentBuilder()
    .setTitle('Vitrine API')
    .setDescription('API do site + painel de vitrine')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, doc));

  app.enableShutdownHooks();
  return app;
}
