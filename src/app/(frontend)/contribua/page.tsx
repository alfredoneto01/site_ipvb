import type { Metadata } from 'next'

import { BlocoPix, TopoPagina } from '@/components/Secoes'
import { getConfiguracoes } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Contribua',
  description: 'Dízimos e ofertas para a Igreja Presbiteriana de Vila Bonilha via PIX ou transferência.',
}

export default async function Contribua() {
  const config = await getConfiguracoes()

  return (
    <>
      <TopoPagina
        chapeu="Contribua"
        titulo="Dízimos e ofertas"
        texto="“Cada um contribua segundo propôs no seu coração, não com tristeza ou por necessidade; porque Deus ama ao que dá com alegria.” 2 Coríntios 9.7"
      />

      <section className="container secao pilha" style={{ gap: 32 }}>
        <BlocoPix config={config} />
        {config.dadosBancarios && (
          <div className="painel-form painel-form--claro">
            <h2>Transferência bancária</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{config.dadosBancarios}</p>
          </div>
        )}
      </section>
    </>
  )
}
