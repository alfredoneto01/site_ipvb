import type { Metadata } from 'next'

import { Icone, type NomeIcone } from '@/components/Icone'
import { ListaEventos, TopoPagina } from '@/components/Secoes'
import { getConfiguracoes, getProximosEventos } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Programação',
  description: 'Horários dos cultos, Escola Dominical e próximos eventos da IPVB.',
}

export default async function Programacao() {
  const [config, eventos] = await Promise.all([getConfiguracoes(), getProximosEventos()])

  return (
    <>
      <TopoPagina chapeu="Programação" titulo="Cultos e eventos" texto="Você é sempre bem-vindo. Confira nossos encontros semanais e o que vem por aí." />

      <section className="container secao">
        <h2 className="titulo-secao" style={{ marginBottom: 28 }}>
          Toda semana
        </h2>
        <div className="horarios-fixos">
          {config.horarios?.map((h, i) => (
            <div key={h.id ?? i} className="info-cartao">
              <span className="icone-circulo icone-circulo--azul">
                <Icone nome={(h.icone as NomeIcone) ?? 'relogio'} />
              </span>
              <div>
                <h2>{h.titulo}</h2>
                <p>{h.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="faixa faixa--creme">
        <div className="container secao">
          <h2 className="titulo-secao" style={{ marginBottom: 28 }}>
            Próximos eventos
          </h2>
          <ListaEventos eventos={eventos} />
        </div>
      </section>
    </>
  )
}
