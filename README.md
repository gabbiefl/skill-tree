<p align="center">
  <img src="src/assets/horizontal-light-1200.png" alt="Logo do SkillTree" width="480">
</p>

<p align="center">
  <strong>Descubra o que aprender em TI e em que ordem.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-ff00ff?style=for-the-badge" alt="Status: em desenvolvimento">
  <img src="https://img.shields.io/badge/Mostra%20Cient%C3%ADfica-2026-1a1a6e?style=for-the-badge" alt="Mostra Científica 2026">
  <img src="https://img.shields.io/badge/ODS-4.4%20%7C%208.3-ccff00?style=for-the-badge&labelColor=1a1a6e" alt="ODS 4.4 e 8.3">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232a?style=flat-square&logo=react&logoColor=61dafb" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646cff?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Vitest-6e9f18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest">
  <img src="https://img.shields.io/badge/GitHub%20Pages-222?style=flat-square&logo=github&logoColor=white" alt="GitHub Pages">
</p>

# SkillTree

**Aplicação de estruturas de dados para modelagem de trilhas de aprendizagem em Tecnologia da Informação.**

Projeto desenvolvido para a Mostra Científica 2026.

> **Status:** em desenvolvimento. Já funcionam: os dados da carreira de referência, as regras de liberação, a ordenação topológica, os tópicos de estudo, a interface (trilha em etapas, painel de tópicos, cores e ícones por área), o progresso salvo no navegador, o XP e os níveis. Ainda faltam: a publicação no GitHub Pages e o material de apresentação (veja o [roteiro](docs/planejamento/00-roteiro-de-fases.md)).

## 🌱 O problema

Na área de TI, linguagens, ferramentas e especializações mudam o tempo todo, e muita gente aprende sozinha. Isso amplia o acesso ao conteúdo, mas dificulta saber **quais habilidades** desenvolver e **em que ordem**. O projeto se relaciona às metas 4.4 e 8.3 dos Objetivos de Desenvolvimento Sustentável (ODS), sobre competências para o emprego e trabalho decente.

## 💡 A ideia

O SkillTree organiza trilhas de aprendizagem relacionando objetivos profissionais, habilidades e seus pré-requisitos. Como uma habilidade só é liberada depois das que a antecedem, essas relações são modeladas com estruturas de dados:

- 🕸️ **Grafo direcionado acíclico (DAG):** é o modelo principal. Cada habilidade lista seus pré-requisitos, e pode ter vários. A partir do que a pessoa já concluiu, calcula-se o estado de cada habilidade: **concluída**, **disponível** (todos os pré-requisitos concluídos) ou **bloqueada**.
- 🌳 **Árvore:** é o caso particular do DAG em que cada habilidade tem um só pré-requisito, e foi o ponto de partida do projeto. O DAG evolui a árvore para os casos de vários pré-requisitos (por exemplo, o DOM exige JavaScript **e** HTML semântico). A estrutura Carreira → Áreas → Habilidades também é uma árvore.
- 🔢 **Ordenação topológica (algoritmo de Kahn):** gera uma sequência de estudo válida, com cada habilidade depois dos seus pré-requisitos (inclusive até uma meta, como "chegar em React"), e detecta ciclos de pré-requisitos, que invalidariam a trilha. Está implementada e testada em `src/dominio/ordenacao.ts` e valida os dados da carreira; a tela de "ordem de estudo" foi retirada da interface por decisão do grupo.

O diferencial é que a trilha se **adapta ao conhecimento prévio** de quem usa, em vez de seguir um caminho único e rígido.

A carreira de referência é **Desenvolvedor Front-end**.

## 🧭 Como funciona

1. A pessoa escolhe a carreira.
2. Um modal pergunta quais habilidades ela já conhece.
3. A trilha aparece em etapas, com as áreas e as habilidades **concluídas**, **disponíveis** e **bloqueadas**.
4. Ao clicar numa habilidade, abre-se o guia: descrição, pré-requisitos e uma lista de tópicos. A habilidade só é concluída quando todos os tópicos estão concluídos.
5. Cada tópico concluído rende **XP** (10 por tópico, mais 50 ao concluir a habilidade), e o nível sobe ao concluir as etapas da trilha: Semente, Broto, Muda, Galho e Árvore.

