import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configurarApp } from '../src/configurar-app.js';
import { CloudinaryService } from '../src/imagens/cloudinary.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

export const ADMIN = { email: 'admin@teste.com', senha: 'senha-teste' };

/** Cloudinary de mentira: os testes não dependem de rede nem de chaves. */
export function cloudinaryFalso() {
  let n = 0;
  return {
    enviar: vi.fn(async () => {
      n++;
      return {
        url: `https://res.cloudinary.com/teste/image/upload/v1/foto-${n}.jpg`,
        publicId: `teste/foto-${n}`,
      };
    }),
    remover: vi.fn(async () => undefined),
    removerVarias: vi.fn(async () => undefined),
  };
}

export async function criarApp() {
  const cloudinary = cloudinaryFalso();
  const modulo = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(CloudinaryService)
    .useValue(cloudinary)
    .compile();
  const app = configurarApp(
    modulo.createNestApplication(),
  ) as INestApplication<App>;
  await app.init();
  return { app, prisma: app.get(PrismaService), cloudinary };
}

/** Zera o banco e cria o mínimo: usuário, negócio e duas categorias. */
export async function prepararBanco(prisma: PrismaService) {
  await prisma.$executeRawUnsafe(
    'TRUNCATE "Lead", "AtributoItem", "ImagemItem", "Item", "Categoria", "Negocio", "Usuario" RESTART IDENTITY CASCADE',
  );
  await prisma.usuario.create({
    data: { email: ADMIN.email, senhaHash: await bcrypt.hash(ADMIN.senha, 4) },
  });
  await prisma.negocio.create({
    data: { id: 1, nome: 'Negócio Teste', whatsapp: '5511900000000' },
  });
  const casas = await prisma.categoria.create({
    data: { nome: 'Casas', slug: 'casas', ordem: 0 },
  });
  const aptos = await prisma.categoria.create({
    data: { nome: 'Apartamentos', slug: 'apartamentos', ordem: 1 },
  });
  return { casas, aptos };
}

export async function entrar(app: INestApplication<App>) {
  const r = await request(app.getHttpServer())
    .post('/auth/login')
    .send(ADMIN)
    .expect(200);
  return `Bearer ${(r.body as { token: string }).token}`;
}
