// Geometria das ligações da trilha: funções puras (sem React nem DOM), fáceis de testar.
// As ligações são desenhadas em ângulo reto, com cantos arredondados.

export interface Ponto {
  x: number
  y: number
}

// Ponto de partida ou chegada de uma ligação: borda de um bloco ou de uma habilidade,
// já com a etapa (coluna) onde ele está.
export interface Ancora extends Ponto {
  etapa: number
}

// Medidas lidas do layout: onde cada coluna começa e termina, e até onde descem os blocos dela.
export interface Medidas {
  esquerdaDaEtapa: Map<number, number>
  direitaDaEtapa: Map<number, number>
  baseDosBlocos: Map<number, number>
}

const arredondar = (v: number) => Math.round(v * 100) / 100

// Tira pontos repetidos e os que estão no meio de uma reta (não formam canto).
function simplificar(pontos: Ponto[]): Ponto[] {
  const sem = pontos.filter((p, i) => i === 0 || p.x !== pontos[i - 1].x || p.y !== pontos[i - 1].y)
  return sem.filter((p, i) => {
    if (i === 0 || i === sem.length - 1) return true
    const a = sem[i - 1]
    const b = sem[i + 1]
    return !((a.x === p.x && p.x === b.x) || (a.y === p.y && p.y === b.y))
  })
}

// Caminho SVG que passa pelos pontos, arredondando cada canto com uma curva.
// O raio nunca passa da metade do trecho vizinho, para a curva não "atravessar" o canto seguinte.
export function caminhoArredondado(pontos: Ponto[], raio = 12): string {
  const p = simplificar(pontos)
  if (p.length < 2) return ''

  let d = `M ${arredondar(p[0].x)} ${arredondar(p[0].y)}`
  for (let i = 1; i < p.length - 1; i++) {
    const ant = p[i - 1]
    const cur = p[i]
    const prox = p[i + 1]
    const dAnt = Math.hypot(cur.x - ant.x, cur.y - ant.y)
    const dProx = Math.hypot(prox.x - cur.x, prox.y - cur.y)
    const r = Math.min(raio, dAnt / 2, dProx / 2)
    const entrada = { x: cur.x + ((ant.x - cur.x) / dAnt) * r, y: cur.y + ((ant.y - cur.y) / dAnt) * r }
    const saida = { x: cur.x + ((prox.x - cur.x) / dProx) * r, y: cur.y + ((prox.y - cur.y) / dProx) * r }
    d += ` L ${arredondar(entrada.x)} ${arredondar(entrada.y)} Q ${arredondar(cur.x)} ${arredondar(cur.y)} ${arredondar(saida.x)} ${arredondar(saida.y)}`
  }
  const ultimo = p[p.length - 1]
  return `${d} L ${arredondar(ultimo.x)} ${arredondar(ultimo.y)}`
}

// Pontos de uma ligação entre dois blocos de colunas diferentes.
// - Colunas vizinhas: sai pela direita, sobe/desce no vão entre as colunas e entra pela esquerda.
// - Colunas distantes: em vez de cruzar a coluna do meio (e parecer ligada a um bloco que não é),
//   desce até um canal livre abaixo dos blocos, corre por ele e só então sobe até o destino.
// "indice" afasta ligeiramente ligações parecidas, para não ficarem uma em cima da outra.
export function rotear(origem: Ancora, destino: Ancora, medidas: Medidas, indice: number): Ponto[] {
  const folga = ((indice % 5) - 2) * 3
  const direita = medidas.direitaDaEtapa.get(origem.etapa)!
  const esquerdaDoDestino = medidas.esquerdaDaEtapa.get(destino.etapa)!

  if (destino.etapa === origem.etapa + 1) {
    const xMeio = direita + (esquerdaDoDestino - direita) / 2 + folga
    return [origem, { x: xMeio, y: origem.y }, { x: xMeio, y: destino.y }, destino]
  }

  const esquerdaDaProxima = medidas.esquerdaDaEtapa.get(origem.etapa + 1)!
  const direitaDaAnterior = medidas.direitaDaEtapa.get(destino.etapa - 1)!
  const xSaida = direita + (esquerdaDaProxima - direita) / 2 + folga
  const xEntrada = direitaDaAnterior + (esquerdaDoDestino - direitaDaAnterior) / 2 + folga

  let base = Math.max(origem.y, destino.y)
  for (let e = origem.etapa + 1; e < destino.etapa; e++) {
    base = Math.max(base, medidas.baseDosBlocos.get(e) ?? 0)
  }
  const canal = base + 16 + (indice % 4) * 6

  return [
    origem,
    { x: xSaida, y: origem.y },
    { x: xSaida, y: canal },
    { x: xEntrada, y: canal },
    { x: xEntrada, y: destino.y },
    destino,
  ]
}
