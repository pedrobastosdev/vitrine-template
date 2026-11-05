const inteiro = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});
const comCentavos = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Preço vem da API como string (Decimal do Prisma) para não perder centavos. */
export function formatarPreco(preco: string | null | undefined): string {
  if (preco === null || preco === undefined || preco === '') return 'Sob consulta';
  const n = Number(preco);
  if (!Number.isFinite(n)) return 'Sob consulta';
  return Number.isInteger(n) ? inteiro.format(n) : comCentavos.format(n);
}

export function formatarData(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(iso));
}

export function resumir(texto: string, max = 160): string {
  const limpo = texto.replace(/\s+/g, ' ').trim();
  return limpo.length <= max ? limpo : `${limpo.slice(0, max - 1).trimEnd()}…`;
}

/** Máscara simples de telefone brasileiro enquanto a pessoa digita. */
export function mascararTelefone(valor: string): string {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
