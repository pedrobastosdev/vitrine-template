import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CabecalhoPagina, SkeletonLista } from '@/components/painel/comum';
import { FormNegocio } from '@/components/painel/form-negocio';
import { UploadImagemNegocio } from '@/components/painel/upload-imagem-negocio';
import { api } from '@/lib/sessao';
import type { Negocio } from '@/lib/tipos';

export const metadata: Metadata = { title: 'Configurações' };

async function Conteudo() {
  // Busca sem cache: o painel precisa sempre do valor mais recente
  const n = await api<Negocio>('/negocio');
  return (
    <FormNegocio
      valores={{
        nome: n.nome,
        slogan: n.slogan,
        corPrimaria: n.corPrimaria,
        corSecundaria: n.corSecundaria,
        estiloTitulo: n.estiloTitulo,
        whatsapp: n.whatsapp,
        telefone: n.telefone,
        email: n.email,
        endereco: n.endereco,
        cidade: n.cidade,
        instagram: n.instagram,
        rotuloItens: n.rotuloItens,
        heroTitulo: n.heroTitulo,
        heroSubtitulo: n.heroSubtitulo,
        sobreTitulo: n.sobreTitulo,
        sobreTexto: n.sobreTexto,
      }}
      uploads={
        <>
          <UploadImagemNegocio campo="logo" url={n.logoUrl} rotulo="Logo" ajuda="Quadrado, PNG com fundo transparente fica melhor." />
          <UploadImagemNegocio campo="hero" url={n.heroImagemUrl} rotulo="Imagem do topo" ajuda="Foto horizontal que aparece atrás do título da home." />
        </>
      }
    />
  );
}

export default function Configuracoes() {
  return (
    <>
      <CabecalhoPagina titulo="Configurações" descricao="Nome, cores, contatos e textos do site." />
      <Suspense fallback={<SkeletonLista linhas={4} />}>
        <Conteudo />
      </Suspense>
    </>
  );
}
