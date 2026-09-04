import { Course } from '../types';

export const courses: Course[] = [
  // 1. SAÚDE & PET
  {
    id: 1,
    title: 'Curso Auxiliar de Farmácia',
    slug: 'auxiliar-de-farmacia',
    category: 'SAÚDE & PET',
    categorySlug: 'saude-pet',
    shortDescription: 'Forma profissionais para atendimento em farmácias, auxiliando na dispensação de medicamentos e controle de estoque farmacêutico.',
    fullDescription: 'O Curso de Auxiliar de Farmácia da EasyTraining prepara você para ingressar rapidamente no mercado farmacêutico, um dos que mais contratam no Brasil. Você aprenderá leitura de receitas, classificação de medicamentos, atendimento humanizado e normas da ANVISA.',
    duration: '3 a 6 meses',
    modality: 'Presencial / Prático',
    certificate: true,
    image: '/images/courses/ATENTENDE-FARMACIA.webp',
    featured: true,
    modules: [
      {
        title: 'Módulo 1: Atendimento Farmacêutico e Ética Profissional',
        topics: ['Postura e comunicação no balcão', 'Legislação farmacêutica e ética', 'Organização e layout da farmácia']
      },
      {
        title: 'Módulo 2: Farmacologia Básica e Medicamentos',
        topics: ['Classes terapêuticas', 'Genéricos, similares e de referência', 'Formas farmacêuticas e vias de administração']
      },
      {
        title: 'Módulo 3: Leitura de Receitas e Dispensação',
        topics: ['Interpretação de prescrições médicas', 'Medicamentos controlados e retenção de receita', 'Siglas médicas e posologia']
      },
      {
        title: 'Módulo 4: Gestão de Estoque e Sistema SNGPC',
        topics: ['Entrada e saída de medicamentos', 'Controle de validade e armazenamento térmico', 'Boas práticas de dispensação']
      }
    ],
    targetAudience: 'Pessoas que buscam o primeiro emprego ou transição de carreira para o setor da saúde e farmácias.',
    careerOpportunities: [
      'Drogarias e Redes Farmacêuticas',
      'Farmácias de Manipulação',
      'Farmácias Hospitalares e Unidades de Saúde',
      'Distribuidoras de Medicamentos e Cosméticos'
    ],
    whatsappMessage: 'Olá! Gostaria de saber mais sobre as matrículas do Curso de Auxiliar de Farmácia.'
  },
  {
    id: 2,
    title: 'Tosa PET Geral em Guarulhos-SP',
    slug: 'curso-de-tosa-pet-geral-em-guarulhos-sp',
    category: 'SAÚDE & PET',
    categorySlug: 'saude-pet',
    shortDescription: 'Tosa na máquina, tosa na tesoura, tosa da raça, tosa bebê e finalizações estéticas em animais reais.',
    fullDescription: 'O Curso de Tosa Geral da EasyTraining é uma especialização prática voltada para quem deseja dominar as principais técnicas de corte e tosa em cães de diversas raças. As aulas são 100% práticas com animais reais em laboratório climatizado e seguro.',
    duration: '3 a 6 meses',
    modality: '100% Prático em Animais Reais',
    certificate: true,
    image: '/images/courses/curso-de-tosa-em-guarulhos.webp',
    featured: true,
    modules: [
      {
        title: 'Módulo 1: Equipamentos e Segurança na Tosa',
        topics: ['Manuseio correto de máquinas e lâminas', 'Tipos de tesouras (reta, curva, tubarão e dentada)', 'Afiação e manutenção dos equipamentos']
      },
      {
        title: 'Módulo 2: Técnicas de Tosa na Máquina',
        topics: ['Tosa baixa, tosa padrão e higiênica', 'Nivelamento de pelagem sem marcas', 'Uso seguro de adaptadores (snaps)']
      },
      {
        title: 'Módulo 3: Tosa na Tesoura e Tosa Bebê',
        topics: ['Tosa bebê em Shih Tzu, Lhasa Apso e Yorkshire', 'Esculpir cabeças redondas e focinhos perfeitos', 'Acabamentos em patas e caudas']
      },
      {
        title: 'Módulo 4: Padrões de Raça e Manejo sem Estresse',
        topics: ['Tosa específica para Spitz Alemão, Poodle e Schnauzer', 'Técnicas de desembolo sem dor', 'Contenção calma e psicologia canina']
      }
    ],
    targetAudience: 'Apaixonados por animais, tosadores iniciantes e empreendedores que desejam montar seu próprio Pet Shop.',
    careerOpportunities: [
      'Pet Shops e Clínicas Veterinárias',
      'Centros de Estética Animal e Spas PET',
      'Atendimento Domiciliar (Home Care PET)',
      'Empreender no próprio negócio de tosa'
    ],
    whatsappMessage: 'Olá! Gostaria de mais informações sobre o Curso de Tosa PET Geral.'
  },
  {
    id: 3,
    title: 'Banho e Tosa Higiênica em Guarulhos-SP',
    slug: 'banho-e-tosa-higienica',
    category: 'SAÚDE & PET',
    categorySlug: 'saude-pet',
    shortDescription: 'Lavagem, secagem rápida, tosa higiênica, corte de unhas, limpeza de ouvidos e desembolo.',
    fullDescription: 'Aprenda do zero todo o processo profissional de banho, secagem correta, hidratação profunda, escovação e tosa higiênica em cães e gatos de todos os portes.',
    duration: '2 a 4 meses',
    modality: '100% Prático em Animais Reais',
    certificate: true,
    image: '/images/courses/happy-woman-playing-with-dog-in-grooming-studio.webp',
    modules: [
      {
        title: 'Módulo 1: Cosmetologia e Tipos de Pelos',
        topics: ['Shampoos específicos, clareadores e neutralizadores', 'Condicionadores e máscaras de hidratação', 'Identificação de problemas dermatológicos']
      },
      {
        title: 'Módulo 2: Técnicas de Lavagem e Secagem Rápida',
        topics: ['Banho seguro sem molhar condutos auditivos', 'Uso de sopradores e secadores profissionais', 'Escovação e desembolo pré e pós-banho']
      },
      {
        title: 'Módulo 3: Tosa Higiênica e Cuidados Essenciais',
        topics: ['Tosa higiênica de almofadas plantares, barriga e ânus', 'Corte de unhas com segurança e estancamento', 'Limpeza e higienização correta de ouvidos']
      }
    ],
    targetAudience: 'Quem deseja entrar no mercado de trabalho pet rapidamente como banhista qualificado.',
    careerOpportunities: [
      'Banhista Profissional em Pet Shops',
      'Spas e Hotéis para Cães',
      'Clínicas Veterinárias com Centro Estético'
    ],
    whatsappMessage: 'Olá! Quero saber sobre o Curso de Banho e Tosa Higiênica.'
  },
  {
    id: 4,
    title: 'Curso de Auxiliar Veterinário em Guarulhos',
    slug: 'auxiliar-veterinario',
    category: 'SAÚDE & PET',
    categorySlug: 'saude-pet',
    shortDescription: 'Prepara para atuar em clínicas veterinárias, auxiliando em consultas, procedimentos cirúrgicos, exames e internações.',
    fullDescription: 'O Curso de Auxiliar Veterinário da EasyTraining capacita você para dar suporte técnico completo aos Médicos Veterinários em clínicas, hospitais, laboratórios e centros de internação.',
    duration: '8 meses (100h)',
    modality: 'Presencial / Prático',
    certificate: true,
    image: '/images/courses/animals-for-examination-and-treatment-in-the-veterinary-clinic.webp',
    featured: true,
    modules: [
      {
        title: 'Módulo 1: Anatomia e Fisiologia Animal',
        topics: ['Sistemas circulatório, respiratório e digestório', 'Sinais vitais (temperatura, FC, FR, TPC)', 'Comportamento e bem-estar animal']
      },
      {
        title: 'Módulo 2: Contenção Física e Manejo Clínico',
        topics: ['Contenção segura de cães dóceis e agressivos', 'Manejo cat friendly (gatos)', 'Aferição de parâmetros e anamnese inicial']
      },
      {
        title: 'Módulo 3: Coleta de Exames e Farmacologia Veterinária',
        topics: ['Auxílio na coleta de sangue, fezes e urina', 'Vias de administração de medicamentos (SC, IM, IV)', 'Cálculo básico de doses sob supervisão']
      },
      {
        title: 'Módulo 4: Auxílio Cirúrgico e Internação',
        topics: ['Esterilização e instrumentação cirúrgica', 'Cuidados no pré e pós-operatório', 'Monitoramento de pacientes internados']
      }
    ],
    targetAudience: 'Pessoas com afinidade pelo cuidado animal que desejam trabalhar em clínicas ou ingressar no curso de Medicina Veterinária.',
    careerOpportunities: [
      'Clínicas e Hospitais Veterinários 24h',
      'Laboratórios de Diagnóstico Veterinário',
      'Centros de Zoonoses, ONGs e Abrigos',
      'Farmácias e Distribuidoras Veterinárias'
    ],
    whatsappMessage: 'Olá! Tenho interesse no Curso de Auxiliar Veterinário.'
  },

  // 2. GESTÃO & NEGÓCIOS
  {
    id: 5,
    title: 'Assistente de Recursos Humanos',
    slug: 'assistente-de-recursos-humanos',
    category: 'GESTÃO & NEGÓCIOS',
    categorySlug: 'gestao',
    shortDescription: 'Capacita para atuar nas rotinas de RH, recrutamento, seleção, benefícios e apoio à gestão de pessoas nas empresas.',
    fullDescription: 'Aprenda os processos completos do setor de RH e Departamento Pessoal: desde a atração de talentos até o fechamento de folhas de pagamento, cálculos trabalhistas e sistema eSocial.',
    duration: '3 a 6 meses',
    modality: 'Presencial / Prático',
    certificate: true,
    image: '/images/courses/RECURSOS-HUMANOS.webp',
    featured: true,
    modules: [
      {
        title: 'Módulo 1: Recrutamento e Seleção',
        topics: ['Triagem de currículos e entrevistas por competências', 'Dinâmicas de grupo e testes de perfil', 'Onboarding e integração']
      },
      {
        title: 'Módulo 2: Legislação Trabalhista e Contratos',
        topics: ['CLT, tipos de contrato e jornada de trabalho', 'Documentação admissional e eSocial', 'Controle de ponto e banco de horas']
      },
      {
        title: 'Módulo 3: Folha de Pagamento e Encargos',
        topics: ['Cálculo de salário, horas extras, adicionais e DSR', 'Descontos de INSS, IRRF e VT/VR', 'Férias, 13º salário e rescisão contratual']
      }
    ],
    targetAudience: 'Profissionais que buscam ingressar na área corporativa, gestão de pessoas e departamento pessoal.',
    careerOpportunities: [
      'Departamentos de Recursos Humanos e DP',
      'Agências de Emprego e Consultorias de RH',
      'Empresas de Logística, Comércio e Indústria'
    ],
    whatsappMessage: 'Olá! Gostaria de saber mais sobre o Curso de Assistente de RH.'
  },
  {
    id: 6,
    title: 'Assistente Administrativo',
    slug: 'assistente-administrativo',
    category: 'GESTÃO & NEGÓCIOS',
    categorySlug: 'gestao',
    shortDescription: 'Rotinas de escritório, faturamento, comunicação corporativa, elaboração de relatórios e atendimento ao cliente.',
    fullDescription: 'O curso mais versátil para o mercado de trabalho. Você aprenderá organização de processos administrativos, rotinas financeiras básicas, correspondência empresarial e sistemas de gestão.',
    duration: '3 a 6 meses',
    modality: 'Presencial / Prático',
    certificate: true,
    image: '/images/courses/assistente-administrativo.webp',
    modules: [
      {
        title: 'Módulo 1: Rotinas Corporativas e Comunicação',
        topics: ['Redação de e-mails formais e relatórios', 'Gestão de arquivos físicos e digitais', 'Atendimento telefônico e presencial de clientes']
      },
      {
        title: 'Módulo 2: Finanças e Faturamento Básico',
        topics: ['Contas a pagar e receber', 'Emissão e conferência de Notas Fiscais', 'Fluxo de caixa e conciliação']
      },
      {
        title: 'Módulo 3: Informática para Administração',
        topics: ['Word e Excel voltados para rotinas empresariais', 'Elaboração de planilhas de controle e cadastros', 'Organização em nuvem (Google Drive e OneDrive)']
      }
    ],
    targetAudience: 'Jovens que buscam o primeiro emprego ou profissionais que querem atuar no setor administrativo.',
    careerOpportunities: [
      'Escritórios em geral e Empresas de Serviços',
      'Indústrias e Centros Logísticos',
      'Clínicas, Hospitais e Escolas',
      'Comércio Varejista e Atacadista'
    ],
    whatsappMessage: 'Olá! Gostaria de informações sobre o Curso de Assistente Administrativo.'
  },
  {
    id: 7,
    title: 'Assistente de Logística',
    slug: 'assistente-de-logistica',
    category: 'GESTÃO & NEGÓCIOS',
    categorySlug: 'gestao',
    shortDescription: 'Gestão de estoques, armazenagem, expedição, fretes e distribuição no polo logístico de Guarulhos.',
    fullDescription: 'Guarulhos é a capital da logística no Brasil. Este curso ensina na prática a operação da cadeia de suprimentos, gestão de estoques, sistemas WMS, controle de expedição e transporte de cargas.',
    duration: '3 a 6 meses',
    modality: 'Presencial / Prático',
    certificate: true,
    image: '/images/courses/ASSISTENTE-LOGISTICA.webp',
    modules: [
      {
        title: 'Módulo 1: Cadeia de Suprimentos (Supply Chain)',
        topics: ['Conceitos fundamentais da logística moderna', 'Fluxo de materiais e informações', 'Indicadores de desempenho (KPIs)']
      },
      {
        title: 'Módulo 2: Gestão de Estoque e Armazenagem',
        topics: ['Curva ABC e inventários rotativos', 'Técnicas de armazenagem, picking e packing', 'Sistemas de gerenciamento de armazém (WMS)']
      },
      {
        title: 'Módulo 3: Transporte e Expedição',
        topics: ['Roteirização de frotas e cálculo de fretes', 'Documentos de transporte (CT-e, MDF-e, Romaneio)', 'Operações de carga e descarga seguras']
      }
    ],
    targetAudience: 'Interessados em trabalhar em galpões logísticos, transportadoras, distribuidoras e no aeroporto de Guarulhos.',
    careerOpportunities: [
      'Centros de Distribuição (CDs) e Galpões Logísticos',
      'Transportadoras e Operadores Multimodais',
      'Aeroporto Internacional de Guarulhos / Cargas',
      'Indústrias e Grandes Redes de E-commerce'
    ],
    whatsappMessage: 'Olá! Quero saber mais sobre o Curso de Assistente de Logística.'
  },
  {
    id: 8,
    title: 'Auxiliar de Contabilidade',
    slug: 'auxiliar-de-contabilidade',
    category: 'GESTÃO & NEGÓCIOS',
    categorySlug: 'gestao',
    shortDescription: 'Ensina rotinas contábeis, lançamentos, balancetes, noções fiscais e tributárias essenciais para escritórios.',
    fullDescription: 'Aprenda os princípios e a prática da contabilidade: escrituração, plano de contas, balancetes, conciliações financeiras e noções tributárias indispensáveis para escritórios contábeis.',
    duration: '3 a 6 meses',
    modality: 'Presencial / Prático',
    certificate: true,
    image: '/images/courses/CONTABILIDADE.webp',
    modules: [
      {
        title: 'Módulo 1: Fundamentos da Contabilidade',
        topics: ['Patrimônio, Ativo, Passivo e Patrimônio Líquido', 'Método das Partidas Dobradas (Débito e Crédito)', 'Plano de contas e regimes contábeis']
      },
      {
        title: 'Módulo 2: Escrituração e Demonstrativos',
        topics: ['Lançamentos no Livro Diário e Razão', 'Elaboração de Balancetes de Verificação', 'DRE e Balanço Patrimonial simplificado']
      },
      {
        title: 'Módulo 3: Noções Fiscais e Tributárias',
        topics: ['Simples Nacional, Lucro Presumido e Lucro Real', 'Apuração básica de impostos (PIS, COFINS, ICMS, ISS)', 'Conciliação bancária no Excel']
      }
    ],
    targetAudience: 'Pessoas interessadas na área financeira, contábil e fiscal.',
    careerOpportunities: [
      'Escritórios de Contabilidade',
      'Departamentos Financeiros e Fiscais de Empresas',
      'Auditorias e Consultorias Empresariais'
    ],
    whatsappMessage: 'Olá! Gostaria de informações sobre o Curso de Auxiliar de Contabilidade.'
  },
  {
    id: 9,
    title: 'Gestão Comercial',
    slug: 'gestao-comercial',
    category: 'GESTÃO & NEGÓCIOS',
    categorySlug: 'gestao',
    shortDescription: 'Desenvolve competências em técnicas de vendas de alto impacto, negociação, pós-venda e gestão de metas comerciais.',
    fullDescription: 'Domine as estratégias modernas de vendas consultivas, técnicas de persuasão, negociação avançada, gestão de carteira de clientes e ferramentas de CRM.',
    duration: '3 a 6 meses',
    modality: 'Presencial / Prático',
    certificate: true,
    image: '/images/courses/gestao-comercial.webp',
    modules: [
      {
        title: 'Módulo 1: Técnicas Avançadas de Vendas',
        topics: ['Metodologia SPIN Selling e venda consultiva', 'Prospecção ativa e qualificação de leads', 'Apresentação de valor e propostas comerciais']
      },
      {
        title: 'Módulo 2: Negociação e Superação de Objeções',
        topics: ['Táticas de fechamento e gatilhos mentais', 'Contorno de objeções de preço e prazo', 'Relacionamento de longo prazo e pós-venda']
      },
      {
        title: 'Módulo 3: Ferramentas e Gestão Comercial',
        topics: ['Softwares de CRM e funil de vendas', 'Definição de metas e indicadores comerciais', 'Atendimento omnichannel']
      }
    ],
    targetAudience: 'Vendedores, consultores e quem deseja ingressar no setor comercial com altos ganhos.',
    careerOpportunities: [
      'Consultor de Vendas B2B e Varejo',
      'Executivo de Contas e Representante Comercial',
      'Supervisão e Coordenação de Vendas'
    ],
    whatsappMessage: 'Olá! Quero saber mais sobre o Curso de Gestão Comercial.'
  },

  // 3. DESIGN & CRIATIVIDADE
  {
    id: 10,
    title: 'Designer Gráfico',
    slug: 'designer-grafico',
    category: 'DESIGN & CRIATIVIDADE',
    categorySlug: 'design',
    shortDescription: 'Capacita na criação de identidades visuais, materiais impressos e digitais utilizando as ferramentas Adobe.',
    fullDescription: 'Aprenda a criar logotipos profissionais, banners para redes sociais, folhetos, cartazes, embalagens e identidades visuais completas com o Photoshop e Illustrator.',
    duration: '4 a 8 meses',
    modality: '100% Prático no Computador',
    certificate: true,
    image: '/images/courses/designer-grafico.webp',
    featured: true,
    modules: [
      {
        title: 'Módulo 1: Adobe Photoshop Profissional',
        topics: ['Recortes complexos, máscaras e camadas', 'Tratamento de pele, cores e iluminação', 'Composições criativas e mockups']
      },
      {
        title: 'Módulo 2: Adobe Illustrator e Criação Vetorial',
        topics: ['Ferramenta caneta (Pen Tool) e formas vetoriais', 'Desenvolvimento de logotipos e ícones', 'Criação de padrões, estampas e ilustrações']
      },
      {
        title: 'Módulo 3: Teoria do Design e Identidade Visual',
        topics: ['Psicologia das cores e combinações harmônicas', 'Tipografia, hierarquia visual e grid', 'Manual de marca e branding']
      }
    ],
    targetAudience: 'Criativos, estudantes de comunicação e quem deseja trabalhar com criação visual ou freelancer.',
    careerOpportunities: [
      'Agências de Publicidade e Marketing Digital',
      'Editoras, Birôs e Gráficas Rápidas',
      'Departamentos de Comunicação Interna',
      'Trabalhar como Designer Freelancer'
    ],
    whatsappMessage: 'Olá! Gostaria de informações sobre o Curso de Designer Gráfico.'
  },
  {
    id: 11,
    title: 'Marketing Digital',
    slug: 'marketing-digital',
    category: 'DESIGN & CRIATIVIDADE',
    categorySlug: 'design',
    shortDescription: 'Aprenda a criar campanhas estratégicas, dominar redes sociais, anúncios patrocinados e funis de conversão.',
    fullDescription: 'Curso prático focado em resultados reais: aprenda a gerenciar redes sociais profissionalmente, criar anúncios que vendem no Meta Ads e Google Ads, produzir copies persuasivas e mensurar resultados.',
    duration: '3 a 6 meses',
    modality: 'Presencial / Prático',
    certificate: true,
    image: '/images/courses/crop-hand-drawing-digital-marketing-plan.webp',
    featured: true,
    modules: [
      {
        title: 'Módulo 1: Gestão de Redes Sociais e Conteúdo',
        topics: ['Planejamento editorial para Instagram, TikTok e LinkedIn', 'Criação de posts engajadores no Canva e Photoshop', 'Estratégias de Reels, Stories e Carrosséis']
      },
      {
        title: 'Módulo 2: Tráfego Pago (Meta Ads & Google Ads)',
        topics: ['Gerenciador de Anúncios do Meta (Facebook/Instagram)', 'Segmentação de público, Pixel e campanhas de conversão', 'Anúncios na Rede de Pesquisa do Google']
      },
      {
        title: 'Módulo 3: Copywriting e Funis de Vendas',
        topics: ['Técnicas de escrita persuasiva (AIDA e PAS)', 'Criação de páginas de captura (Landing Pages)', 'Automação de e-mails e mensagens no WhatsApp']
      }
    ],
    targetAudience: 'Empreendedores, autônomos e pessoas que desejam atuar como gestores de redes sociais e tráfego pago.',
    careerOpportunities: [
      'Social Media e Gestor de Tráfego',
      'Agências de Marketing e E-commerce',
      'Consultor de Marketing para Negócios Locais'
    ],
    whatsappMessage: 'Olá! Quero saber mais sobre o Curso de Marketing Digital.'
  },
  {
    id: 12,
    title: 'Projetista Digital',
    slug: 'projetista-digital',
    category: 'DESIGN & CRIATIVIDADE',
    categorySlug: 'design',
    shortDescription: 'Desenho técnico 2D e modelagem digital 3D para projetos industriais, arquitetônicos e mecânicos no AutoCAD.',
    fullDescription: 'Aprenda a desenvolver plantas baixas, cortes, elevações e detalhes mecânicos nas normas técnicas da ABNT utilizando o AutoCAD.',
    duration: '4 a 8 meses',
    modality: '100% Prático no Computador',
    certificate: true,
    image: '/images/courses/projetista-digital.webp',
    modules: [
      {
        title: 'Módulo 1: Desenho Técnico e Normas ABNT',
        topics: ['Vistas ortogonais, cortes e hachuras', 'Cotagem e escalas técnicas', 'Interpretação de projetos']
      },
      {
        title: 'Módulo 2: AutoCAD 2D Completo',
        topics: ['Comandos de desenho e precisão (Snap, Ortho, Polar)', 'Comandos de modificação (Fillet, Chamfer, Trim, Array)', 'Camadas (Layers), blocos e textos']
      },
      {
        title: 'Módulo 3: Projetos Arquitetônicos e Plotagem',
        topics: ['Desenho de planta baixa com portas, janelas e mobília', 'Configuração de pranchas e layouts no Paper Space', 'Exportação em PDF e plotagem profissional']
      }
    ],
    targetAudience: 'Estudantes e profissionais de arquitetura, engenharia civil, mecânica e design de interiores.',
    careerOpportunities: [
      'Escritórios de Arquitetura e Engenharia',
      'Construtoras e Empresas de Projetos',
      'Indústrias Metalúrgicas e Moveleiras'
    ],
    whatsappMessage: 'Olá! Gostaria de informações sobre o Curso de Projetista Digital.'
  },
  {
    id: 13,
    title: 'Arte-finalista',
    slug: 'arte-finalista',
    category: 'DESIGN & CRIATIVIDADE',
    categorySlug: 'design',
    shortDescription: 'Tratamento de arquivos para produção gráfica, separação de cores (CMYK/Pantone), facas especiais e impressão.',
    fullDescription: 'Especialização essencial para a indústria gráfica e comunicação visual: aprenda fechamento correto de arquivos em PDF/X-1a, montagem de bonecas de impressão, facas de corte e acabamentos especiais.',
    duration: '3 a 6 meses',
    modality: '100% Prático no Computador',
    certificate: true,
    image: '/images/courses/arte-finalista.webp',
    modules: [
      {
        title: 'Módulo 1: Pré-impressão e Fechamento de Arquivos',
        topics: ['Padrão PDF/X-1a e verificação prévia (Preflight)', 'Resolução correta (DPI) e sangria de segurança', 'Conversão de fontes em curvas e incorporação de imagens']
      },
      {
        title: 'Módulo 2: Gerenciamento de Cores e Facas Especiais',
        topics: ['Espaço de cor CMYK vs RGB e perfis ICC', 'Uso de cores especiais (Pantone e Hot Stamping)', 'Desenvolvimento de facas de corte e vinco']
      },
      {
        title: 'Módulo 3: Processos de Impressão e Acabamentos',
        topics: ['Impressão Offset, Digital, Flexografia e Silk Screen', 'Aplicação de verniz localizado e laminação BOPP', 'Controle de qualidade e conferência técnica']
      }
    ],
    targetAudience: 'Designers e operadores gráficos que buscam atuar no mercado de pré-impressão e gráficas.',
    careerOpportunities: [
      'Gráficas Comerciais e Industriais',
      'Birôs de Impressão e Comunicação Visual',
      'Editoras e Indústrias de Embalagens'
    ],
    whatsappMessage: 'Olá! Tenho interesse no Curso de Arte-finalista.'
  },

  // 4. TECNOLOGIA & INFORMÁTICA
  {
    id: 14,
    title: 'Curso de Informática Básica',
    slug: 'curso-de-informatica-basica',
    category: 'TECNOLOGIA & INFORMÁTICA',
    categorySlug: 'tecnologia',
    shortDescription: 'A base essencial para dominar o computador, Windows, Pacote Office (Word, Excel, PowerPoint), digitação e internet segura.',
    fullDescription: 'O primeiro passo para quem nunca mexeu ou tem pouca segurança no computador. Aprenda digitação rápida, navegação segura, e-mails, criação de documentos no Word, planilhas no Excel e apresentações no PowerPoint.',
    duration: '3 a 6 meses',
    modality: '100% Prático no Computador',
    certificate: true,
    image: '/images/courses/informatica-basica.webp',
    featured: true,
    modules: [
      {
        title: 'Módulo 1: Windows e Digitação Eficiente',
        topics: ['Operação de teclado e mouse com digitação às cegas', 'Gerenciamento de pastas, arquivos e pendrive', 'Segurança na internet e proteção contra vírus']
      },
      {
        title: 'Módulo 2: Microsoft Word Completo',
        topics: ['Digitação e formatação de textos e currículos', 'Inserção de tabelas, imagens e cabeçalhos', 'Formatação oficial de documentos']
      },
      {
        title: 'Módulo 3: Microsoft Excel e PowerPoint',
        topics: ['Criação de planilhas de controle pessoal e empresarial', 'Fórmulas básicas (SOMA, MÉDIA, MÍNIMO, MÁXIMO)', 'Criação de slides modernos com transições e animações']
      }
    ],
    targetAudience: 'Iniciantes de todas as idades, jovens em busca do primeiro emprego e melhor idade.',
    careerOpportunities: [
      'Porta de entrada para qualquer vaga de emprego',
      'Auxiliar de Atendimento e Balcão',
      'Jovem Aprendiz e Estágios'
    ],
    whatsappMessage: 'Olá! Gostaria de saber mais sobre o Curso de Informática Básica.'
  },
  {
    id: 15,
    title: 'Excel Avançado',
    slug: 'excel-avancado',
    category: 'TECNOLOGIA & INFORMÁTICA',
    categorySlug: 'tecnologia',
    shortDescription: 'Fórmulas complexas, PROCV/PROCX, Tabelas Dinâmicas, Dashboards visuais interativos e automações.',
    fullDescription: 'O curso mais valorizado pelas empresas: transforme dados brutos em decisões estratégicas. Domine PROCV, PROCX, SOMASES, Tabelas Dinâmicas, Segmentação de Dados, Gráficos Avançados e Dashboards executivos.',
    duration: '2 a 4 meses',
    modality: '100% Prático no Computador',
    certificate: true,
    image: '/images/courses/excel-avancado.webp',
    featured: true,
    modules: [
      {
        title: 'Módulo 1: Fórmulas Avançadas de Busca e Lógica',
        topics: ['PROCV, PROCX, ÍNDICE e CORRESP', 'Funções lógicas aninhadas (SE, E, OU, SEERRO)', 'Funções condicionais (SOMASES, CONT.SES, MÉDIASES)']
      },
      {
        title: 'Módulo 2: Análise de Dados e Tabelas Dinâmicas',
        topics: ['Criação e formatação de Tabelas Dinâmicas', 'Campos calculados e agrupamento de datas', 'Segmentação de dados e linha do tempo']
      },
      {
        title: 'Módulo 3: Dashboards Profissionais e Automação',
        topics: ['Design de painéis visuais interativos (Dashboards)', 'Gráficos combinados, termômetro e velocímetro', 'Validação de dados avançada e introdução a Macros']
      }
    ],
    targetAudience: 'Profissionais e estudantes que querem se destacar em processos seletivos e cargos de análise e gestão.',
    careerOpportunities: [
      'Analista Administrativo, Financeiro ou de RH',
      'Controle de Estoque, Produção e Vendas',
      'Diferencial decisivo em entrevistas de emprego'
    ],
    whatsappMessage: 'Olá! Tenho interesse no Curso de Excel Avançado.'
  },
  {
    id: 16,
    title: 'Informática Empresarial',
    slug: 'informatica-empresarial',
    category: 'TECNOLOGIA & INFORMÁTICA',
    categorySlug: 'tecnologia',
    shortDescription: 'Focado no uso corporativo da tecnologia: ferramentas Google Workspace, Pacote Office avançado e rotinas empresariais.',
    fullDescription: 'Capacite-se para as exigências reais do ambiente corporativo moderno: integração de ferramentas na nuvem (Google Drive, Docs, Sheets, Meet), comunicação corporativa segura e automação de rotinas de escritório.',
    duration: '3 a 6 meses',
    modality: '100% Prático no Computador',
    certificate: true,
    image: '/images/courses/informatica-empresarial.webp',
    modules: [
      {
        title: 'Módulo 1: Ferramentas Google Workspace e Nuvem',
        topics: ['Google Drive corporativo e compartilhamento com permissões', 'Google Planilhas colaborativas em tempo real', 'Google Forms para pesquisas e cadastros']
      },
      {
        title: 'Módulo 2: Office para Produtividade Empresarial',
        topics: ['Mala direta e automação de documentos no Word', 'Planilhas de faturamento e controle de custos no Excel', 'Segurança da informação e boas práticas com senhas']
      },
      {
        title: 'Módulo 3: Comunicação Corporativa e Reuniões Online',
        topics: ['Etiqueta e redação de e-mails formais no Outlook/Gmail', 'Organização de agendas e reuniões no Google Meet/Teams', 'Técnicas de trabalho em equipe no Home Office']
      }
    ],
    targetAudience: 'Profissionais que desejam aumentar sua produtividade e trabalhar em escritórios modernos.',
    careerOpportunities: [
      'Auxiliar e Assistente de Escritório',
      'Secretariado e Recepção Corporativa',
      'Atendimento a Clientes e Suporte Operacional'
    ],
    whatsappMessage: 'Olá! Gostaria de saber mais sobre o Curso de Informática Empresarial.'
  },
  {
    id: 17,
    title: 'Informática Avançada',
    slug: 'informatica-avancada',
    category: 'TECNOLOGIA & INFORMÁTICA',
    categorySlug: 'tecnologia',
    shortDescription: 'Manutenção preventiva, configuração de redes, segurança digital avançada e ferramentas produtivas.',
    fullDescription: 'Aprenda montagem e manutenção de computadores, instalação de sistemas operacionais, diagnóstico de falhas de hardware e software, configuração de redes Wi-Fi locais e técnicas de segurança digital.',
    duration: '3 a 6 meses',
    modality: '100% Prático no Computador',
    certificate: true,
    image: '/images/courses/informatica-avancada.webp',
    modules: [
      {
        title: 'Módulo 1: Hardware e Montagem de Computadores',
        topics: ['Identificação e teste de componentes (Placa-mãe, CPU, RAM, SSD/HD, Fonte)', 'Montagem passo a passo e troca de peças', 'Limpeza preventiva e aplicação de pasta térmica']
      },
      {
        title: 'Módulo 2: Sistemas Operacionais e Formatação',
        topics: ['Criação de pen drive bootável e formatação', 'Instalação do Windows e configuração de drivers', 'Particionamento de disco e backup de arquivos']
      },
      {
        title: 'Módulo 3: Redes Locais e Segurança da Informação',
        topics: ['Crimpar cabos de rede (RJ-45) e testar conexões', 'Configuração de roteadores e redes Wi-Fi', 'Remoção de malwares e otimização de desempenho']
      }
    ],
    targetAudience: 'Pessoas que desejam trabalhar com suporte técnico, manutenção ou aprofundar seus conhecimentos em TI.',
    careerOpportunities: [
      'Técnico de Suporte (Help Desk)',
      'Assistência Técnica de Computadores e Notebooks',
      'Instalador e Administrador de Redes Locais'
    ],
    whatsappMessage: 'Olá! Quero saber mais sobre o Curso de Informática Avançada.'
  },
  {
    id: 18,
    title: 'Informática Aplicada aos Estudos',
    slug: 'informatica-aplicada-aos-estudos',
    category: 'TECNOLOGIA & INFORMÁTICA',
    categorySlug: 'tecnologia',
    shortDescription: 'Capacita estudantes para elaboração de trabalhos escolares e acadêmicos nas normas ABNT, pesquisas eficazes e apresentações.',
    fullDescription: 'Ideal para quem estuda e precisa produzir trabalhos de alta qualidade: formatação automática nas normas ABNT, citações, referências bibliográficas, pesquisas acadêmicas confiáveis e apresentações em slides de alto impacto.',
    duration: '2 a 4 meses',
    modality: '100% Prático no Computador',
    certificate: true,
    image: '/images/courses/INFORMATICA-APLICADA-1.webp',
    modules: [
      {
        title: 'Módulo 1: Normas ABNT no Microsoft Word',
        topics: ['Margens, espaçamento, fontes e numeração de páginas', 'Citações diretas, indiretas e notas de rodapé', 'Geração automática de sumário e referências']
      },
      {
        title: 'Módulo 2: Apresentações de Sucesso no PowerPoint',
        topics: ['Estrutura e roteiro de apresentações acadêmicas', 'Design limpo de slides sem poluição visual', 'Uso de tópicos, imagens e gráficos ilustrativos']
      },
      {
        title: 'Módulo 3: Pesquisa Eficiente e Organização Digital',
        topics: ['Pesquisa no Google Acadêmico e checagem de fontes', 'Organização de resumos e cronogramas de estudo', 'Uso de inteligência artificial com responsabilidade nos estudos']
      }
    ],
    targetAudience: 'Estudantes do Ensino Fundamental II, Ensino Médio, Cursos Técnicos e Universitários.',
    careerOpportunities: [
      'Alunos mais preparados para notas máximas em TCC e seminários',
      'Monitores de informática escolar',
      'Destaque no ingresso em estágios acadêmicos'
    ],
    whatsappMessage: 'Olá! Gostaria de informações sobre o Curso de Informática Aplicada aos Estudos.'
  },
  {
    id: 19,
    title: 'Formação Completa em Informática',
    slug: 'informatica',
    category: 'TECNOLOGIA & INFORMÁTICA',
    categorySlug: 'tecnologia',
    shortDescription: 'Programa completo do básico ao avançado, cobrindo digitação, Windows, Office completo e ferramentas digitais corporativas.',
    fullDescription: 'A formação mais completa da EasyTraining: você entra sem saber nada e sai preparado para qualquer desafio de escritório, atendimento ou gestão que exija domínio pleno do computador e das ferramentas do Pacote Office.',
    duration: '6 a 12 meses',
    modality: '100% Prático no Computador',
    certificate: true,
    image: '/images/courses/Curso-de-Informatica-em-Guarulhos-presencial-na-Easytraining.webp',
    modules: [
      {
        title: 'Módulo 1: Informática Básica e Digitação',
        topics: ['Windows, arquivos, nuvem e digitação rápida', 'Segurança na internet e e-mails profissionais']
      },
      {
        title: 'Módulo 2: Pacote Office Essencial e Corporativo',
        topics: ['Microsoft Word: redação e documentos empresariais', 'Microsoft Excel: do básico a fórmulas e relatórios', 'Microsoft PowerPoint: apresentações corporativas']
      },
      {
        title: 'Módulo 3: Excel Avançado e Produtividade',
        topics: ['PROCV, PROX, Tabelas Dinâmicas e Gráficos', 'Google Workspace e trabalho em equipe']
      }
    ],
    targetAudience: 'Quem busca uma qualificação completa de longo prazo com certificado de peso no currículo.',
    careerOpportunities: [
      'Setor Administrativo e Financeiro',
      'Atendimento e Recepção Comercial',
      'Cargos Corporativos e Concursos Públicos'
    ],
    whatsappMessage: 'Olá! Gostaria de informações sobre a Formação Completa em Informática.'
  }
];
