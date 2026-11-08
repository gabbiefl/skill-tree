# Fase 5 — Tópicos e conclusão por tópicos

**Status:** implementada (aguardando checkpoint e revisão dos tópicos pelos autores)
**Prazo:** 07–08/11
**Itens do backlog:** B-023, B-024

## Objetivo
Cada habilidade ganha uma lista de tópicos (o passo a passo de estudo). O que a pessoa guarda passa a ser **tópicos concluídos**, e uma habilidade só é **concluída** quando todos os seus tópicos estão concluídos. Tudo em TypeScript puro, com testes. A tela do painel lateral vem na Fase 6; aqui a interface atual só é adaptada para continuar funcionando.

## Conceitos
- **Estado derivado, de novo:** guardamos só os tópicos concluídos. "Habilidade concluída" é calculada (todos os tópicos dela estão no conjunto). Um único dado de verdade, sem risco de contradição.
- **Tópicos não são nós do grafo:** o grafo continua com 25 habilidades e 28 ligações. Os tópicos são um checklist dentro da habilidade. A granularidade do grafo é a habilidade; o detalhe é conteúdo de estudo.
- **Progresso parcial:** uma habilidade com 3 de 6 tópicos continua **disponível** (não concluída), e quem depende dela continua bloqueado.
- **Identificador estável:** cada tópico tem um `id` fixo (formato `habilidade.assunto`, ex.: `html-semantico.formularios`). O progresso salvo aponta para o id, não para o texto; assim, corrigir um nome não apaga o progresso de ninguém.

## Plano
1. Você aprova este plano e revisa a lista de tópicos abaixo.
2. `src/dominio/tipos.ts`: tipo `Topico { id, nome }` e campo `topicos: Topico[]` em `Habilidade`.
3. `dados/frontend.json`: tópicos das 25 habilidades.
4. `src/dominio/progresso.ts`, funções puras:
   - `calcularConcluidas(grafo, topicosConcluidos)`: o conjunto de habilidades concluídas;
   - `progressoDaHabilidade(habilidade, topicosConcluidos)`: `{ feitos, total }`;
   - `marcarHabilidade` / `desmarcarHabilidade`: marcam ou desmarcam todos os tópicos dela;
   - `alternarTopico`: marca ou desmarca um tópico;
   - `marcarComPrerequisitos`: a habilidade e os pré-requisitos pendentes (a ação "Sim, marcar todas" do modal).
   `calcularEstados` e `sugerirPrerequisitos` não mudam: continuam recebendo o conjunto de habilidades concluídas, agora calculado.
5. Testes em `src/dominio/progresso.test.ts` e ampliação do teste de validação dos dados.
6. Adaptar `App.tsx` para guardar tópicos concluídos (o modal de conhecimentos marca todos os tópicos da habilidade). Sem tela de tópicos ainda.

## Decisões e alternativas descartadas
- **Guardar tópicos, derivar habilidades.** Descartado: guardar as duas coisas (podem se contradizer, por exemplo uma habilidade "concluída" com tópicos pendentes).
- **Conjuntos imutáveis:** as funções devolvem um novo `Set`, sem alterar o original. O React precisa disso para perceber a mudança e redesenhar.
- **Desmarcar um tópico desfaz a conclusão da habilidade**, e quem dependia dela volta a ficar bloqueado sozinho (o estado é calculado). Isso resolve o item B-020 sem código extra. Quem já tinha tópicos concluídos nas dependentes os mantém.
- **Quantidade de tópicos igual à do design** (119 no total, o que mantém os mockups coerentes). Se o prazo apertar, reduzimos.
- **Conteúdo é rascunho meu, revisão dos autores.** Eu não incluo links de materiais (B-018), porque link só entra verificado. O README só passa a dizer "curadoria dos autores" depois da revisão de vocês.

## Como testar
`npm test`. Casos principais:
- Toda habilidade tem pelo menos 1 tópico; ids de tópicos são únicos em todo o mapa e começam com o id da habilidade.
- Sem tópicos concluídos, nenhuma habilidade está concluída.
- Todos os tópicos de uma habilidade concluídos: ela vira concluída; faltando um, não.
- Habilidade com progresso parcial continua **disponível**, e a dependente continua **bloqueada**.
- `marcarHabilidade` marca todos os tópicos; `desmarcarHabilidade`, nenhum; as funções não alteram o conjunto original.
- Desmarcar um tópico de uma habilidade concluída desfaz a conclusão e bloqueia de novo o que dependia dela.
- `marcarComPrerequisitos` de `react` conclui React e os pré-requisitos pendentes, e respeita o que já estava concluído.

