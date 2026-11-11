'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface Estado {
  mensagem: string | null;
  /** A página tem a própria barra de contato no celular; o botão flutuante sai do caminho. */
  barra: boolean;
}

const Contexto = createContext<{ estado: Estado; definir: (e: Estado) => void }>({
  estado: { mensagem: null, barra: false },
  definir: () => {},
});

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [estado, definir] = useState<Estado>({ mensagem: null, barra: false });
  return <Contexto.Provider value={{ estado, definir }}>{children}</Contexto.Provider>;
}

export const useMensagemWhatsApp = () => useContext(Contexto).estado;

/** Coloque numa página para o botão flutuante usar uma mensagem específica. */
export function MensagemWhatsApp({ mensagem, barra = false }: { mensagem: string; barra?: boolean }) {
  const { definir } = useContext(Contexto);
  useEffect(() => {
    definir({ mensagem, barra });
    return () => definir({ mensagem: null, barra: false });
  }, [mensagem, barra, definir]);
  return null;
}
