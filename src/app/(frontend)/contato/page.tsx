import type { Metadata } from 'next'

import { FormContato, FormOracao } from '@/components/Formularios'
import { Icone } from '@/components/Icone'
import { TopoPagina } from '@/components/Secoes'
import { linkWhatsapp } from '@/lib/formatar'
import { getConfiguracoes } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Endereço, WhatsApp e formulário de contato da IPVB. Envie também seu pedido de oração.',
}

export default async function Contato() {
  const config = await getConfiguracoes()
  const whatsapp = linkWhatsapp(config.whatsapp, 'Olá! Vim pelo site da IPVB.')
  const enderecoCompleto = `${config.endereco}, ${config.bairro}`

  return (
    <>
      <TopoPagina chapeu="Contato" titulo="Fale com a gente" texto="Estamos aqui para te ouvir, tirar dúvidas e orar com você." />

      <section className="container secao duas-colunas duas-colunas--topo">
        <div className="pilha" style={{ gap: 28 }}>
          <div className="contato-lista">
            <div className="contato-item">
              <span className="icone-circulo icone-circulo--verde">
                <Icone nome="local" />
              </span>
              <div>
                <h3>Endereço</h3>
                <p>
                  {config.endereco}
                  <br />
                  {config.bairro}
                </p>
              </div>
            </div>
            {config.telefone && (
              <div className="contato-item">
                <span className="icone-circulo icone-circulo--laranja">
                  <Icone nome="telefone" />
                </span>
                <div>
                  <h3>Telefone</h3>
                  <a href={`tel:+55${config.telefone.replace(/\D/g, '').replace(/^55/, '')}`} className="link-forte">
                    {config.telefone}
                  </a>
                  <p>Visita pastoral e aconselhamento espiritual</p>
                </div>
              </div>
            )}
            {whatsapp && (
              <div className="contato-item">
                <span className="icone-circulo icone-circulo--azul">
                  <Icone nome="whatsapp" />
                </span>
                <div>
                  <h3>WhatsApp</h3>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="link-forte">
                    Iniciar conversa
                  </a>
                </div>
              </div>
            )}
            {config.email && (
              <div className="contato-item">
                <span className="icone-circulo icone-circulo--verde">
                  <Icone nome="email" />
                </span>
                <div>
                  <h3>E-mail</h3>
                  <a href={`mailto:${config.email}`} className="link-forte">
                    {config.email}
                  </a>
                </div>
              </div>
            )}
          </div>
          <iframe
            className="mapa"
            title="Mapa até a igreja"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(enderecoCompleto)}&output=embed`}
          />
        </div>

        <div className="pilha" style={{ gap: 24 }}>
          <div className="painel-form painel-form--claro">
            <h2>Envie uma mensagem</h2>
            <FormContato />
          </div>
          <div id="oracao" className="painel-form ancora">
            <h2>Pedido de oração</h2>
            <p>Compartilhe sua necessidade. Vamos orar por você.</p>
            <FormOracao />
          </div>
        </div>
      </section>
    </>
  )
}
