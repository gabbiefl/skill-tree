interface Props {
  nome: string
  sugestoes: string[] // nomes dos pré-requisitos pendentes, dos mais básicos aos mais avançados
  onAceitar: () => void
  onRecusar: () => void
}

// O sistema sugere; quem decide é a pessoa.
export default function ModalSugestao({ nome, sugestoes, onAceitar, onRecusar }: Props) {
  return (
    <div className="fundo fundo-topo">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-sugestao">
        <h2 id="titulo-sugestao">Marcar também os pré-requisitos?</h2>
        <p>
          Para aprender <strong>{nome}</strong>, antes costuma ser preciso saber:
        </p>
        <ul>
          {sugestoes.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p>Quer marcar essas habilidades como concluídas também?</p>
        <div className="botoes">
          <button type="button" className="botao" onClick={onAceitar}>
            Sim, marcar todas
          </button>
          <button type="button" className="botao botao-claro" onClick={onRecusar}>
            Não, só {nome}
          </button>
        </div>
      </div>
    </div>
  )
}
