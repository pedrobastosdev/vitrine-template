import { z } from 'zod';

const texto = (min: number, max: number, campo: string) =>
  z
    .string()
    .trim()
    .min(min, min === 1 ? `Preencha ${campo}` : `${campo} precisa de pelo menos ${min} caracteres`)
    .max(max, `${campo} pode ter no máximo ${max} caracteres`);

export const telefoneSchema = z
  .string()
  .trim()
  .refine((v) => v.replace(/\D/g, '').length >= 10, 'Informe o telefone com DDD');

// ---------- Site ----------

export const leadSchema = z.object({
  nome: texto(2, 80, 'O nome'),
  telefone: telefoneSchema,
  mensagem: texto(2, 1000, 'A mensagem'),
  itemId: z.number().int().optional(),
  site: z.string().max(0).optional(), // armadilha anti-robô
});
export type LeadForm = z.infer<typeof leadSchema>;

// ---------- Painel ----------

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido'),
  senha: z.string().min(1, 'Informe a senha'),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const categoriaSchema = z.object({
  nome: texto(2, 60, 'O nome'),
});
export type CategoriaForm = z.infer<typeof categoriaSchema>;

/** Converte "1.250.000,50" ou "1250000.5" em número; vazio vira null. */
export function lerPreco(valor: string): number | null {
  const limpo = valor.replace(/[R$\s]/g, '');
  if (!limpo) return null;
  const normalizado = limpo.includes(',') ? limpo.replace(/\./g, '').replace(',', '.') : limpo;
  const n = Number(normalizado);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : NaN;
}

export const atributoSchema = z.object({
  nome: texto(1, 40, 'o nome do atributo'),
  valor: texto(1, 120, 'o valor do atributo'),
});

export const itemSchema = z.object({
  titulo: texto(3, 120, 'O título'),
  descricao: z.string().trim().max(5000, 'A descrição pode ter no máximo 5000 caracteres'),
  preco: z
    .string()
    .trim()
    .refine((v) => {
      const n = lerPreco(v);
      return n === null || (!Number.isNaN(n) && n >= 0);
    }, 'Preço inválido. Use só números, ex.: 1250000,00'),
  categoriaId: z.number({ error: 'Escolha uma categoria' }).int().positive('Escolha uma categoria'),
  destaque: z.boolean(),
  ativo: z.boolean(),
  atributos: z.array(atributoSchema).max(30, 'Use no máximo 30 atributos'),
});
export type ItemForm = z.infer<typeof itemSchema>;

const corHex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use o formato #RRGGBB');

export const negocioSchema = z.object({
  nome: texto(2, 80, 'O nome'),
  slogan: z.string().trim().max(120),
  corPrimaria: corHex,
  corSecundaria: corHex,
  estiloTitulo: z.enum(['sans', 'serifa']),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .pipe(z.string().regex(/^\d{12,13}$/, 'Use DDI + DDD + número, ex.: 5548999990000')),
  telefone: z.string().trim().max(30),
  email: z.union([z.literal(''), z.email('E-mail inválido')]),
  endereco: z.string().trim().max(200),
  cidade: z.string().trim().max(80),
  instagram: z
    .string()
    .trim()
    .transform((v) => v.replace(/^@/, ''))
    .pipe(z.string().regex(/^[\w.]{0,30}$/, 'Só o usuário, sem @ e sem link')),
  rotuloItens: texto(2, 30, 'O nome do catálogo'),
  heroTitulo: z.string().trim().max(120),
  heroSubtitulo: z.string().trim().max(300),
  sobreTitulo: z.string().trim().max(120),
  sobreTexto: z.string().trim().max(1500),
});
export type NegocioForm = z.input<typeof negocioSchema>;
