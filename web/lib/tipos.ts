export interface Negocio {
  id: number;
  nome: string;
  slogan: string;
  logoUrl: string | null;
  corPrimaria: string;
  corSecundaria: string;
  estiloTitulo: 'sans' | 'serifa';
  whatsapp: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  instagram: string;
  rotuloItens: string;
  heroTitulo: string;
  heroSubtitulo: string;
  heroImagemUrl: string | null;
  sobreTitulo: string;
  sobreTexto: string;
  atualizadoEm: string;
}

export interface Categoria {
  id: number;
  nome: string;
  slug: string;
  ordem: number;
  totalItens: number;
}

export interface Atributo {
  id?: number;
  nome: string;
  valor: string;
  ordem?: number;
}

export interface ItemCard {
  id: number;
  titulo: string;
  slug: string;
  preco: string | null;
  destaque: boolean;
  categoria: { id: number; nome: string; slug: string };
  atributos: Atributo[];
  capa: string | null;
}

export interface Imagem {
  id: number;
  url: string;
  ordem: number;
  capa: boolean;
}

export interface ItemCompleto {
  id: number;
  titulo: string;
  slug: string;
  descricao: string;
  preco: string | null;
  destaque: boolean;
  ativo: boolean;
  categoriaId: number;
  categoria: { id: number; nome: string; slug: string };
  imagens: Imagem[];
  atributos: Atributo[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface Pagina<T> {
  itens: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export interface Lead {
  id: number;
  nome: string;
  telefone: string;
  mensagem: string;
  atendido: boolean;
  criadoEm: string;
  item: { id: number; titulo: string; slug: string } | null;
}
