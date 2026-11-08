import ChipEstado from './ChipEstado'
import Icone from './Icones'

interface Props {
  nome: string
  descricao: string
  totalAreas: number
  totalHabilidades: number
  // Já existe progresso salvo: o botão passa a "Continuar".
  continuar: boolean
  onComecar: () => void
}

// Só o Front-end está mapeado. As outras aparecem como "em breve" para mostrar a
// visão do projeto sem prometer o que ainda não existe.
const EM_BREVE = [
  {
    nome: 'Desenvolvedor Back-end',
    descricao: 'Servidores, bancos de dados e APIs por trás dos aplicativos.',
    linhas: 'M60 75L130 45M60 75L130 105M130 45L210 45M130 105L210 105M210 45L262 75M210 105L262 75',
    nos: [[60, 75], [130, 45], [130, 105], [210, 45], [210, 105], [262, 75]],
  },
  {
    nome: 'Analista de Dados',
    descricao: 'Colete, limpe e analise dados para responder perguntas.',
    linhas: 'M56 100L120 60M120 60L190 90M190 90L256 48M120 60L190 40',
    nos: [[56, 100], [120, 60], [190, 90], [190, 40], [256, 48]],
  },
  {
    nome: 'Desenvolvedor Mobile',
    descricao: 'Aplicativos para celular, do primeiro layout à publicação.',
    linhas: 'M52 75L112 42M52 75L112 108M112 42L180 75M112 108L180 75M180 75L254 75',
    nos: [[52, 75], [112, 42], [112, 108], [180, 75], [254, 75]],
  },
]

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

export default function EscolhaCarreira({ nome, descricao, totalAreas, totalHabilidades, continuar, onComecar }: Props) {
  return (
    <main className="escolha">
      <span className="eyebrow">
        <Icone nome="livro" /> Guia de estudos para carreiras de TI
      </span>
      <h1 className="h-display">Qual carreira de TI você quer explorar?</h1>
      <p className="lead">
        Veja a trilha como um mapa de habilidades. Marque o que você já sabe e descubra o que estudar agora.
      </p>

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
              <span className="chip neutral">{totalAreas} áreas</span>
              <span className="chip neutral">{totalHabilidades} habilidades</span>
            </div>
            <span className="grow" />
            <button type="button" className="btn pri lg cheio" onClick={onComecar}>
              {continuar ? 'Continuar a trilha' : 'Começar a trilha'} <Icone nome="setaDireita" />
            </button>
          </div>
        </article>

        {EM_BREVE.map((c) => (
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
              <span className="grow" />
              <button type="button" className="btn dis lg cheio" disabled>
                Em breve
              </button>
            </div>
          </article>
        ))}
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
