type Pergunta = { id?: string | null; pergunta: string; resposta: string }

// <details> nativo: acessível por teclado e funciona sem JavaScript.
export function Perguntas({ itens }: { itens: Pergunta[] }) {
  return (
    <div className="perguntas">
      {itens.map((p, i) => (
        <details key={p.id ?? i} className="perguntas__item" open={i === 0}>
          <summary>{p.pergunta}</summary>
          <p>{p.resposta}</p>
        </details>
      ))}
    </div>
  )
}
