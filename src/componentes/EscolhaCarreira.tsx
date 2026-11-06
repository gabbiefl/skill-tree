interface Props {
  nome: string
  descricao: string
  onEscolher: () => void
}

// Só o Front-end está mapeado. As outras aparecem como "em breve" para mostrar a
// visão do projeto sem prometer o que ainda não existe.
const EM_BREVE = ['Desenvolvedor Back-end', 'Analista de Dados', 'Desenvolvedor Mobile']

export default function EscolhaCarreira({ nome, descricao, onEscolher }: Props) {
  return (
    <section className="escolha">
      <h1>Qual carreira em TI você quer seguir?</h1>
      <p className="escolha-sub">
        Escolha uma carreira, diga o que você já conhece e veja a trilha do que falta aprender.
      </p>
      <div className="cartoes">
        <button type="button" className="cartao cartao-ativo" onClick={onEscolher}>
          <strong>{nome}</strong>
          <span>{descricao}</span>
        </button>
        {EM_BREVE.map((n) => (
          <div key={n} className="cartao cartao-bloqueado" aria-disabled="true">
            <strong>{n}</strong>
            <span>Em breve</span>
          </div>
        ))}
      </div>
    </section>
  )
}
