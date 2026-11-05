import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Painel', template: '%s | Painel' },
  robots: { index: false, follow: false },
};

export default function PainelRaiz({ children }: LayoutProps<'/painel'>) {
  return <div className="min-h-dvh bg-muted/40">{children}</div>;
}