## Fora do escopo
Painel lateral e lista de tópicos na tela (Fase 6), XP e níveis (Fase 7), salvar no navegador (Fase 7), links de materiais (B-018).

## Riscos
- **Conteúdo:** 119 tópicos para revisar. Mitigação: lista abaixo, curta, e revisão em uma passada.
- **Adaptar `App.tsx`:** mudança pequena, mas é onde o estado vive. Coberta pela conferência manual no navegador.

## Rascunho dos tópicos (para revisão dos autores)
Contagem entre parênteses.

**Fundamentos**
- Como a web funciona (4): cliente e servidor; endereços (URL e DNS); HTTP, requisições e respostas; o que o navegador faz ao abrir uma página
- Lógica de programação (5): algoritmos, resolver problemas em passos; variáveis e tipos de dados; condicionais; laços de repetição; funções
- Terminal básico (4): navegar por pastas; criar, copiar, mover e apagar arquivos; executar comandos e programas; ler a ajuda de um comando

**HTML**
- HTML básico (5): estrutura do documento (doctype, head, body); títulos e parágrafos; links; imagens e texto alternativo; atributos (id, class, src, href)
- HTML semântico e formulários (6): tags semânticas (header, nav, main, footer); títulos e hierarquia; listas e tabelas; formulários e campos de entrada; rótulos (label) e agrupamento de campos; validação nativa do navegador
- Acessibilidade (4): texto alternativo e rótulos; navegação por teclado e foco; contraste de cores; leitores de tela e ARIA básico
- SEO básico (4): título e descrição da página; hierarquia de títulos; URLs legíveis e links internos; indexação (robots.txt e sitemap)

**CSS**
- CSS básico (6): seletores; cores e fundos; tipografia; modelo de caixa (margin, border, padding); especificidade e cascata; unidades (px, rem, %, vw)
- Layout, Flexbox e Grid (5): fluxo normal e display; Flexbox, eixo e alinhamento; Flexbox, quebra e espaço; CSS Grid, linhas, colunas e áreas; posicionamento (relative, absolute, sticky)
- Design responsivo (4): meta viewport; media queries; unidades e imagens flexíveis; abordagem mobile first
- UX básico (4): hierarquia visual e legibilidade; consistência e padrões de interface; feedback e estados (erro, carregando, vazio); fluxos simples e teste com pessoas reais

**JavaScript**
- JavaScript básico (6): variáveis (let, const) e tipos; operadores e condicionais; laços de repetição; funções; arrays e seus métodos (map, filter); objetos e JSON
- DOM e eventos (5): selecionar elementos; alterar texto, atributos e classes; criar e remover elementos; eventos (click, input, submit); ler e validar dados de formulários
- JavaScript assíncrono (5): síncrono e assíncrono; callbacks e temporizadores; Promises; async/await; tratamento de erros
- Consumo de APIs REST (4): o que é uma API REST (recursos e verbos HTTP); fetch e leitura de JSON; códigos de status e erros; envio de dados (POST) e cabeçalhos
- TypeScript (5): tipos básicos e inferência; interfaces e tipos de objetos; tipagem de funções; união e valores opcionais; genéricos (noções)

**Ferramentas**
- Git e GitHub (5): repositório, commit e histórico; branches e merge; repositório remoto (clone, push, pull); pull requests e revisão de código; .gitignore e conflitos
- npm e pacotes (4): package.json; instalar e remover dependências; scripts (npm run); versões e package-lock
- Ferramentas de build, Vite (4): para que serve um bundler; servidor de desenvolvimento e recarga automática; gerar a versão de produção; variáveis de ambiente e publicação

**Qualidade**
- Testes automatizados (5): por que e o que testar; testes de unidade; asserções e casos de borda; testes de componentes de interface; executar testes automaticamente
- Depuração e DevTools (4): inspecionar elementos e estilos; console e mensagens de erro; depurar com breakpoints; aba de rede e desempenho
- Desempenho web (5): Core Web Vitals; otimizar imagens; carregamento de JS e CSS (minificar, lazy load); cache; medir com Lighthouse

**React**
- React (5): componentes e JSX; props; listas e renderização condicional; eventos; composição (children)
- Estado e hooks no React (6): useState; eventos e atualização de estado; useEffect; dependências e limpeza de efeitos; useRef; hooks personalizados
- Dados e APIs no React (5): buscar dados com fetch e useEffect; estados de carregamento e erro; renderizar listas vindas da API; formulários controlados e envio; bibliotecas de dados (noções)

## Resumo do aprendizado
(Preencher ao final.)

## Checkpoint
- Commit sugerido: `feat: adiciona tópicos por habilidade e conclusão calculada a partir dos tópicos`
- Aprovado por mim para avançar? [ ]
