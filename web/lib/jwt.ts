/** Lê a validade de um JWT sem verificar a assinatura (quem verifica é a API). */
export function tokenExpirado(token: string | undefined, agoraMs = Date.now()): boolean {
  if (!token) return true;
  const partes = token.split('.');
  if (partes.length !== 3) return true;
  try {
    const json = atob(partes[1].replace(/-/g, '+').replace(/_/g, '/'));
    const { exp } = JSON.parse(json) as { exp?: number };
    return typeof exp !== 'number' || exp * 1000 <= agoraMs;
  } catch {
    return true;
  }
}
