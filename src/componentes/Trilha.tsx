import { useMemo } from 'react'
import { Background, Controls, MarkerType, Position, ReactFlow } from '@xyflow/react'
import type { Edge, Node } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { calcularEstados } from '../dominio/estados'
import type { Grafo } from '../dominio/grafo'
import { calcularNiveis } from '../dominio/niveis'
import type { Area } from '../dominio/tipos'

interface Props {
  grafo: Grafo
  areas: Area[]
  concluidas: ReadonlySet<string>
  onAlternar: (id: string) => void
}

const LARGURA_NO = 190
const ESPACO_X = 270 // distância entre colunas (níveis)
const ESPACO_Y = 80 // distância entre habilidades da mesma coluna

export default function Trilha({ grafo, areas, concluidas, onAlternar }: Props) {
  // As posições só dependem do grafo, então são calculadas uma vez.
  const posicoes = useMemo(() => {
    const niveis = calcularNiveis(grafo)
    const ordemArea = new Map(areas.map((a, i) => [a.id, i]))
    const porNivel = new Map<number, string[]>()

    for (const [id, nivel] of niveis) {
      porNivel.set(nivel, [...(porNivel.get(nivel) ?? []), id])
    }

    const pos = new Map<string, { x: number; y: number }>()
    for (const [nivel, ids] of porNivel) {
      // Dentro da coluna, habilidades da mesma área ficam juntas.
      ids.sort((a, b) => ordemArea.get(grafo.habilidades.get(a)!.area)! - ordemArea.get(grafo.habilidades.get(b)!.area)!)
      ids.forEach((id, i) => pos.set(id, { x: nivel * ESPACO_X, y: i * ESPACO_Y }))
    }
    return pos
  }, [grafo, areas])

  // Os estados mudam a cada clique: são recalculados, nunca guardados.
  const { nos, arestas } = useMemo(() => {
    const estados = calcularEstados(grafo, concluidas)
    const nos: Node[] = []
    const arestas: Edge[] = []

    for (const h of grafo.habilidades.values()) {
      nos.push({
        id: h.id,
        position: posicoes.get(h.id)!,
        data: { label: h.nome },
        className: `no no-${estados.get(h.id)}`,
        style: { width: LARGURA_NO },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: false,
      })
      for (const p of h.prerequisitos) {
        arestas.push({
          id: `${p}->${h.id}`,
          source: p,
          target: h.id,
          markerEnd: { type: MarkerType.ArrowClosed },
          className: concluidas.has(p) ? 'aresta aresta-ativa' : 'aresta',
        })
      }
    }
    return { nos, arestas }
  }, [grafo, concluidas, posicoes])

  return (
    <div className="trilha">
      <ReactFlow
        nodes={nos}
        edges={arestas}
        onNodeClick={(_, no) => onAlternar(no.id)}
        nodesDraggable={false}
        nodesConnectable={false}
        fitView
        minZoom={0.3}
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
