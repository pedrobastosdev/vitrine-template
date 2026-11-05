import 'dotenv/config';
import { executarSeed } from './comum.js';
import type { DadosSeed } from './tipos.js';

const seeds: Record<string, () => Promise<{ dados: DadosSeed }>> = {
  imobiliaria: () => import('./imobiliaria.js'),
  guincho: () => import('./guincho.js'),
};

const nome = process.argv[2];
const carregar = nome ? seeds[nome] : undefined;

if (!carregar) {
  console.error(
    `Informe qual seed rodar: npm run seed -- <${Object.keys(seeds).join(' | ')}>`,
  );
  process.exit(1);
}

const { dados } = await carregar();
await executarSeed(nome, dados);
