import Link from 'next/link'

export default function NaoEncontrado() {
  return (
    <section className="container secao pilha" style={{ alignItems: 'center', textAlign: 'center' }}>
      <span className="chapeu">Página não encontrada</span>
      <h1 className="titulo-secao">Ops, essa página não existe</h1>
      <p className="texto-suave">O endereço pode ter mudado. Que tal voltar ao início?</p>
      <Link href="/" className="botao botao--escuro">
        Ir para o início
      </Link>
    </section>
  )
}
