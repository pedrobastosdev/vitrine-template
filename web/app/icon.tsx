import { ImageResponse } from 'next/og';
import { corDoTexto } from '@/lib/cor';
import { negocioOuPadrao } from '@/lib/negocio';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Favicon gerado com as iniciais e a cor do negócio. */
export default async function Icone() {
  const { negocio } = await negocioOuPadrao();
  const iniciais = negocio.nome
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          background: negocio.corPrimaria,
          color: corDoTexto(negocio.corPrimaria),
          fontSize: 30,
          fontWeight: 800,
        }}
      >
        {iniciais}
      </div>
    ),
    size,
  );
}
