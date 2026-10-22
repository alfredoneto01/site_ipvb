import type { Metadata } from 'next'

import { FormVisita } from '@/components/Formularios'
import { Icone } from '@/components/Icone'
import { Perguntas } from '@/components/Perguntas'
import { TopoPagina } from '@/components/Secoes'
import { getConfiguracoes, getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Primeira visita',
  description: 'Vai visitar a IPVB pela primeira vez? Veja o que esperar, horários, endereço e avise que você vem.',
}

const CORES = ['var(--laranja-claro)', 'var(--azul-claro)', 'var(--verde-claro)']

export default async function PrimeiraVisita() {
  const payload = await getPayloadClient()
  const [pv, config] = await Promise.all([payload.findGlobal({ slug: 'primeira-visita' }), getConfiguracoes()])

  return (
    <>
      <TopoPagina
        chapeu="Primeira visita"
        titulo="É sua primeira vez? Que bom ter você aqui."
        texto="Visitar uma igreja nova pode dar um frio na barriga. Contamos tudo o que você precisa saber antes de chegar."
      />

      {pv.passos && pv.passos.length > 0 && (
        <section className="container secao">
          <div className="cabeca-secao">
            <span className="chapeu">O que esperar</span>
            <h2 className="titulo-secao">Como é um domingo na IPVB</h2>
          </div>
          <div className="passos">
            {pv.passos.map((p, i) => (
              <div key={p.id ?? i} className="passo">
                <span className="passo__numero" style={{ background: CORES[i % CORES.length] }}>
                  {i + 1}
                </span>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="faixa faixa--verde-claro">
        <div className="container secao duas-colunas duas-colunas--topo">
          <div className="pilha">
            <span className="chapeu chapeu--azul">Horários e endereço</span>
            <div className="contato-lista">
              {config.horarios?.map((h, i) => (
                <div key={h.id ?? i} className="contato-item">
                  <span className="icone-circulo icone-circulo--azul">
                    <Icone nome="relogio" />
                  </span>
                  <div>
                    <h3>{h.titulo}</h3>
                    <p>{h.descricao}</p>
                  </div>
                </div>
              ))}
              <div className="contato-item">
                <span className="icone-circulo icone-circulo--verde">
                  <Icone nome="local" />
                </span>
                <div>
                  <h3>{config.endereco}</h3>
                  <p>{config.bairro}</p>
                  {config.mapsUrl && (
                    <a href={config.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-forte">
                      Abrir no Google Maps →
                    </a>
                  )}
                </div>
              </div>
            </div>

            {pv.perguntas && pv.perguntas.length > 0 && (
              <>
                <h2 className="titulo-secao" style={{ marginTop: 24 }}>
                  Perguntas frequentes
                </h2>
                <Perguntas itens={pv.perguntas} />
              </>
            )}
          </div>

          <div id="avise" className="painel-form ancora">
            <h2>Avise que você vem</h2>
            <p>Alguém da recepção vai te esperar na porta. É opcional, mas ajuda a gente a te receber melhor.</p>
            <FormVisita />
          </div>
        </div>
      </section>
    </>
  )
}