Só a carreira **Desenvolvedor Front-end** está mapeada. Os cartões "em breve" (Back-end, Analista de Dados e Mobile) mostram uma **prévia ilustrativa** de como seriam as áreas e habilidades: são apenas visuais, ainda sem fonte nem pré-requisitos, e ficam fora dos dados reais.

**Privacidade:** o progresso é guardado só no navegador de quem usa (`localStorage`). Não há conta, servidor nem coleta de dados pessoais. O menu de configurações permite recomeçar do zero.

O andamento de cada item fica no [BACKLOG.md](BACKLOG.md).

## 🛠️ Tecnologias

- [React](https://react.dev/) e [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (servidor de desenvolvimento e build)
- [Vitest](https://vitest.dev/) (testes) e [Oxlint](https://oxc.rs/docs/guide/usage/linter) (análise do código)

A lógica das estruturas de dados fica separada da interface, em `src/dominio/`, em TypeScript puro. A trilha é HTML/CSS comum, e as ligações entre os blocos são um SVG desenhado a partir da posição real de cada bloco, sem biblioteca de grafos.

## 🚀 Como executar

Pré-requisito: [Node.js](https://nodejs.org/) 22.12 ou superior (exigência do Vitest).

```bash
npm install     # instala as dependências
npm run dev     # inicia o servidor de desenvolvimento
npm test        # executa os testes
npm run lint    # analisa o código
npm run build   # gera a versão de produção
```

Com o servidor ligado, abra o endereço mostrado no terminal (por padrão, `http://localhost:5173/skill-tree/`; o `/skill-tree/` no final é necessário por causa da publicação no GitHub Pages).

## 📁 Estrutura

```
dados/             dados da carreira em JSON (habilidades, tópicos, áreas e etapas)
src/dominio/       estruturas de dados e regras, sem React (grafo, estados, ordenação, progresso, XP)
src/componentes/   interface em React (telas, modais, painel e trilha em etapas)
src/estilos/       tokens do design, layout e cores por área
src/assets/        logos do projeto
docs/planejamento/ planejamento de cada fase
BACKLOG.md         itens e prioridades
```

## 🔬 Metodologia

A pesquisa segue a **Design Science Research (DSR)**, em cinco etapas: identificação do problema, definição dos objetivos da solução, desenvolvimento, demonstração e avaliação.

**Avaliação:** a avaliação prevista é, primeiro, uma **avaliação preliminar interna**, feita pelos integrantes do grupo, que conhecem o sistema e por isso tendem a avaliá-lo melhor do que um usuário novo. O teste de usabilidade e o questionário com estudantes de TI são o **próximo passo**. Quando houver participantes, só entram neste repositório resultados agregados e anônimos.

## 📚 Fontes dos dados

O mapeamento das habilidades e de seus pré-requisitos toma como ponto de partida o [roadmap.sh](https://roadmap.sh/frontend), usado como referência. Hoje, **14 das 25 habilidades** vêm do roadmap.sh e registram essa fonte; as outras 11 foram incluídas pelos autores, e o campo `origem` de cada uma, em [`dados/frontend.json`](dados/frontend.json), diz qual é o caso.

Os **119 tópicos de estudo** são um **rascunho feito com apoio de um assistente de IA** e ainda **em revisão pelos autores**. Os links de materiais de estudo só serão incluídos depois de verificados pelos autores.

## 🎨 Identidade visual e créditos

- Os ícones (áreas, níveis e interface) são SVGs desenhados para este projeto.
- As fontes [Lexend](https://fonts.google.com/specimen/Lexend) e [Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans) usam a licença SIL Open Font License e são carregadas do Google Fonts.

## 📄 Licença

A definir.
