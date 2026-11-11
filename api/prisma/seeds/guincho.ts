import type { DadosSeed } from './tipos.js';

// Negócio fictício. Fotos do Unsplash (licença Unsplash), créditos no README.
export const dados: DadosSeed = {
  negocio: {
    nome: 'Reboque Ágil 24h',
    slogan: 'Guincho e socorro rápido em Curitiba e região',
    corPrimaria: '#facc15',
    corSecundaria: '#111827',
    estiloTitulo: 'sans',
    whatsapp: '5541900000000',
    telefone: '(41) 3000-0000',
    email: 'contato@reboqueagil.exemplo',
    endereco: 'Rodovia BR-116, km 100 - Pinheirinho',
    cidade: 'Curitiba - PR',
    instagram: 'reboqueagil.exemplo',
    rotuloItens: 'Serviços',
    rotuloItem: 'serviço',
    acaoPrincipal: 'ligar',
    ctaItem: 'Chamar guincho',
    fatos: [
      { rotulo: 'Atendimento', valor: '24 horas, inclusive feriados' },
      { rotulo: 'Chegada média', valor: '40 minutos em Curitiba' },
      { rotulo: 'Região', valor: 'Curitiba, região e rodovias' },
      { rotulo: 'Preço', valor: 'Combinado antes de sair' },
    ],
    heroTitulo: 'Seu carro parou? A gente chega rápido.',
    heroSubtitulo:
      'Guincho 24 horas para carros, motos, utilitários e caminhões em Curitiba e região metropolitana. Ligue ou chame no WhatsApp e acompanhe a chegada do motorista.',
    heroFoto: { unsplash: '1730514785075-b065c757b653', autor: 'fr0ggy5' },
    sobreTitulo:
      'Equipe própria, frota rastreada e preço combinado antes de sair',
    sobreTexto:
      'Trabalhamos com motoristas treinados, caminhões revisados e seguro de carga. Você sabe o valor antes do atendimento e acompanha a chegada do guincho em tempo real.',
  },
  categorias: ['Guincho leve', 'Guincho pesado', 'Transporte de veículos'],
  itens: [
    {
      titulo: 'Guincho plataforma para carros e motos',
      categoria: 'Guincho leve',
      descricao:
        'Remoção com plataforma hidráulica, sem arrastar o veículo: ideal para carros rebaixados, automáticos e motos. Cintas de amarração em todas as rodas e seguro durante o transporte.',
      preco: '180.00',
      destaque: true,
      atributos: [
        ['Área de atendimento', 'Curitiba e região metropolitana'],
        ['Capacidade', 'Até 3,5 toneladas'],
        ['Atendimento', '24 horas'],
        ['Chegada média', '40 minutos'],
      ],
      fotos: [
        { unsplash: '1686966933735-305bd8fe0a77', autor: 'fr0ggy5' },
        { unsplash: '1764200458388-65c4b0c19a95', autor: 'Ali Ananta' },
      ],
    },
    {
      titulo: 'Socorro 24h em rodovias',
      categoria: 'Guincho leve',
      descricao:
        'Pane mecânica, pneu furado ou acidente na estrada? Atendemos nas rodovias BR-116, BR-277 e BR-376, com sinalização da via e remoção até a oficina de sua escolha.',
      preco: null,
      destaque: true,
      atributos: [
        ['Área de atendimento', 'BR-116, BR-277 e BR-376 (até 150 km)'],
        ['Capacidade', 'Até 3,5 toneladas'],
        ['Atendimento', '24 horas, inclusive feriados'],
        ['Chegada média', '60 minutos'],
      ],
      fotos: [
        { unsplash: '1730514784243-f0e7f09c9f50', autor: 'fr0ggy5' },
        { unsplash: '1529369623266-f5264b696110', autor: 'Jamie Street' },
      ],
    },
    {
      titulo: 'Transporte de veículos entre cidades',
      categoria: 'Transporte de veículos',
      descricao:
        'Levamos seu carro para qualquer cidade do Sul e Sudeste, com rastreamento e seguro. Ótimo para mudanças, compras de veículos em outra cidade e envio para leilões.',
      preco: '3.50',
      destaque: true,
      atributos: [
        ['Área de atendimento', 'Sul e Sudeste'],
        ['Capacidade', 'Até 2 veículos por viagem'],
        ['Preço', 'por km rodado'],
        ['Prazo', 'Agendado em até 48h'],
      ],
      fotos: [
        { unsplash: '1761917904658-2a9ecb84a169', autor: 'Cooper White' },
        {
          unsplash: '1698998882426-39a6609ab10a',
          autor: 'Zanelle Lofty-Eaton',
        },
      ],
    },
    {
      titulo: 'Guincho pesado para caminhões e ônibus',
      categoria: 'Guincho pesado',
      descricao:
        'Remoção de caminhões, ônibus e máquinas com guincho pesado de lança. Equipe preparada para destombamento e atendimento a frotas com contrato mensal.',
      preco: null,
      destaque: false,
      atributos: [
        ['Área de atendimento', 'Paraná e Santa Catarina'],
        ['Capacidade', 'Até 30 toneladas'],
        ['Atendimento', '24 horas'],
        ['Frotas', 'Contrato mensal disponível'],
      ],
      fotos: [
        { unsplash: '1777734795520-e18b5e40de5b', autor: 'janilson furtado' },
      ],
    },
  ],
  leads: [
    {
      nome: 'Carlos Mendes',
      telefone: '(41) 90000-0001',
      mensagem:
        'Preciso levar um carro de Curitiba para Joinville na sexta. Quanto fica?',
      item: 'Transporte de veículos entre cidades',
    },
    {
      nome: 'Patrícia Gomes',
      telefone: '(41) 90000-0002',
      mensagem: 'Vocês fazem contrato para frota de 12 caminhões?',
      item: 'Guincho pesado para caminhões e ônibus',
    },
  ],
};
