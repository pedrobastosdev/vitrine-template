import type { DadosSeed } from './tipos.js';

// Negócio fictício. Fotos do Unsplash (licença Unsplash), créditos no README.
export const dados: DadosSeed = {
  negocio: {
    nome: 'Morada Clara Imóveis',
    slogan: 'Imóveis selecionados em Florianópolis',
    corPrimaria: '#1f4e5f',
    corSecundaria: '#c8a24a',
    estiloTitulo: 'serifa',
    whatsapp: '5548900000000',
    telefone: '(48) 3000-0000',
    email: 'contato@moradaclara.exemplo',
    endereco: 'Avenida Beira-Mar Norte, 1000 - Centro',
    cidade: 'Florianópolis - SC',
    instagram: 'moradaclara.exemplo',
    rotuloItens: 'Imóveis',
    rotuloItem: 'imóvel',
    acaoPrincipal: 'whatsapp',
    ctaItem: 'Agendar visita',
    fatos: [
      { rotulo: 'Experiência', valor: 'Mais de 15 anos na Ilha' },
      { rotulo: 'Visitas', valor: 'Acompanhadas por um corretor' },
      { rotulo: 'Documentação', valor: 'Cuidamos de tudo para você' },
      { rotulo: 'Atendimento', valor: 'Do primeiro contato às chaves' },
    ],
    heroTitulo: 'O lugar certo para a próxima fase da sua vida',
    heroSubtitulo:
      'Casas e apartamentos escolhidos a dedo na Ilha da Magia, com atendimento de quem conhece cada bairro.',
    heroFoto: { unsplash: '1605276374104-dee2a0ed3cd6', autor: 'Dillon Kydd' },
    sobreTitulo:
      'Atendimento sem pressa, do primeiro contato à entrega das chaves',
    sobreTexto:
      'Há mais de 15 anos ajudamos famílias a encontrar o imóvel ideal. Visitamos cada imóvel antes de anunciar, cuidamos da documentação e acompanhamos você em todas as etapas da negociação.',
  },
  categorias: ['Apartamentos', 'Casas', 'Coberturas'],
  itens: [
    {
      titulo: 'Apartamento 3 quartos com vista para o mar',
      categoria: 'Apartamentos',
      descricao:
        'Apartamento iluminado, com sala ampla integrada à varanda e vista para a baía. Cozinha planejada, suíte com closet e duas vagas de garagem. Prédio com piscina, academia e portaria 24h, a poucos passos da Beira-Mar.',
      preco: '1250000.00',
      destaque: true,
      atributos: [
        ['Quartos', '3'],
        ['Área', '112 m²'],
        ['Bairro', 'Agronômica'],
        ['Banheiros', '2'],
        ['Vagas', '2'],
      ],
      fotos: [
        { unsplash: '1479839672679-a46483c0e7c8', autor: 'Joel Filipe' },
        { unsplash: '1583847268964-b28dc8f51f92', autor: 'Minh Pham' },
        { unsplash: '1556911220-bff31c812dba', autor: 'Jason Briscoe' },
      ],
    },
    {
      titulo: 'Casa contemporânea com piscina em Jurerê',
      categoria: 'Casas',
      descricao:
        'Projeto contemporâneo com grandes vãos de vidro, piscina com borda infinita e área gourmet. Quatro suítes, sendo a master com hidromassagem. Terreno de 600 m² em rua tranquila, a 300 m da praia.',
      preco: '4890000.00',
      destaque: true,
      atributos: [
        ['Quartos', '4'],
        ['Área', '380 m²'],
        ['Bairro', 'Jurerê Internacional'],
        ['Banheiros', '5'],
        ['Vagas', '4'],
      ],
      fotos: [
        {
          unsplash: '1512917774080-9991f1c4c750',
          autor: 'Frames For Your Heart',
        },
        {
          unsplash: '1600596542815-ffad4c1539a9',
          autor: 'Frames For Your Heart',
        },
        { unsplash: '1600489000022-c2086d79f9d4', autor: 'Collov Home Design' },
      ],
    },
    {
      titulo: 'Casa térrea aconchegante na Lagoa da Conceição',
      categoria: 'Casas',
      descricao:
        'Casa térrea cercada de verde, com lareira, deck de madeira e quintal para as crianças e os pets. Três quartos, cozinha ampla e garagem coberta. Perto de restaurantes, trilhas e da lagoa.',
      preco: '980000.00',
      destaque: true,
      atributos: [
        ['Quartos', '3'],
        ['Área', '160 m²'],
        ['Bairro', 'Lagoa da Conceição'],
        ['Banheiros', '2'],
        ['Vagas', '2'],
      ],
      fotos: [
        { unsplash: '1568605114967-8130f3a36994', autor: 'vu anh' },
        { unsplash: '1600493505873-cddd69453072', autor: 'Collov Home Design' },
        { unsplash: '1484154218962-a197022b5858', autor: 'Naomi Hébert' },
      ],
    },
    {
      titulo: 'Studio compacto perto da UFSC',
      categoria: 'Apartamentos',
      descricao:
        'Studio mobiliado e pronto para morar, ideal para estudantes ou investimento. Prédio novo com lavanderia compartilhada, bicicletário e coworking. A 5 minutos a pé da universidade.',
      preco: '420000.00',
      destaque: false,
      atributos: [
        ['Quartos', '1'],
        ['Área', '32 m²'],
        ['Bairro', 'Trindade'],
        ['Banheiros', '1'],
        ['Vagas', '0'],
      ],
      fotos: [
        {
          unsplash: '1545324418-cc1a3fa10c00',
          autor: 'Marlene Céline Nordvik',
        },
        { unsplash: '1612419299101-6c294dc2901d', autor: 'Huy Nguyen' },
        { unsplash: '1622372738946-62e02505feb3', autor: 'Kam Idris' },
      ],
    },
    {
      titulo: 'Cobertura duplex com terraço no Itacorubi',
      categoria: 'Coberturas',
      descricao:
        'Cobertura duplex com terraço privativo, churrasqueira e vista para o pôr do sol. Living com pé-direito duplo, três suítes e cozinha gourmet. Condomínio com segurança e áreas de lazer completas.',
      preco: '2350000.00',
      destaque: true,
      atributos: [
        ['Quartos', '3'],
        ['Área', '210 m²'],
        ['Bairro', 'Itacorubi'],
        ['Banheiros', '4'],
        ['Vagas', '3'],
      ],
      fotos: [
        { unsplash: '1624204386084-dd8c05e32226', autor: 'Tobias Wilden' },
        { unsplash: '1665249934445-1de680641f50', autor: 'Danilo Rios' },
        { unsplash: '1617228069096-4638a7ffc906', autor: 'Cat Han' },
      ],
    },
    {
      titulo: 'Sobrado de madeira no Campeche',
      categoria: 'Casas',
      descricao:
        'Sobrado charmoso em madeira de demolição, com varanda ampla e jardim. Quatro quartos, escritório e espaço para horta. A 10 minutos de bicicleta da praia do Campeche.',
      preco: null,
      destaque: false,
      atributos: [
        ['Quartos', '4'],
        ['Área', '240 m²'],
        ['Bairro', 'Campeche'],
        ['Banheiros', '3'],
        ['Vagas', '2'],
      ],
      fotos: [
        { unsplash: '1570129477492-45c003edd2be', autor: 'todd kent' },
        { unsplash: '1580587771525-78b9dba3b914', autor: 'Ярослав Алексеенко' },
        { unsplash: '1507089947368-19c1da9775ae', autor: 'Aaron Huber' },
      ],
    },
  ],
  leads: [
    {
      nome: 'Mariana Souza',
      telefone: '(48) 90000-0001',
      mensagem: 'Gostaria de agendar uma visita no sábado pela manhã.',
      item: 'Casa térrea aconchegante na Lagoa da Conceição',
    },
    {
      nome: 'Rafael Lima',
      telefone: '(48) 90000-0002',
      mensagem: 'O condomínio aceita pets? Tenho dois cachorros.',
      item: 'Apartamento 3 quartos com vista para o mar',
    },
    {
      nome: 'Juliana Prado',
      telefone: '(48) 90000-0003',
      mensagem:
        'Procuro apartamento de 2 quartos perto do Centro, até R$ 700 mil.',
    },
  ],
};
