# Roteiro de fases

Prazo: 29/10/2026 a 12/11/2026. Datas são alvos, não promessas; a ordem importa mais.

| Fase | Quando | Entrega | Status |
|------|--------|---------|--------|
| 0. Descoberta e decisões | 29–30/10 | Tecnologia, carreira, decisão árvore x DAG | feita |
| 1. Dados da carreira | 30–31/10 | JSON de 25 habilidades com origem e fontes | feita |
| 2. Modelo em DAG e regras | 1–3/11 | Grafo, estados, sugestão de pré-requisitos, testes | feita |
| 3a. Interface essencial | 6–8/11 | Escolha de carreira, modal de conhecimentos, trilha em grafo (React Flow), marcar como concluída com sugestão | próxima |
| 4. Ordenação topológica | 8–9/11 | Kahn + detecção de ciclos + testes; "ordem sugerida de estudo" na tela | |
| 3b. Árvore, perfil local e XP | 9–10/11 | Visão em árvore (áreas e derivada), apelido + localStorage, XP | |
| 7. README, deploy e demo | 10–11/11 | GitHub Pages, README final, cenário de demo ensaiado | |
| 8. Roteiro da apresentação | 11–12/11 | Roteiro, perguntas prováveis da banca, ensaio | |
| 6. Avaliação com estudantes | — | **Apresentada como próximo passo** (ver abaixo) | plano B |

**Estratégia (decidida em 29/10):** por causa do prazo, o modelo é o **DAG desde a Fase 2**, sem implementar uma árvore separada. A árvore tem dois papéis: (1) hierarquia de organização Carreira → Áreas → Habilidades; (2) visão derivada do grafo (o primeiro pré-requisito de cada habilidade é o "pai"), usada para mostrar por que a árvore não basta. Narrativa honesta para a banca: modelou-se primeiro como árvore, viu-se a limitação dos pré-requisitos múltiplos e implementou-se o DAG diretamente. Como a árvore é um caso particular do DAG (um pré-requisito por nó), as regras do DAG cobrem o que o resumo prometeu.

**Reajuste de 06/11:** restam 6 dias, então a interface foi dividida. O essencial (3a) e a ordenação topológica (4) vêm antes do que é desejável (3b). Se atrasar, corta-se 3b (XP, perfil, visão em árvore) antes de cortar testes, README ou a ordenação topológica.

**Avaliação (DSR):** teste de usabilidade com estudantes exige a interface pronta, participantes, consentimento e análise. Com a interface só ficando pronta por volta de 9/11, não cabe de forma séria antes de 12/11. Plano B: apresentar a avaliação como **próxima etapa**, com o roteiro do teste e o questionário prontos como material, e dizer com clareza que ela ainda não foi aplicada. Isso é compatível com o resumo, que a coloca entre as "próximas etapas".
