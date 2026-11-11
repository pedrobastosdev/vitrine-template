import type { AcaoPrincipal, Negocio } from './tipos';
import { linkWhatsApp } from './whatsapp';

export type Canal = 'ligar' | 'whatsapp';

export interface Acao {
  tipo: AcaoPrincipal;
  href: string;
  rotulo: string;
  /** Abre em outra aba (WhatsApp). */
  externo: boolean;
}

export const linkTelefone = (telefone: string) => `tel:${telefone.replace(/[^\d+]/g, '')}`;

const disponivel = (n: Pick<Negocio, 'whatsapp' | 'telefone'>, tipo: AcaoPrincipal) =>
  tipo === 'catalogo' || (tipo === 'ligar' ? !!n.telefone : !!n.whatsapp);

/**
 * A ação que o dono escolheu, se ela for possível. "ligar" sem telefone vira WhatsApp;
 * sem WhatsApp (API fora do ar), sobra o catálogo.
 */
export function acaoEfetiva(n: Pick<Negocio, 'acaoPrincipal' | 'whatsapp' | 'telefone'>): AcaoPrincipal {
  const ordem: AcaoPrincipal[] = [n.acaoPrincipal, 'whatsapp', 'ligar', 'catalogo'];
  return ordem.find((t) => disponivel(n, t)) ?? 'catalogo';
}

/** O canal de conversa principal (nunca o catálogo), ou null se não houver nenhum. */
export function canalPrincipal(n: Pick<Negocio, 'acaoPrincipal' | 'whatsapp' | 'telefone'>): Canal | null {
  const ordem: Canal[] = n.acaoPrincipal === 'ligar' ? ['ligar', 'whatsapp'] : ['whatsapp', 'ligar'];
  return ordem.find((c) => disponivel(n, c)) ?? null;
}

/**
 * Todas as ações possíveis, a principal primeiro. O catálogo nunca some e os canais
 * seguem a preferência do dono.
 */
export function acoesContato(
  n: Pick<Negocio, 'acaoPrincipal' | 'whatsapp' | 'telefone' | 'nome' | 'rotuloItens'>,
  mensagem = `Olá, ${n.nome}! Vim pelo site e gostaria de ajuda.`,
): Acao[] {
  const todas: Record<AcaoPrincipal, Acao> = {
    ligar: { tipo: 'ligar', href: linkTelefone(n.telefone), rotulo: 'Ligar agora', externo: false },
    whatsapp: { tipo: 'whatsapp', href: linkWhatsApp(n.whatsapp, mensagem), rotulo: 'Chamar no WhatsApp', externo: true },
    catalogo: { tipo: 'catalogo', href: '/itens', rotulo: `Ver ${n.rotuloItens.toLowerCase()}`, externo: false },
  };
  const principal = acaoEfetiva(n);
  const canais = canalPrincipal(n) === 'ligar' ? (['ligar', 'whatsapp'] as const) : (['whatsapp', 'ligar'] as const);
  const ordem: AcaoPrincipal[] = [principal, ...canais, 'catalogo'];
  return [...new Set(ordem)].filter((t) => disponivel(n, t)).map((t) => todas[t]);
}
