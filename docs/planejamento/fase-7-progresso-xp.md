# Fase 7 — Progresso salvo, XP e níveis

**Status:** implementada (aguardando checkpoint)
**Prazo:** 09–10/11
**Itens do backlog:** B-013, B-014, B-026, B-030

## Objetivo
O progresso sobrevive ao recarregar a página (fica no navegador da própria pessoa), e a interface passa a mostrar **XP e nível** como no design: medidor no cabeçalho, XP no rodapé do modal de conhecimentos, ganho de XP no modal de sugestão e no painel. Há também "Recomeçar do zero", útil para reiniciar a demonstração entre visitantes da feira.

## Conceitos
- **`localStorage`:** pequeno armazenamento do navegador, em texto, que fica no computador da pessoa. Nenhum servidor é envolvido.
- **Serializar e validar:** para guardar, o conjunto de tópicos vira texto JSON. Ao ler de volta, **não se confia no texto**: ele pode estar corrompido, ser de uma versão antiga ou ter ids que não existem mais. Por isso a leitura valida o formato e descarta o que não conhece.
- **XP derivado, não acumulado:** o XP é calculado a partir do progresso (`10 × tópicos concluídos + 50 × habilidades concluídas`). Não existe um contador separado. Efeito prático: desmarcar um tópico reduz o XP, e não dá para "farmar" pontos marcando e desmarcando. É o mesmo princípio do estado derivado das fases anteriores.
- **Nível por limiares:** a lista de pontos de corte transforma o XP total num nível, no nome do nível e no progresso dentro dele.

## Plano
1. Você aprova este plano e decide os dois pontos abaixo.
2. `src/dominio/xp.ts`, funções puras:
   - `calcularXp(grafo, topicos)`;
   - `nivelDoXp(xp)`, que devolve número, nome, XP inicial e do próximo nível, e a fração concluída do nível;
   - `xpDaAcao(grafo, antes, depois)`, o ganho de uma ação (para o modal de sugestão).
3. `src/dominio/armazenamento.ts`, funções puras: `serializarProgresso(topicos)` e `lerProgresso(texto, idsValidos)` (valida o formato, a versão e descarta ids desconhecidos).
4. `src/armazenamento.ts`: leitura e gravação no `localStorage`, com tratamento de erro (modo privado, armazenamento bloqueado ou cheio: o app continua funcionando, só sem salvar). Em `App.tsx`, o estado inicial vem do armazenamento e cada mudança é gravada.
5. Interface, seguindo o design:
   - `Cabecalho`: medidor com o nível, o nome e "XP / próximo nível", e a barra (abaixo de 1100 px a barra desce para uma linha própria);
   - aviso "+10 XP" (ou "+50 XP" com o bônus) por 2 segundos ao concluir, e destaque de "Nível N · Nome" ao subir;
   - rodapé do modal de conhecimentos com o XP; modal de sugestão com "+X XP" por item, o total e "você sobe para o nível N", se for o caso;
   - painel: linha "+10 XP por tópico · +50 XP ao concluir a habilidade";
   - menu de configurações: "Recomeçar do zero", com confirmação.
6. Testes e conferência no navegador (inclusive recarregar a página).

## Decisões tomadas
1. **Níveis por marcos de etapa, calculados dos dados.** Em vez dos degraus de 250 do design (que ignoram o tamanho das etapas), cada nível corresponde a concluir uma etapa, e o limiar de XP é a soma do XP das etapas até ela:
   Semente 0, Broto 280 (etapa 1), Muda 670 (etapas 1–2), Galho 1560 (etapas 1–3), Árvore 2440 (trilha completa).
   A lista `niveis` fica no JSON (nome e etapa); os números saem do cálculo, então acompanham sozinhos quando a carreira ganhar tópicos. O nível é decidido pelo **XP total**: concluir as etapas em ordem leva exatamente ao nível de cada uma; fora de ordem, é uma aproximação (limitação aceita por enquanto).
2. **Sem apelido.** O design não prevê, e assim nenhum dado pessoal é coletado ou guardado.

## Decisões e alternativas descartadas
- **Sem servidor e sem conta:** o progresso vive só naquele navegador. Limitação: não acompanha a pessoa entre computadores. Descartado: login (B-015, fora do escopo).
- **XP derivado, e não acumulado:** descartado o contador persistente (permitiria ganhar pontos repetindo ações e exigiria guardar mais dados).
- **Versão no formato salvo** (`versao: 1`): se o formato mudar, dá para migrar ou descartar com segurança.
- **"Recomeçar do zero" não está no design:** é uma adição pequena e necessária para a feira. Fica no menu de configurações, com confirmação.
- **Contagem animada do XP (600 ms):** a barra anima por transição de CSS; o número muda sem animação, e tudo respeita `prefers-reduced-motion`.

## Como testar
`npm test`. Casos principais:
- XP: sem progresso é 0; cada tópico vale 10; concluir uma habilidade soma 50; marcar tudo dá 2440; desmarcar reduz.
- Nível: 279 é Semente, 280 é Broto, 670 é Muda, 1560 é Galho, 2440 é Árvore (máximo, sem "próximo nível"); a fração do nível está entre 0 e 1; os limiares crescem junto com os tópicos.
- Armazenamento: ida e volta (serializar e ler devolve os mesmos tópicos); texto inválido, JSON quebrado, versão desconhecida e tipos errados dão progresso vazio, sem erro; ids que não existem são descartados.
- `xpDaAcao` bate com a diferença entre `calcularXp` depois e antes.
- No navegador: concluir tópicos, recarregar e ver o progresso e o XP mantidos; "Recomeçar do zero" limpa; modo sem `localStorage` não quebra a página.

## Fora do escopo
Login e contas (B-015), apelido, ranking, conquistas, telas "Como funciona" e "Sobre" (B-027), sincronizar entre dispositivos.

## Riscos
- **Baixo a médio.** O cabeçalho com medidor tem o layout mais delicado (versão compacta). Linha de corte: se faltar tempo, ficam o salvamento e o XP simples, sem o aviso animado de ganho.
- Armazenamento bloqueado no navegador da feira: o app segue funcionando sem salvar (coberto por tratamento de erro).

## Resumo do aprendizado
(Preencher ao final.)

## Checkpoint
- Commit sugerido: `feat: salva o progresso no navegador e adiciona XP e níveis`
- Aprovado por mim para avançar? [ ]
