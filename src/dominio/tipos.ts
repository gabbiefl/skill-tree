// Tipos: o "molde" TypeScript do JSON em dados/frontend.json.
// Se o JSON destoar deste molde, o editor avisa antes de rodar o programa.

export interface Area {
  id: string
  nome: string
}

// Passo de estudo dentro de uma habilidade. Não é nó do grafo: é um checklist.
export interface Topico {
  // Estável e único em todo o mapa, no formato "habilidade.assunto".
  // O progresso salvo aponta para este id, então corrigir o nome não apaga progresso.
  id: string
  nome: string
}

export interface Habilidade {
  id: string
  nome: string
  area: string
  descricao: string
  // ids das habilidades que precisam estar concluídas antes (lista de adjacência).
  // Por convenção, o primeiro é o pré-requisito principal ("pai" na visão em árvore).
  prerequisitos: string[]
  // A habilidade só conta como concluída quando todos os tópicos estão concluídos.
  topicos: Topico[]
  // Quem definiu a habilidade: o roadmap.sh ou a curadoria dos autores.
  origem: 'roadmap.sh' | 'autores'
  fontes: string[]
}

export interface Carreira {
  carreira: { id: string; nome: string; descricao: string }
  areas: Area[]
  habilidades: Habilidade[]
}
