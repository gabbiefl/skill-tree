# Fase 0 — Descoberta e decisões

**Status:** rascunho (aguardando aprovação)
**Prazo:** 29–30/10
**Itens do backlog:** B-001, B-002

## Objetivo
Fechar as decisões que destravam o código: tecnologia, carreira, estrutura de pastas e a estratégia árvore → DAG. Ao final, o repositório está iniciado e o ambiente roda um teste de exemplo.

## Estado encontrado
Nada havia sido iniciado: pasta vazia, sem Git. O resumo da mostra declara mapeamento e árvore "em andamento"; o plano é entregar ambos até 12/11 (Fases 1 e 2).

## Decisões já tomadas
- **Interface:** web.
- **Linguagem:** TypeScript com React (decisão do aluno, que já os conhece; TS é JavaScript com tipos, a linguagem da disciplina). Ferramentas: **Vite** (build/servidor) e **Vitest** (testes).
- **Lógica separada do React:** árvore, regras e ordenação topológica ficam em `src/dominio/` em TypeScript puro, sem importar React. O React só exibe.
- **Biblioteca de roadmap (React Flow):** decisão adiada para a Fase 3.
- **Publicação:** GitHub Pages.
- **Carreira de referência:** Desenvolvedor Front-end, com 20 a 30 habilidades.
- **Fonte dos dados:** roadmap.sh (Frontend) como base, citado em cada habilidade; reescrever com nossas palavras, não copiar.
- **Repositório:** https://github.com/gabbiefl/skill-tree.git (público).

## Decisões propostas (preciso da sua aprovação)
1. **(APROVADA)** React + TypeScript + Vite. Por quê: componentes reaproveitáveis e tipos nos dados. Descartado: JS puro (menos conceitos, mas sem componentes). Risco: gastar tempo com React em vez das estruturas; mitigado separando a lógica.
2. **(APROVADA)** Testes com **Vitest**, que entende TypeScript sem configuração extra. Descartado: `node:test` (não lê TS direto) e Jest (mais configuração).
3. **Biblioteca de visualização:** decidir na Fase 3 (React Flow ou desenho próprio em SVG).
4. **Dados em JSON, separados do código:** cada habilidade tem `id`, `nome`, `descricao`, `prerequisitos` (lista de ids) e `fonte`. Uma lista de pré-requisitos serve tanto para a árvore (um pai) quanto para o DAG (vários), então a mesma base de dados atende as duas fases.
5. **Estrutura de pastas:**
   ```
   dados/             JSON da carreira
   src/dominio/       estruturas e regras (TypeScript puro, sem React)
   src/componentes/   interface em React
   src/               ponto de entrada da aplicação
   docs/              planejamento e documentação
   ```
6. **Estratégia árvore → DAG:** primeiro a árvore (Fase 2), depois o DAG com ordenação topológica (Fase 4), mostrando na banca por que a árvore não bastou.

## Conceitos
- **Estrutura de dados:** forma de organizar informação para que certas perguntas sejam fáceis de responder. Aqui: "o que preciso saber antes de React?".
- **Módulo ES:** um arquivo JS que exporta funções para outros importarem, como `import` no Dart.

## Plano
1. Você aprova as decisões propostas acima.
2. Iniciar o repositório (feito: `git init` e remoto configurado) e criar `.gitignore`.
3. Criar a estrutura de pastas e um teste mínimo para confirmar que `node --test` roda.
4. Primeiro commit local; só envio ao GitHub quando você mandar.

## Como testar
Rodar `node --test` na raiz e ver o teste de exemplo passar.

## Fora do escopo
Qualquer código de árvore, interface ou dados reais (fases seguintes).

## Riscos
- Prazo curto: o corte, se precisar, é a avaliação, nunca testes ou README.
- Visualização feita à mão pode tomar tempo: plano B é uma lista indentada para a árvore e uma biblioteca para o roadmap.

## Resumo do aprendizado
(Preencher ao final.)

## Checkpoint
- Commit sugerido: `docs: inicia projeto com CLAUDE.md, backlog e planejamento`
- Aprovado por mim para avançar? [ ]
