import bcrypt from 'bcryptjs';
import { slugify } from '../../src/comum/slug.js';
import { criarPrismaClient } from '../../src/prisma/criar-cliente.js';
import {
  PREFIXO_EXTERNO,
  cloudinary,
  configurarCloudinary,
} from '../../src/imagens/cloudinary.js';
import type { DadosSeed, FotoSeed } from './tipos.js';

const urlUnsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1920&q=80&fm=jpg`;

export async function executarSeed(nome: string, dados: DadosSeed) {
  const prisma = criarPrismaClient(process.env.DATABASE_URL!);
  const pasta = process.env.CLOUDINARY_FOLDER || 'vitrine';
  const usaCloudinary = configurarCloudinary({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  });

  if (!usaCloudinary) {
    console.warn(
      '⚠ Cloudinary não configurado: as fotos vão apontar direto para o Unsplash.',
    );
  }

  async function enviarFoto(foto: FotoSeed, publicId: string) {
    if (!usaCloudinary) {
      return {
        url: urlUnsplash(foto.unsplash),
        publicId: PREFIXO_EXTERNO + foto.unsplash,
      };
    }
    const r = await cloudinary.uploader.upload(urlUnsplash(foto.unsplash), {
      folder: `${pasta}/seed`,
      public_id: publicId,
      overwrite: true,
      transformation: [{ width: 1920, crop: 'limit', quality: 'auto' }],
    });
    return { url: r.secure_url, publicId: r.public_id };
  }

  try {
    console.log(`→ Seed "${nome}": apagando dados antigos...`);
    if (usaCloudinary) {
      const antigas = await prisma.imagemItem.findMany({
        select: { publicId: true },
      });
      const daApi = antigas
        .map((i) => i.publicId)
        .filter(
          (id) => !id.startsWith(PREFIXO_EXTERNO) && !id.includes('/seed/'),
        );
      if (daApi.length)
        await cloudinary.api.delete_resources(daApi).catch(() => null);
    }
    await prisma.$transaction([
      prisma.lead.deleteMany(),
      prisma.atributoItem.deleteMany(),
      prisma.imagemItem.deleteMany(),
      prisma.item.deleteMany(),
      prisma.categoria.deleteMany(),
      prisma.negocio.deleteMany(),
      prisma.usuario.deleteMany(),
    ]);

    const email = process.env.ADMIN_EMAIL || 'admin@demo.com';
    const senha = process.env.ADMIN_PASSWORD || 'demo1234';
    await prisma.usuario.create({
      data: {
        email,
        nome: 'Dono do negócio',
        senhaHash: await bcrypt.hash(senha, 10),
      },
    });

    const { heroFoto, ...negocio } = dados.negocio;
    const hero = await enviarFoto(heroFoto, 'hero');
    await prisma.negocio.create({
      data: {
        id: 1,
        ...negocio,
        heroImagemUrl: hero.url,
        heroPublicId: hero.publicId,
      },
    });

    const categorias = new Map<string, number>();
    for (const [ordem, nomeCategoria] of dados.categorias.entries()) {
      const c = await prisma.categoria.create({
        data: { nome: nomeCategoria, slug: slugify(nomeCategoria), ordem },
      });
      categorias.set(nomeCategoria, c.id);
    }

    const itens = new Map<string, number>();
    for (const item of dados.itens) {
      const slug = slugify(item.titulo);
      console.log(`  • ${item.titulo} (${item.fotos.length} ${item.fotos.length === 1 ? 'foto' : 'fotos'})`);
      const imagens = await Promise.all(
        item.fotos.map((f, i) => enviarFoto(f, `${slug}-${i + 1}`)),
      );
      const criado = await prisma.item.create({
        data: {
          titulo: item.titulo,
          slug,
          descricao: item.descricao,
          preco: item.preco,
          destaque: item.destaque,
          categoriaId: categorias.get(item.categoria)!,
          atributos: {
            create: item.atributos.map(([n, valor], ordem) => ({
              nome: n,
              valor,
              ordem,
            })),
          },
          imagens: {
            create: imagens.map((img, ordem) => ({
              ...img,
              ordem,
              capa: ordem === 0,
            })),
          },
        },
      });
      itens.set(item.titulo, criado.id);
    }

    for (const lead of dados.leads) {
      await prisma.lead.create({
        data: {
          nome: lead.nome,
          telefone: lead.telefone,
          mensagem: lead.mensagem,
          itemId: lead.item ? itens.get(lead.item) : undefined,
        },
      });
    }

    console.log(`✓ Pronto! Login do painel: ${email} / ${senha}`);
  } finally {
    await prisma.$disconnect();
  }
}
