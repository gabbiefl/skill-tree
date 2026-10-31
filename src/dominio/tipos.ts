// Tipos: o "molde" TypeScript do JSON em dados/frontend.json.
// Se o JSON destoar deste molde, o editor avisa antes de rodar o programa.

export interface Area {
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
  // Quem definiu a habilidade: o roadmap.sh ou a curadoria dos autores.
  origem: 'roadmap.sh' | 'autores'
  fontes: string[]
}

export interface Carreira {
  carreira: { id: string; nome: string; descricao: string }
  areas: Area[]
  habilidades: Habilidade[]
}
