export interface FotoSeed {
  /** ID da foto no Unsplash (images.unsplash.com/photo-<id>) */
  unsplash: string;
  autor: string;
}

export interface ItemSeed {
  titulo: string;
  categoria: string;
  descricao: string;
  preco: string | null;
  destaque: boolean;
  atributos: [nome: string, valor: string][];
  fotos: FotoSeed[];
}

export interface DadosSeed {
  negocio: {
    nome: string;
    slogan: string;
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
    rotuloItem: string;
    acaoPrincipal: 'whatsapp' | 'ligar' | 'catalogo';
    ctaItem: string;
    fatos: { rotulo: string; valor: string }[];
    heroTitulo: string;
    heroSubtitulo: string;
    heroFoto: FotoSeed;
    sobreTitulo: string;
    sobreTexto: string;
  };
  categorias: string[];
  itens: ItemSeed[];
  leads: { nome: string; telefone: string; mensagem: string; item?: string }[];
}
