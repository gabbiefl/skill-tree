import ChipEstado from './ChipEstado'
import Icone from './Icones'
import type { NomeIcone } from './Icones'
import { CARREIRAS_EM_BREVE } from './carreirasEmBreve'
import { iconeDaArea, iconeDoNivel } from './trilha/visualDasAreas'
import logoHorizontal from '../assets/horizontal-light-1200.png'

interface Props {
  nome: string
  descricao: string
  areas: { id: string; nome: string; habilidades: string[] }[]
  niveis: string[]
  totalHabilidades: number
  // Já existe progresso salvo: o botão passa a "Continuar".
  continuar: boolean
  onComecar: () => void
}

const PASSOS = [
  { titulo: 'Escolha a carreira', texto: 'Cada carreira vira um mapa de habilidades com pré-requisitos.' },
  { titulo: 'Marque o que já conhece', texto: 'A trilha se ajusta: o que você já sabe aparece como concluído.' },
  { titulo: 'Estude e ganhe XP', texto: 'Siga o guia de cada habilidade, marque os tópicos e suba de nível.' },
]

function ArteAtiva() {
  return (
    <svg width="100%" height="150" viewBox="0 0 312 150" aria-hidden="true">
      <g stroke="#868aaa" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M50 75L125 38M50 75L125 112M125 38L205 38M125 112L205 112M205 38L266 75M205 112L266 75" />
      </g>
      <g strokeLinecap="round" strokeLinejoin="round">
        {[[50, 75], [125, 38], [125, 112]].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="15" fill="#dcdcf3" stroke="#1a1a6e" strokeWidth="3" />
            <path d={`M${x - 6} ${y + 0.5}l4.5 4.5L${x + 7} ${y - 4.5}`} fill="none" stroke="#1a1a6e" strokeWidth="3" />
          </g>
        ))}
        {[[205, 38], [205, 112]].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="15" fill="#fff" stroke="#1f86d0" strokeWidth="4" />
            <circle cx={x} cy={y} r="4.5" fill="#1f86d0" />
          </g>
        ))}
        <circle cx="266" cy="75" r="15" fill="#eceef4" stroke="#787c99" strokeWidth="2.5" strokeDasharray="5 4" />
      </g>
    </svg>
  )
}

function ArteEmBreve({ linhas, nos }: { linhas: string; nos: number[][] }) {
  return (
    <svg width="100%" height="150" viewBox="0 0 312 150" aria-hidden="true">
      <g stroke="#868aaa" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="3 7">
        <path d={linhas} />
      </g>
      <g fill="#eceef4" stroke="#787c99" strokeWidth="2.5" strokeDasharray="5 4">
        {nos.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="15" />
        ))}
      </g>
    </svg>
  )
}

interface ItemArea {
  nome: string
  icone: NomeIcone
  habilidades: string[]
  area?: string // id da área real (cores do Front-end)
  cor?: string // nome da cor na paleta (prévias)
}

// Lista de áreas com ícone colorido e as primeiras habilidades de cada uma.
function ListaAreas({ rotulo, itens }: { rotulo: string; itens: ItemArea[] }) {
  return (
    <div className="areas-lista">
      <span className="lbl">{rotulo}</span>
      <ul>
        {itens.map((a) => {
          const resto = a.habilidades.length - 3
          return (
            <li key={a.nome} tabIndex={0}>
              <span className="ar-ico" data-area={a.area} data-cor={a.cor} aria-hidden="true">
                <Icone nome={a.icone} />
              </span>
              <div>
                <b>{a.nome}</b>
                <small>
                  <span>
                    {a.habilidades.slice(0, 3).join(' · ')}
                    {resto > 0 && ` · +${resto}`}
                  </span>
                </small>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function EscolhaCarreira({ nome, descricao, areas, niveis, totalHabilidades, continuar, onComecar }: Props) {
  return (
    <main className="escolha">
      <header className="hero">
        <div className="hero-logo">
          <img src={logoHorizontal} alt="SkillTree" />
        </div>
        <h1 className="h-display">Qual carreira de TI você quer explorar?</h1>
        <p className="lead">
          Veja a trilha como um mapa de habilidades. Marque o que você já sabe e descubra o que estudar agora.
        </p>
      </header>

      <section className="cartoes" aria-label="Carreiras">
        <article className="cc">
          <div className="art">
            <ArteAtiva />
          </div>
          <div className="bd">
            <div>
              <span className="chip is-avail">
                <Icone nome="play" preenchido /> Disponível agora
              </span>
            </div>
            <h3>{nome}</h3>
            <p>{descricao}</p>
            <div className="meta">
              <span className="chip neutral">{areas.length} áreas</span>
              <span className="chip neutral">{totalHabilidades} habilidades</span>
            </div>
            <ListaAreas
              rotulo="Áreas da trilha"
              itens={areas.map((a) => ({ nome: a.nome, icone: iconeDaArea(a.id), habilidades: a.habilidades, area: a.id }))}
            />
            <span className="grow" />
            <button type="button" className="btn pri lg cheio" onClick={onComecar}>
              {continuar ? 'Continuar a trilha' : 'Começar a trilha'} <Icone nome="setaDireita" />
            </button>
          </div>
        </article>

        {CARREIRAS_EM_BREVE.map((c) => (
          <article key={c.nome} className="cc soon">
            <div className="art">
              <ArteEmBreve linhas={c.linhas} nos={c.nos} />
            </div>
            <div className="bd">
              <div>
                <span className="chip is-locked">
                  <Icone nome="relogio" /> Em breve
                </span>
              </div>
              <h3>{c.nome}</h3>
              <p>{c.descricao}</p>
              <div className="meta">
                <span className="chip neutral">{c.areas.length} áreas</span>
                <span className="chip neutral">{c.areas.reduce((n, a) => n + a.habilidades.length, 0)} habilidades</span>
              </div>
              <ListaAreas rotulo="Áreas da trilha" itens={c.areas} />
              <span className="grow" />
              <button type="button" className="btn dis lg cheio" disabled>
                Em breve
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="jornada" aria-label="Níveis">
        <span className="lbl">Sua evolução</span>
        <ol>
          {niveis.map((nivel, i) => (
            <li key={nivel}>
              <span className="lvl-badge" aria-hidden="true">
                <Icone nome={iconeDoNivel(i + 1)} />
              </span>
              <b>{nivel}</b>
            </li>
          ))}
        </ol>
      </section>

      <section className="passos" aria-label="Como funciona">
        {PASSOS.map((p, i) => (
          <div className="stp" key={p.titulo}>
            <span className="num">{i + 1}</span>
            <div>
              <h4>{p.titulo}</h4>
              <p>{p.texto}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="legenda-mapa">
        <span className="lbl">Como ler o mapa</span>
        <ChipEstado estado="concluida" />
        <ChipEstado estado="disponivel" />
        <ChipEstado estado="bloqueada" />
      </div>
    </main>
  )
}
