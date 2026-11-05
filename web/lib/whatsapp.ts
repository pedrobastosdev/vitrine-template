/** Link wa.me com mensagem pronta. Não depende de servidor nenhum. */
export function linkWhatsApp(numero: string, mensagem?: string): string {
  const digitos = numero.replace(/\D/g, '');
  const texto = mensagem ? `?text=${encodeURIComponent(mensagem)}` : '';
  return `https://wa.me/${digitos}${texto}`;
}

export const mensagemInteresse = (titulo: string) => `Olá! Tenho interesse no item "${titulo}".`;
