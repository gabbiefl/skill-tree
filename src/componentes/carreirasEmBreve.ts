import type { NomeIcone } from './Icones'

// ATENÇÃO: isto é só uma PRÉVIA VISUAL das carreiras "em breve". Não são dados da carreira:
// não passam pelo domínio, não têm fonte citada, nem pré-requisitos, nem revisão dos autores.
// Servem para mostrar a visão do projeto (B-016, adiado). O Front-end é a única carreira real.

export interface AreaPrevia {
  nome: string
  icone: NomeIcone
  // Nome da cor na paleta de areas.css (atributo data-cor).
  cor: string
  habilidades: string[]
}

export interface CarreiraPrevia {
  nome: string
  descricao: string
  // Desenho do cartão: linhas e posição dos nós.
  linhas: string
  nos: number[][]
  areas: AreaPrevia[]
}

export const CARREIRAS_EM_BREVE: CarreiraPrevia[] = [
  {
    nome: 'Desenvolvedor Back-end',
    descricao: 'Servidores, bancos de dados e APIs por trás dos aplicativos.',
    linhas: 'M60 75L130 45M60 75L130 105M130 45L210 45M130 105L210 105M210 45L262 75M210 105L262 75',
    nos: [[60, 75], [130, 45], [130, 105], [210, 45], [210, 105], [262, 75]],
    areas: [
      { nome: 'Fundamentos', icone: 'camadas', cor: 'lilas', habilidades: ['Lógica de programação', 'Estruturas de dados', 'Algoritmos', 'Complexidade'] },
      { nome: 'Linguagem do servidor', icone: 'chaves', cor: 'amarelo', habilidades: ['Sintaxe e tipos', 'Assincronia', 'Módulos e pacotes', 'Tratamento de erros'] },
      { nome: 'APIs', icone: 'nuvem', cor: 'laranja', habilidades: ['HTTP e REST', 'GraphQL', 'Autenticação com JWT', 'Versionamento', 'Documentação (OpenAPI)'] },
      { nome: 'Banco de dados', icone: 'banco', cor: 'ciano', habilidades: ['SQL', 'Modelagem relacional', 'Índices', 'Transações', 'NoSQL'] },
      { nome: 'Segurança', icone: 'escudo', cor: 'vermelho', habilidades: ['OWASP Top 10', 'Hash de senhas', 'Limite de requisições'] },
      { nome: 'Infra e deploy', icone: 'servidor', cor: 'verde', habilidades: ['Docker', 'CI/CD', 'Variáveis de ambiente', 'Logs e monitoramento'] },
    ],
  },
  {
    nome: 'Analista de Dados',
    descricao: 'Colete, limpe e analise dados para responder perguntas.',
    linhas: 'M56 100L120 60M120 60L190 90M190 90L256 48M120 60L190 40',
    nos: [[56, 100], [120, 60], [190, 90], [190, 40], [256, 48]],
    areas: [
      { nome: 'Estatística', icone: 'grafico', cor: 'lilas', habilidades: ['Média, mediana e moda', 'Distribuições', 'Correlação', 'Testes de hipótese'] },
      { nome: 'Python e SQL', icone: 'codigo', cor: 'amarelo', habilidades: ['Python básico', 'Pandas', 'SQL analítico', 'Notebooks'] },
      { nome: 'Coleta e limpeza', icone: 'tabela', cor: 'laranja', habilidades: ['Valores nulos', 'Padronização', 'ETL', 'Web scraping'] },
      { nome: 'Visualização', icone: 'gota', cor: 'rosa', habilidades: ['Escolha do gráfico', 'Dashboards', 'Storytelling com dados'] },
      { nome: 'Aprendizado de máquina', icone: 'raio', cor: 'violeta', habilidades: ['Regressão', 'Classificação', 'Validação de modelos', 'Engenharia de atributos'] },
      { nome: 'Negócio e ética', icone: 'escudo', cor: 'turquesa', habilidades: ['Métricas e KPIs', 'LGPD', 'Vieses nos dados'] },
    ],
  },
  {
    nome: 'Desenvolvedor Mobile',
    descricao: 'Aplicativos para celular, do primeiro layout à publicação.',
    linhas: 'M52 75L112 42M52 75L112 108M112 42L180 75M112 108L180 75M180 75L254 75',
    nos: [[52, 75], [112, 42], [112, 108], [180, 75], [254, 75]],
    areas: [
      { nome: 'Fundamentos mobile', icone: 'celular', cor: 'violeta', habilidades: ['Ciclo de vida do app', 'Navegação', 'Permissões', 'Gestos'] },
      { nome: 'Interface', icone: 'camadas', cor: 'rosa', habilidades: ['Layouts responsivos', 'Temas e modo escuro', 'Componentes reutilizáveis'] },
      { nome: 'Dados no aparelho', icone: 'banco', cor: 'ciano', habilidades: ['Armazenamento local', 'SQLite', 'Cache offline'] },
      { nome: 'Conectividade', icone: 'nuvem', cor: 'laranja', habilidades: ['Consumo de APIs', 'Sincronização', 'Notificações push', 'Tempo real'] },
      { nome: 'Desempenho', icone: 'raio', cor: 'amarelo', habilidades: ['Profiling', 'Animações fluidas', 'Consumo de bateria'] },
      { nome: 'Publicação', icone: 'terminal', cor: 'verde', habilidades: ['Assinatura do app', 'Google Play', 'App Store', 'Versões e releases'] },
      { nome: 'Qualidade', icone: 'escudo', cor: 'turquesa', habilidades: ['Testes de interface', 'Acessibilidade', 'Monitoramento de falhas'] },
    ],
  },
]
