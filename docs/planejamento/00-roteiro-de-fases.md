# Roteiro de fases (proposta, aguardando aprovação)

Prazo: 29/10/2026 a 12/11/2026. Datas são alvos, não promessas; a ordem importa mais.

| Fase | Quando | Entrega |
|------|--------|---------|
| 0. Descoberta e decisões | 29–30/10 | Tecnologia, carreira de referência, estado real do que existe, decisão árvore x DAG |
| 1. Dados da carreira | 30–31/10 | JSON de habilidades e pré-requisitos, com fontes citáveis |
| 2. Modelo em DAG e regras de liberação | 1–3/11 | Grafo + estados (concluída/disponível/bloqueada) + sugestão de pré-requisitos + testes; teste mostrando que a árvore é o caso de um pré-requisito só |
| 3. Interface básica | 3–5/11 | Escolher carreira, modal de conhecimentos (agrupado por área), trilha; árvore como hierarquia de áreas e como visão derivada do grafo |
| 4. Ordenação topológica | 5–7/11 | Kahn + detecção de ciclos + testes; trilha em ordem de estudo |
| 5. Demonstração | 8/11 | Cenário de demo ensaiado de ponta a ponta |
| 6. Avaliação | 8–10/11 | Versão reduzida (poucos estudantes) ou plano B como "próximo passo" |
| 7. README e repositório público | 10–11/11 | Repositório limpo e apresentável |
| 8. Roteiro da apresentação | 11–12/11 | Roteiro, perguntas prováveis da banca, ensaio |

**Estratégia (decidida em 29/10):** por causa do prazo, o modelo é o **DAG desde a Fase 2**, sem implementar uma árvore separada. A árvore tem dois papéis: (1) hierarquia de organização Carreira → Áreas → Habilidades; (2) visão derivada do grafo (o primeiro pré-requisito de cada habilidade é o "pai"), usada para mostrar por que a árvore não basta. Narrativa honesta para a banca: modelou-se primeiro como árvore, viu-se a limitação dos pré-requisitos múltiplos e implementou-se o DAG diretamente. Como a árvore é um caso particular do DAG (um pré-requisito por nó), as regras do DAG cobrem o que o resumo prometeu.

Folga: o tempo é curto, então as fases 5 a 8 se sobrepõem. Se algo atrasar, corta-se a avaliação (6) antes de cortar testes ou README.
