# Roteiro de fases

Prazo: 29/10/2026 a 12/11/2026. Datas são alvos, não promessas; a ordem importa mais.

| Fase | Quando | Entrega | Status |
|------|--------|---------|--------|
| 0. Descoberta e decisões | 29–30/10 | Tecnologia, carreira, decisão árvore x DAG | feita |
| 1. Dados da carreira | 30–31/10 | JSON de 25 habilidades com origem e fontes | feita |
| 2. Modelo em DAG e regras | 1–3/11 | Grafo, estados, sugestão de pré-requisitos, testes | feita |
| 3a. Interface essencial (provisória) | 6/11 | Escolha de carreira, modal, trilha em React Flow | feita (será substituída pela interface nova) |
| 4. Ordenação topológica | 7/11 | Kahn, detecção de ciclos, trilha personalizada, testes | feita |
| 5. Tópicos e conclusão por tópicos | 7–8/11 | Tópicos no JSON (rascunho nosso, revisão dos autores), habilidade concluída = todos os tópicos, testes | | feita (tópicos aguardam revisão) |
| 6. Interface nova (handoff) | 8–10/11 | Tokens e componentes do design, trilha em etapas (3A), painel lateral, modais, ordem de estudo | | feita |
| 7. Perfil local, XP e níveis | 10/11 | Salvar progresso no navegador, XP por tópico, níveis | | feita |
| 7b. Identidade visual | 10/11 | Cor e ícone por área, ícones de nível, tela de escolha mais viva, prévia das carreiras "em breve" | | feita (falta conferência visual) |
| 8. Deploy, README e demo | 10–11/11 | GitHub Pages, README final, cenário de demo ensaiado | |
| 9. Roteiro da apresentação | 11–12/11 | Roteiro, perguntas prováveis da banca, ensaio | |
| Avaliação | depois | Preliminar interna (integrantes do grupo) e apresentada à banca; com estudantes externos é a próxima etapa | plano B |

**Estratégia (decidida em 29/10):** por causa do prazo, o modelo é o **DAG desde a Fase 2**, sem implementar uma árvore separada. A árvore tem dois papéis: (1) hierarquia de organização Carreira → Áreas → Habilidades; (2) visão derivada do grafo (o primeiro pré-requisito de cada habilidade é o "pai"), usada para mostrar por que a árvore não basta. Narrativa honesta para a banca: modelou-se primeiro como árvore, viu-se a limitação dos pré-requisitos múltiplos e implementou-se o DAG diretamente. Como a árvore é um caso particular do DAG (um pré-requisito por nó), as regras do DAG cobrem o que o resumo prometeu.

**Reajuste de 07/11:** o aluno produziu um design completo (pasta `ref/`, fora do Git). Adotada a variação 3A (etapas horizontais). A ordenação topológica vem antes da interface nova porque é o coração do projeto. Se atrasar, corta-se nesta ordem: níveis e XP, telas extras ("Como funciona", "Sobre"), e por último o visual 3A (voltando ao grafo atual com destaque de ligações). Não se corta teste, README nem ordenação.

**Avaliação (DSR):** feita pelos integrantes do grupo e apresentada depois à banca. Deve ser chamada de avaliação preliminar interna, pois quem construiu o sistema conhece o caminho e tende a avaliá-lo melhor do que um usuário novo; o teste com estudantes externos é a etapa seguinte, compatível com o resumo.
