import { NextResponse, type NextRequest } from 'next/server';
import { tokenExpirado } from './lib/jwt';

const COOKIE_SESSAO = 'vitrine_sessao';

/**
 * Porteiro do painel: sem sessão válida, manda para o login.
 * É uma checagem rápida; a assinatura do token é conferida pela API em cada chamada.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const logado = !tokenExpirado(request.cookies.get(COOKIE_SESSAO)?.value);
  const naTelaDeLogin = pathname === '/painel/login';

  if (!logado && !naTelaDeLogin) {
    const url = new URL('/painel/login', request.url);
    url.searchParams.set('de', pathname + search);
    return NextResponse.redirect(url);
  }
  if (logado && naTelaDeLogin) {
    return NextResponse.redirect(new URL('/painel', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/painel', '/painel/:path*'],
};
