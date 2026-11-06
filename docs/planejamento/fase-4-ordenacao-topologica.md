# Fase 4 — Ordenação topológica e detecção de ciclos

**Status:** implementada (aguardando checkpoint)
**Prazo:** 07/11
**Itens do backlog:** B-006, B-007, B-028, B-029

## Objetivo
Dado o grafo e o que a pessoa já concluiu, gerar uma **ordem de estudo válida** (cada habilidade depois de todos os seus pré-requisitos) e **detectar ciclos** que invalidariam a trilha. Só lógica em TypeScript puro, com testes. A tela vem na fase da interface nova.

## Conceitos
- **Ordenação topológica:** uma lista em que toda seta aponta "para a frente". Como se vestir: meia antes do sapato. Existem várias ordens válidas; nenhuma pode violar uma dependência.
- **Grau de entrada:** quantos pré-requisitos uma habilidade ainda tem pendentes na contagem. `dom` começa com 2.
- **Algoritmo de Kahn:**
  1. conte o grau de entrada de cada habilidade;
  2. ponha numa fila as de grau 0 (podem começar já);
  3. tire uma da fila, escreva na lista final e diminua 1 no grau de quem dependia dela (usa os `dependentes` da Fase 2); quem chegar a 0 entra na fila;
  4. repita até a fila esvaziar.
- **Ciclo:** A exige B e B exige A. Nenhum chega a grau 0, então **sobram habilidades fora da lista**. Se `ordem.length < total`, há ciclo. O mesmo algoritmo ordena e valida.
- **Complexidade:** cada habilidade e cada seta é visitada uma vez: O(V + E). Com 25 e 28, é instantâneo.

## Plano
1. Você aprova este plano.
2. `src/dominio/ordenacao.ts`:
   - `ordenacaoTopologica(grafo)` devolve `{ ordem, sobraram }`. `sobraram` são as habilidades que não conseguiram entrar (estão num ciclo ou dependem de um).
   - `validarSemCiclos(grafo)` dá erro listando `sobraram`.
   - `trilhaPersonalizada(grafo, concluidas, meta?)` devolve, na ordem topológica, o que ainda falta estudar. Sem `meta`: todas as habilidades não concluídas. Com `meta` (ex.: "React"): só ela e os pré-requisitos pendentes dela.
3. Testes em `src/dominio/ordenacao.test.ts`.
4. Teste nos dados reais: o grafo da carreira não tem ciclos; o grafo das **áreas** também não, e cada ligação entre áreas avança de etapa (B-028).

## Decisões e alternativas descartadas
- **Kahn, e não DFS em pós-ordem.** A DFS também gera uma ordem topológica (a sugestão de pré-requisitos da Fase 2 já sai em pós-ordem). Escolho Kahn porque detecta o ciclo de forma natural (sobram nós), é o algoritmo que o resumo cita e fica fácil de explicar com uma fila e contadores.
- **Desempate estável:** quando várias habilidades estão prontas ao mesmo tempo, vale a ordem do JSON. Os testes verificam a **validade** da ordem, não uma ordem exata (exceto num exemplo pequeno), porque várias ordens estão corretas.
- **`sobraram` não é "o ciclo":** inclui também quem depende do ciclo. Mostrar o caminho exato do ciclo é um extra (C), fora do escopo.
- **A interface fica para depois.** Sem tela nova nesta fase, para não construir algo que a interface nova vai refazer. A "ordem de estudo" entra como um botão/painel na trilha da fase de interface.

## Como testar
`npm test`. Casos principais:
- Exemplo pequeno (`logica → js → dom`, `html-sem → dom`): ordem esperada e `sobraram` vazio.
- Propriedade: em qualquer ordem devolvida, todo pré-requisito vem antes do dependente.
- Ciclo simples (A↔B), ciclo de três (A→B→C→A) e auto-dependência: `sobraram` não vazio e `validarSemCiclos` dá erro.
- Habilidade que depende de um ciclo também fica em `sobraram`; as independentes entram na ordem.
- Dados reais: 25 habilidades na ordem, sem repetir, sem ciclo.
- `trilhaPersonalizada`: não inclui o que já está concluído; respeita a ordem; com `meta = react` traz só React e os pré-requisitos pendentes; com a meta já concluída, devolve lista vazia.
- Áreas: grafo de áreas acíclico e etapas válidas (mapa área → etapa definido no teste).

## Fora do escopo
Mostrar o caminho exato do ciclo, interface, XP.

## Riscos
Baixo. O maior risco é um teste que só confere "tem 25 itens" e não a ordem. Mitigação: o teste de propriedade acima é obrigatório.

## Resumo do aprendizado
(Preencher ao final.)

## Checkpoint
- Commit sugerido: `feat: adiciona ordenação topológica (Kahn), detecção de ciclos e trilha personalizada`
- Aprovado por mim para avançar? [ ]
