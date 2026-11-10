# Fase 8 — Identidade visual: cor por área e ícones

**Status:** em andamento (direção aprovada pelo aluno em 10/11)
**Prazo:** 11/11
**Itens do backlog:** B-031

## Objetivo
Dar mais vida à interface sem trocar o design: cada área da trilha ganha uma cor e um ícone próprios, e os cinco níveis (Semente a Árvore) ganham um ícone que cresce junto com o progresso.

## Conceitos
- **Redundância visual (acessibilidade):** o estado de uma habilidade (concluída, disponível, bloqueada) continua sendo dito pela borda e pelo ícone de estado, nunca só pela cor. A cor da área é só identidade, por isso não pode ser confundida com as cores de estado (azul-céu = disponível, cinza = bloqueada).
- **Dados x apresentação:** a cor de uma área é decisão visual, não regra do domínio. Fica no CSS (`data-area="html"`), e o `dados/frontend.json` e o `src/dominio/` não mudam.

## Plano
1. Ícones novos (7 de área + 5 de nível) em `Icones.tsx`, desenhados por nós em SVG (sem licença de terceiros).
2. Mapa área → ícone em `src/componentes/trilha/visualDasAreas.ts`.
3. `BlocoArea` mostra o ícone da área e marca o bloco com `data-area`.
4. Paleta por área em `src/estilos/areas.css` (faixa colorida no topo do bloco, ícone em "azulejo" tingido, barra de progresso na cor da área).
5. Cabeçalho mostra o ícone do nível no lugar do número (o número continua no texto e no `aria-label`).

## Decisões e alternativas descartadas
- Decisão: ícones próprios em SVG. Por quê: repositório público, então nada de licença para citar. Descartado: banco de ícones/imagens (exige crédito e destoa do design).
- Decisão: cor no CSS, não no JSON. Descartado: campo `cor` nos dados (mistura apresentação com conteúdo).
- Bloco bloqueado fica cinza (a cor da área some): o cadeado e o cinza precisam continuar óbvios.

## Como testar
- `npm run dev` e conferir cada área nos três estados.
- `npm test`, `npm run lint` e `npm run build` continuam passando.

## Fora do escopo
Ilustrações na tela de escolha de carreira e imagens de banco (ficam no backlog como B-032, prioridade C).

## Riscos
Cores parecidas entre áreas vizinhas. Plano B: ajustar só o `areas.css`.

## Resumo do aprendizado
(Preencher ao final.)

## Checkpoint
- Commit sugerido: `feat: adiciona cor e ícone por área e ícones de nível`
- Aprovado por mim para avançar? [x] direção; [ ] conferência visual
