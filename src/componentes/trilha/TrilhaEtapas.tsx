import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ligacoesEntreAreas } from '../../dominio/areas'
import { calcularEstados } from '../../dominio/estados'
import type { Grafo } from '../../dominio/grafo'
import type { Carreira } from '../../dominio/tipos'
import BlocoArea from './BlocoArea'
import { caminhoArredondado, rotear } from './geometria'
import type { Ancora, Medidas, Ponto } from './geometria'

interface Props {
  carreira: Carreira
  grafo: Grafo
  concluidas: ReadonlySet<string>
  topicos: ReadonlySet<string>
  selecionada: string | null
  onSelecionar: (id: string | null) => void
}

interface Linha {
  chave: string
  d: string
  pendente?: boolean
}

interface Desenho {
  largura: number
  altura: number
  fracas: Linha[]
  destaque: Linha[]
}

const SEM_DESENHO: Desenho = { largura: 0, altura: 0, fracas: [], destaque: [] }

// Trilha em etapas (colunas). Os blocos são HTML/CSS comuns; as ligações são um SVG por cima,
// desenhado a partir da posição real de cada bloco no navegador.
export default function TrilhaEtapas({ carreira, grafo, concluidas, topicos, selecionada, onSelecionar }: Props) {
  const estados = useMemo(() => calcularEstados(grafo, concluidas), [grafo, concluidas])
  const ligacoes = useMemo(() => ligacoesEntreAreas(carreira.habilidades), [carreira])
  const [abertas, setAbertas] = useState<ReadonlySet<string>>(new Set())
  const [desenho, setDesenho] = useState<Desenho>(SEM_DESENHO)

  const container = useRef<HTMLDivElement>(null)
  const elementos = useRef(new Map<string, HTMLElement>())
  const registrar = useCallback((chave: string, el: HTMLElement | null) => {
    if (el) elementos.current.set(chave, el)
    else elementos.current.delete(chave)
  }, [])

  const etapaDaArea = useMemo(() => new Map(carreira.areas.map((a) => [a.id, a.etapa])), [carreira])
  const areaDe = useCallback((id: string) => grafo.habilidades.get(id)!.area, [grafo])

  // A área da habilidade selecionada fica sempre aberta (derivado, sem efeito): assim, selecionar
  // por um chip do painel já mostra a habilidade no bloco certo.
  const areaSelecionada = selecionada ? areaDe(selecionada) : null
  const estaAberta = useCallback((id: string) => abertas.has(id) || id === areaSelecionada, [abertas, areaSelecionada])

  // Habilidades ligadas à selecionada: de onde vem e o que libera.
  // Memorizadas: se fossem arrays novos a cada renderização, "medir" mudaria sempre e entraria em laço.
  const vem = useMemo(() => (selecionada ? grafo.habilidades.get(selecionada)!.prerequisitos : []), [grafo, selecionada])
  const libera = useMemo(() => (selecionada ? grafo.dependentes.get(selecionada)! : []), [grafo, selecionada])

  const medir = useCallback(() => {
    const c = container.current
    if (!c) return
    const cr = c.getBoundingClientRect()
    const el = (chave: string) => elementos.current.get(chave)
    const caixa = (e: HTMLElement) => {
      const r = e.getBoundingClientRect()
      return { esq: r.left - cr.left, dir: r.right - cr.left, topo: r.top - cr.top, base: r.bottom - cr.top }
    }

    // Colunas: onde começam e terminam, e até onde descem os blocos de cada uma.
    const medidas: Medidas = { esquerdaDaEtapa: new Map(), direitaDaEtapa: new Map(), baseDosBlocos: new Map() }
    for (const etapa of carreira.etapas) {
      const lane = el(`etapa:${etapa.id}`)
      if (!lane) return
      const b = caixa(lane)
      medidas.esquerdaDaEtapa.set(etapa.id, b.esq)
      medidas.direitaDaEtapa.set(etapa.id, b.dir)
    }
    for (const area of carreira.areas) {
      const bloco = el(`area:${area.id}`)
      if (!bloco) return
      const base = caixa(bloco).base
      medidas.baseDosBlocos.set(area.etapa, Math.max(medidas.baseDosBlocos.get(area.etapa) ?? 0, base))
    }

    // Âncora de uma habilidade: a linha dela, se a área está aberta; senão, o bloco da área.
    const ancora = (habilidadeId: string, lado: 'dir' | 'esq'): Ancora => {
      const area = areaDe(habilidadeId)
      const alvo = el(estaAberta(area) ? `hab:${habilidadeId}` : `area:${area}`)!
      const b = caixa(alvo)
      return { x: lado === 'dir' ? b.dir : b.esq, y: (b.topo + b.base) / 2, etapa: etapaDaArea.get(area)! }
    }

    // Ligações esmaecidas entre áreas (visão geral).
    const fracas: Linha[] = ligacoes.map((l, i) => {
      const origem = caixa(el(`area:${l.de}`)!)
      const destino = caixa(el(`area:${l.para}`)!)
      const pts = rotear(
        { x: origem.dir, y: (origem.topo + origem.base) / 2, etapa: etapaDaArea.get(l.de)! },
        { x: destino.esq, y: (destino.topo + destino.base) / 2, etapa: etapaDaArea.get(l.para)! },
        medidas,
        i,
      )
      return { chave: `${l.de}>${l.para}`, d: caminhoArredondado(pts) }
    })

    // Ligações em destaque: só as da habilidade selecionada.
    const destaque: Linha[] = []
    if (selecionada) {
      const pares: [string, string][] = [
        ...vem.map((p): [string, string] => [p, selecionada]),
        ...libera.map((d): [string, string] => [selecionada, d]),
      ]
      pares.forEach(([de, para], i) => {
        const mesmaArea = areaDe(de) === areaDe(para)
        let pts: Ponto[]
        if (mesmaArea) {
          // Dentro do mesmo bloco: um colchete no canto direito, entre as duas linhas.
          const a = ancora(de, 'dir')
          const b = ancora(para, 'dir')
          pts = [a, { x: a.x + 8, y: a.y }, { x: a.x + 8, y: b.y }, b]
        } else {
          pts = rotear(ancora(de, 'dir'), ancora(para, 'esq'), medidas, i)
        }
        // Tracejado: pré-requisito da habilidade em foco que ainda não foi concluído.
        const pendente = para === selecionada && !concluidas.has(de)
        destaque.push({ chave: `${de}>${para}`, d: caminhoArredondado(pts), pendente })
      })
    }

    setDesenho({ largura: c.offsetWidth, altura: c.offsetHeight, fracas, destaque })
  }, [carreira, ligacoes, etapaDaArea, areaDe, estaAberta, selecionada, vem, libera, concluidas])

  // Mede e redesenha a cada mudança que altera o layout...
  useLayoutEffect(medir, [medir, topicos])

  // ...e também quando o tamanho muda (janela, painel lateral) ou as fontes terminam de carregar.
  useEffect(() => {
    const c = container.current
    if (!c) return
    const observador = new ResizeObserver(medir)
    observador.observe(c)
    document.fonts?.ready.then(medir)
    return () => observador.disconnect()
  }, [medir])

  function alternarArea(id: string) {
    // Fechar a área da habilidade em foco também tira o foco dela (e fecha o painel).
    if (id === areaSelecionada) onSelecionar(null)
    setAbertas((atual) => {
      const novo = new Set(atual)
      if (estaAberta(id)) novo.delete(id)
      else novo.add(id)
      return novo
    })
  }

  const marcador = (id: string, cor: string) => (
    <marker id={id} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto">
      <path d="M2 2l8 4-8 4z" fill={cor} stroke={cor} strokeWidth="1.5" strokeLinejoin="round" />
    </marker>
  )

  return (
    <div className="etapas-rolagem">
      <div className="etapas" ref={container} style={{ '--n': carreira.etapas.length, gridTemplateColumns: `repeat(${carreira.etapas.length}, minmax(232px, 1fr))` } as CSSProperties}>
        <svg className="edges fundo" width={desenho.largura} height={desenho.altura} aria-hidden="true">
          <defs>{marcador('seta-fraca', '#c9cbe0')}</defs>
          <g className="e fd">
            {desenho.fracas.map((l) => (
              <path key={l.chave} d={l.d} markerEnd="url(#seta-fraca)" />
            ))}
          </g>
        </svg>

        {carreira.etapas.map((etapa) => (
          <section className="lane" key={etapa.id} ref={(el) => registrar(`etapa:${etapa.id}`, el)} aria-label={`Etapa ${etapa.id}: ${etapa.nome}`}>
            <span className="lbl">
              Etapa {etapa.id} · {etapa.nome}
            </span>
            {carreira.areas
              .filter((a) => a.etapa === etapa.id)
              .map((area) => (
                <BlocoArea
                  key={area.id}
                  area={area}
                  habilidades={carreira.habilidades.filter((h) => h.area === area.id)}
                  estados={estados}
                  topicos={topicos}
                  aberta={estaAberta(area.id)}
                  selecionada={selecionada}
                  vem={carreira.habilidades.filter((h) => h.area === area.id && vem.includes(h.id))}
                  libera={carreira.habilidades.filter((h) => h.area === area.id && libera.includes(h.id))}
                  registrar={registrar}
                  onAlternar={() => alternarArea(area.id)}
                  onSelecionar={onSelecionar}
                />
              ))}
          </section>
        ))}

        <svg className="edges topo" width={desenho.largura} height={desenho.altura} aria-hidden="true">
          <defs>{marcador('seta-destaque', '#1a1a6e')}</defs>
          {desenho.destaque.map((l) => (
            <path key={l.chave} className={`e hl${l.pendente ? ' pd' : ''}`} d={l.d} markerEnd="url(#seta-destaque)" />
          ))}
        </svg>
      </div>
    </div>
  )
}
