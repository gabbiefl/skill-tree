# Fase 1 — Dados da carreira (Desenvolvedor Front-end)

**Status:** implementada (aguardando checkpoint)
**Prazo:** 30–31/10
**Itens do backlog:** B-003

## Objetivo
Ter um arquivo JSON com 25 habilidades de Front-end e seus pré-requisitos, com fonte citável, separado do código e validado por teste.

## Conceitos
- **Nó:** uma habilidade (ex.: "JavaScript básico").
- **Aresta:** a seta "precisa de" entre duas habilidades.
- **Lista de adjacência:** cada habilidade guarda a lista de ids dos pré-requisitos. É a forma mais simples de guardar um grafo e serve também para a árvore.
- **Raiz:** habilidade sem pré-requisito, ponto de entrada da trilha.

## Fonte e honestidade
O roadmap.sh lista as habilidades da carreira, mas **não define pré-requisitos entre elas**. A lista de habilidades parte dele; as ligações de pré-requisito são **curadoria dos autores**, justificadas por lógica de aprendizagem (ex.: o DOM manipula HTML, então exige HTML e JavaScript). Isso será dito no README e na apresentação. Cada habilidade terá `fonte` (links consultados).

## Formato de cada habilidade (proposta)
```json
{
  "id": "js-basico",
  "nome": "JavaScript básico",
  "area": "javascript",
  "descricao": "Variáveis, funções, condicionais e laços.",
  "prerequisitos": ["logica"],
  "fontes": ["https://roadmap.sh/frontend"]
}
```
Campo `materiais` (recomendações de estudo) fica para depois: B-018.

## Habilidades propostas (25)
Raízes (sem pré-requisito): internet, logica, terminal.

| id | Habilidade | Pré-requisitos |
|----|-----------|----------------|
| internet | Como a web funciona | — |
| logica | Lógica de programação | — |
| terminal | Terminal básico | — |
| html | HTML básico | internet |
| html-semantico | HTML semântico e formulários | html |
| acessibilidade | Acessibilidade | html-semantico |
| seo | SEO básico | html-semantico |
| css | CSS básico | html |
| layout | Layout (Flexbox e Grid) | css |
| responsivo | Design responsivo | layout |
| ux | UX básico | responsivo |
| js-basico | JavaScript básico | logica |
| dom | DOM e eventos | js-basico, html-semantico |
| js-async | JavaScript assíncrono | js-basico |
| api-rest | Consumo de APIs REST | js-async, internet |
| git | Git e GitHub | terminal |
| npm | npm e pacotes | js-basico, terminal |
| build | Ferramentas de build (Vite) | npm |
| typescript | TypeScript | js-basico |
| testes | Testes automatizados | js-basico |
| devtools | Depuração e DevTools | dom |
| react | React | dom, npm |
| react-hooks | Estado e hooks no React | react |
| react-api | Dados e APIs no React | react-hooks, api-rest |
| desempenho | Desempenho web | responsivo, api-rest |

Cinco habilidades têm **dois** pré-requisitos (dom, api-rest, react, react-api, desempenho, além de npm): é exatamente o caso que a árvore não representa e o DAG resolve.

## Plano
1. Você revisa a lista (nomes, pré-requisitos, o que falta ou sobra).
2. Criar `dados/frontend.json`.
3. Criar o tipo `Habilidade` em `src/dominio/` (o "molde" TypeScript do JSON).
4. Teste de validação dos dados: ids únicos, todo pré-requisito existe, toda `area` existe, sem ciclos (versão simples; a completa vem na Fase 4).

## Decisão tomada (árvore x vários pré-requisitos)
O modelo é o **DAG desde a Fase 2** (veja o roteiro). Dois reflexos nos dados:
- **Campo `area`:** cada habilidade pertence a uma área, formando a árvore de organização Carreira → Áreas → Habilidades (usada no modal e no menu).
- **"Pai" por convenção:** na visão em árvore derivada do grafo, o pai de uma habilidade é o **primeiro** item de `prerequisitos`. Por isso, nos casos com dois pré-requisitos, o principal vem primeiro na lista. Sem campo extra.

Áreas (7): Fundamentos (internet, logica, terminal); HTML (html, html-semantico, acessibilidade, seo); CSS (css, layout, responsivo, ux); JavaScript (js-basico, dom, js-async, api-rest, typescript); Ferramentas (git, npm, build); Qualidade (testes, devtools, desempenho); React (react, react-hooks, react-api).

Formato com a área:
```json
{ "id": "dom", "nome": "DOM e eventos", "area": "javascript",
  "descricao": "...", "prerequisitos": ["js-basico", "html-semantico"], "fontes": ["..."] }
```

## Como testar
`npm test` valida o JSON.

## Fora do escopo
Materiais de estudo (B-018), outras carreiras (B-016).

## Riscos
Discordância sobre ordem das habilidades. Mitigação: citar o critério e aceitar ajustes até a Fase 2.

## Resumo do aprendizado
(Preencher ao final.)

## Checkpoint
- Commit sugerido: `feat: adiciona dados da carreira Front-end e validação`
- Aprovado por mim para avançar? [ ]
