# Fase 6 — Interface nova (handoff)

**Status:** implementada (aguardando checkpoint)
**Prazo:** 08–10/11
**Itens do backlog:** B-025, B-021, B-022, B-011, B-012, B-017 (parte visual), B-029 (parte visual)

## Objetivo
Substituir a interface provisória pela do design (`ref/`, fora do Git): tokens e fontes, cabeçalho, escolha da carreira, modal de conhecimentos, trilha em etapas (variação 3A), painel lateral com tópicos, modal de sugestão e "ordem de estudo". A lógica (`src/dominio/`) não muda.

## Conceitos
- **Design tokens:** valores de design (cor, espaçamento, raio) guardados como variáveis CSS (`--st-navy`), usados em todo o site. Mudar a cor num lugar muda o site inteiro.
- **Componente de apresentação:** recebe dados e devolve tela, sem regra de negócio. As regras continuam em `src/dominio/`.
- **Layout fluido x absoluto:** os mockups usam coordenadas fixas (1440 × 900). Na implementação, as colunas são `flex`, e os blocos se empurram quando uma área expande.
- **Ligações como SVG sobre o layout:** a posição de cada bloco é medida no navegador (`getBoundingClientRect`) e as linhas são desenhadas por cima, em ângulo reto com cantos arredondados.

## Decisão estrutural que preciso confirmar: React Flow na trilha 3A
O React Flow foi escolhido para o grafo livre (zoom, arrastar). O design 3A é um **layout fixo em colunas**, com blocos que expandem e ligações ortogonais por canais. Nesse desenho a biblioteca não ajuda e atrapalha: os blocos têm altura variável, as ligações saem de linhas dentro dos blocos e o zoom/arraste não existem na tela.
- **Opção A (recomendada):** montar a trilha 3A com HTML/CSS (colunas flex) e um SVG por cima para as ligações, e **remover o React Flow**. Menos código estranho, fiel ao mockup, mais fácil de explicar. Custo: escrevo a função que traça as ligações (pura e testada).
- **Opção B:** manter o React Flow com nós e arestas personalizados. Funciona, mas exige uma alça (`Handle`) por habilidade, recalcular posições a cada expansão e arestas dinâmicas. Mais frágil, e o prazo é curto.
Se escolher A, o README e o CLAUDE.md são atualizados (React Flow sai da lista) e a dependência é removida.

## Plano (quatro passos, um commit por passo)
**6.1 Fundação visual (Parte A)**
1. Fontes Lexend e Nunito Sans pelo Google Fonts (`<link>` no `index.html`).
2. `src/estilos/`: tokens e classes de componentes copiados do `ref/codigo/skilltree.css`, sem as regras só de documentação (`.pin`, `.sw`, `.spec`, `.tbl`) e sem posicionamento absoluto.
3. `src/componentes/Icones.tsx`: ícones SVG do handoff (check, cadeado, play, seta, fechar, engrenagem, etc.).
4. Cabeçalho (logo + menu de configurações com "Editar conhecimentos" e "Trocar carreira"), tela de escolha da carreira, modal de conhecimentos (caixas parciais "2 de 3", "N tópicos") e modal de sugestão. O medidor de nível/XP e o texto de XP aparecem na Fase 7.

**6.2 Painel lateral e tópicos (funcional, na trilha atual)**
1. Clicar numa habilidade abre o painel: estado, área, descrição, pré-requisitos e "Libera" (chips clicáveis), tópicos com caixas e barra de progresso, botão "Marcar todos como concluídos".
2. Marcar um tópico avulso não abre modal; as ações da habilidade inteira (botão do painel e caixa do modal de conhecimentos) abrem a sugestão se houver pré-requisitos pendentes.
3. Desde aqui, os tópicos são usáveis de verdade.

**6.3 Trilha 3A**
1. Dados: `etapas` (5, com nome) e `etapa` em cada área, em `dados/frontend.json`, para o layout vir dos dados (o teste de etapas deixa de ter o mapa fixo no código).
2. Colunas por etapa, blocos de área com mini-mapa de habilidades e barra "N/total"; clicar expande a área e mostra as habilidades.
3. Ligações esmaecidas entre áreas (10); ao focar uma habilidade, só as ligações dela em destaque (pré-requisito pendente tracejado) e rótulos "de onde vem / o que libera" nas áreas fechadas.
4. Teclado: blocos e habilidades são botões, com anel de foco.

**6.4 Ordem de estudo**
Botão "Ver ordem de estudo" abre um modal com `trilhaPersonalizada`, com a opção "Quero chegar em: [habilidade]" (a meta da Fase 4). Os blocos expandem em 220 ms e respeitam `prefers-reduced-motion`.

## Decisões e alternativas descartadas
- **CSS global com as classes do handoff** (e não CSS Modules ou biblioteca de estilos): fidelidade ao design e menos conceitos novos. Descartado: Tailwind e styled-components (dependência nova).
- **Sem biblioteca de ícones:** os do design são SVG inline.
- **Tópico avulso sem modal:** o modal de sugestão é só para ações da habilidade inteira. Simples e previsível.
- **Desktop primeiro.** Abaixo de 1100 px, o cabeçalho fica compacto; a trilha ganha rolagem horizontal. Celular não é prioridade (apresentação em projetor).

## Como testar
- `npm test`: continuam os testes de domínio; novos para a função que traça as ligações (pura) e para as `etapas` nos dados.
- No navegador (Chrome sem janela, como nas fases anteriores): capturas de tela comparadas com `ref/telas/`, e o roteiro: escolher carreira → marcar JavaScript básico no modal → ver DOM bloqueado → abrir o painel de HTML semântico → marcar tópicos até concluir → ver o DOM liberar.

## Fora do escopo
XP, níveis e salvar progresso (Fase 7); telas "Como funciona" e "Sobre" (B-027, só se sobrar tempo); celular; animações além das do design.

## Riscos
- **Alto:** é a fase maior, com 3 dias. As ligações ortogonais por canais podem passar por trás de blocos quando várias áreas expandem. Aceito: ficam atrás dos blocos, sem quebrar nada.
- **Linha de corte:** se a 6.3 não couber, ficamos com a trilha atual **já com os novos tokens**, o painel funcionando (6.2) e a ordem de estudo (6.4). A 6.1 e a 6.2 sozinhas já entregam um produto coerente.

## Resumo do aprendizado
(Preencher ao final.)

## Checkpoint
- Commits sugeridos (um por passo): `feat: aplica identidade visual e novas telas iniciais`; `feat: adiciona painel lateral com tópicos`; `feat: adiciona trilha em etapas`; `feat: adiciona ordem de estudo`
- Aprovado por mim para avançar? [ ]
