# Fase 2 — Modelo em DAG e regras de liberação

**Status:** implementada (aguardando checkpoint). B-017: a função de sugestão está pronta; o modal fica na Fase 3.
**Prazo:** 1–3/11
**Itens do backlog:** B-004, B-017

## Objetivo
Ter, em TypeScript puro e testado, o grafo de habilidades e as regras que respondem: dado o que a pessoa já concluiu, qual o estado de cada habilidade (concluída, disponível, bloqueada) e quais pré-requisitos sugerir ao marcar uma habilidade. Sem interface.

## Conceitos
- **Grafo por lista de adjacência:** cada habilidade guarda seus pré-requisitos (já é o que o JSON tem). Ex.: `dom → [js-basico, html-semantico]`.
- **Adjacência reversa (dependentes):** o caminho inverso, "o que esta habilidade libera". Ex.: `js-basico → [dom, js-async, npm, ...]`. Calculamos uma vez e guardamos, para não varrer tudo a cada pergunta.
- **Conjunto (`Set`):** coleção sem repetição, ideal para "ids concluídos" (perguntar se um id está lá é imediato).
- **DFS (busca em profundidade):** percurso que segue um caminho até o fim antes de voltar. Aqui, sobe pelos pré-requisitos até as raízes para achar todos os ancestrais ("para React, antes preciso de DOM, JS básico, lógica, HTML...").
- **Conjunto de visitados:** evita visitar o mesmo nó duas vezes, o que também impede loop infinito se algum dia houver ciclo.

## Regras (a "lei" do projeto)
- **Concluída:** o id está no conjunto de concluídas.
- **Disponível:** não está concluída e **todos** os pré-requisitos estão concluídos. Quem não tem pré-requisito (raiz) já nasce disponível.
- **Bloqueada:** o resto.
- **Sugestão de pré-requisitos (B-017):** ao marcar uma habilidade, devolve todos os ancestrais ainda não concluídos. A interface (Fase 3) mostra o modal e a pessoa decide; a função só calcula.

## Plano
1. Você aprova este plano.
2. `src/dominio/grafo.ts`: função que monta o grafo a partir da lista de habilidades (mapa por id + dependentes). Falha com mensagem clara se um pré-requisito não existir.
3. `src/dominio/estados.ts`: `calcularEstados(grafo, concluidas)` e `sugerirPrerequisitos(grafo, id, concluidas)`.
4. Testes em `src/dominio/estados.test.ts`, com um grafo pequeno escrito no próprio teste (fácil de entender) e alguns casos com os dados reais.
5. Remover o teste provisório `ambiente.test.ts`.

## Decisões e alternativas descartadas
- **Estado calculado, não guardado:** só guardamos o que a pessoa concluiu; disponível e bloqueada saem de cálculo. Por quê: um único dado de verdade, sem risco de ficar inconsistente. Descartado: guardar o estado de cada habilidade.
- **Concluída vale mesmo com pré-requisito pendente:** se a pessoa recusar a sugestão do modal, respeitamos. Os dependentes só ficam disponíveis quando **todos** os pré-requisitos estiverem concluídos.
- **Sem recursão em grafo grande:** DFS com pilha explícita ou recursão simples? Com 25 nós, a recursão é mais legível. Fica a recursiva, com o conjunto de visitados.
- **Desmarcar uma habilidade que tem dependentes concluídos:** fora do escopo agora (B-020).

## Como testar
`npm test`. Casos principais:
- Sem nada concluído: só as raízes ficam disponíveis; o resto, bloqueado.
- Concluir `js-basico` sozinho: `dom` continua **bloqueado** (falta `html-semantico`). Este é o caso que a árvore erraria.
- Concluir `js-basico` e `html-semantico`: `dom` fica disponível.
- Habilidade concluída aparece como concluída, mesmo sem os pré-requisitos.
- Sugestão para `react`: devolve todos os ancestrais pendentes, sem repetir (mesmo que haja dois caminhos até a mesma habilidade) e sem incluir os já concluídos.
- Sugestão para uma raiz: lista vazia.
- Pré-requisito inexistente: a montagem do grafo dá erro.
- **Árvore como caso particular:** num grafo em que cada nó tem um só pré-requisito, o resultado é o que a regra "pai concluído" da árvore daria. É o teste que sustenta o argumento do resumo.
- Dados reais: nenhum estado inconsistente (toda habilidade recebe um estado).

## Fora do escopo
Interface, ordenação topológica e detecção de ciclos (Fase 4), XP, salvar progresso (B-013), desmarcar com dependentes (B-020).

## Riscos
Baixo. O código é curto; o maior risco é escrever testes fracos. Mitigação: o caso do `dom` acima é obrigatório.

## Resumo do aprendizado
(Preencher ao final.)

## Checkpoint
- Commit sugerido: `feat: adiciona grafo de habilidades e regras de liberação com testes`
- Aprovado por mim para avançar? [ ]
