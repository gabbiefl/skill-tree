import type { Habilidade } from './tipos'

// Atalho para montar habilidades de teste sem repetir campos irrelevantes.
// "topicos" são só os nomes; o id de cada um vira "habilidade.nome".
export function hab(
  id: string,
  prerequisitos: string[] = [],
  area = 'x',
  topicos: string[] = [],
): Habilidade {
  return {
    id,
    nome: id,
    area,
    descricao: '',
    prerequisitos,
    topicos: topicos.map((t) => ({ id: `${id}.${t}`, nome: t })),
    origem: 'autores',
    fontes: [],
  }
}
