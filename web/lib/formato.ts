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
