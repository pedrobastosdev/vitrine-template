'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const Contexto = createContext<{
  mensagem: string | null;
  definir: (m: string | null) => void;
}>({ mensagem: null, definir: () => {} });

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [mensagem, definir] = useState<string | null>(null);
  return <Contexto.Provider value={{ mensagem, definir }}>{children}</Contexto.Provider>;
}

export const useMensagemWhatsApp = () => useContext(Contexto);

/** Coloque numa página para o botão flutuante usar uma mensagem específica. */
export function MensagemWhatsApp({ mensagem }: { mensagem: string }) {
  const { definir } = useMensagemWhatsApp();
  useEffect(() => {
    definir(mensagem);
    return () => definir(null);
  }, [mensagem, definir]);
  return null;
}
