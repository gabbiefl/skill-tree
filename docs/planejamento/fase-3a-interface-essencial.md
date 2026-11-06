# Fase 3a — Interface essencial

**Status:** implementada, aguardando conferência no navegador
**Prazo:** 6–8/11
**Itens do backlog:** B-005, B-011, B-012, B-017 (parte visual)

## Objetivo
Uma pessoa abre o site, escolhe a carreira, marca o que já sabe num modal e vê a trilha como um grafo colorido (concluída, disponível, bloqueada). Ao clicar numa habilidade disponível, marca como concluída e a trilha se atualiza. Ao marcar uma habilidade com pré-requisitos pendentes, aparece o modal de sugestão.

## Conceitos
- **Componente React:** função que recebe dados (props) e devolve pedaço de tela, como um widget do Flutter.
- **Estado (`useState`):** o que a tela "lembra" e que, ao mudar, redesenha o componente. Aqui, o conjunto de ids concluídos.
- **Estado derivado:** os estados de cada habilidade **não** vão para o `useState`; são recalculados por `calcularEstados` a cada mudança. É a mesma ideia da Fase 2.
- **React Flow:** biblioteca que desenha nós e setas, com zoom e arraste. Ela **não decide onde cada nó fica**: a posição é por nossa conta.
- **Nível (camada):** posição de uma habilidade na trilha = 1 + o maior nível entre seus pré-requisitos (raízes são nível 0). Ex.: `logica` 0, `js-basico` 1, `dom` 2. Os níveis viram as colunas do desenho. É um primo da ordenação topológica da Fase 4.

## Decisões e alternativas descartadas
- **React Flow** (`@xyflow/react`), aprovada pelo aluno. Por quê: já cuida de nós, setas e zoom. Descartado: SVG à mão (mais controle, mais tempo).
- **Posições por nível, calculadas por nós em `src/dominio/niveis.ts` (TS puro, testado).** Por quê: zero biblioteca extra e o conceito é explicável. Descartado: dagre/elkjs (layout automático, mais uma dependência).
- **Sem perfil nem salvamento ainda:** o estado vive só na página (recarregar zera). Isso vem na 3b.
- **Visual simples:** cores da logo (azul-marinho, magenta, verde-limão). Sem animações.

## Plano
1. Você aprova este plano.
2. Instalar `@xyflow/react`.
3. `src/dominio/niveis.ts`: `calcularNiveis(grafo)`, com testes (raízes no nível 0; DOM abaixo de JS e HTML semântico).
4. Componentes em `src/componentes/`: `EscolhaCarreira`, `ModalConhecimentos` (agrupado por área), `Trilha` (React Flow), `ModalSugestao`.
5. `App.tsx` coordena as telas; remover o conteúdo-modelo do Vite e suas imagens.
6. Conferir no navegador (rodar `npm run dev`) e explicar o que cada trecho faz.

## Como testar
- `npm test`: testes dos níveis.
- Manual: escolher Front-end, marcar "JavaScript básico" no modal e ver `DOM` continuar bloqueado; marcar "React" e ver o modal sugerir os pré-requisitos.

## Fora do escopo
Perfil, localStorage, XP, visão em árvore, ordenação topológica, ciclos, responsividade fina para celular.

## Riscos
- **Médio:** React Flow tem curva de aprendizado e o desenho de 25 nós pode ficar poluído. Plano B: lista agrupada por área, com o mesmo cálculo de estados, mantendo o grafo como visão extra.
- Tempo: 3 dias para a fase mais pesada. Se estourar, a 3b é cortada.

## Resumo do aprendizado
(Preencher ao final.)

## Checkpoint
- Commit sugerido: `feat: adiciona interface com modal de conhecimentos e trilha em grafo`
- Aprovado por mim para avançar? [ ]
