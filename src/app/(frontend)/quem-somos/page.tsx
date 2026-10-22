import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'

import { Foto } from '@/components/Foto'
import { TopoPagina } from '@/components/Secoes'
import { linkWhatsapp } from '@/lib/formatar'
import { comoMedia, getConfiguracoes, getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Quem somos',
  description: 'Conheça o compromisso, as convicções e a liderança da Igreja Presbiteriana de Vila Bonilha.',
}

export default async function QuemSomos() {
  const payload = await getPayloadClient()
  const [inst, lideranca, config] = await Promise.all([
    payload.findGlobal({ slug: 'institucional', depth: 1 }),
    payload.find({ collection: 'lideranca', sort: 'ordem', limit: 50, depth: 1 }),
    getConfiguracoes(),
  ])
  const whatsapp = linkWhatsapp(config.whatsapp, 'Olá! Gostaria de agendar uma visita pastoral.')
  const telefone = config.telefone?.replace(/\D/g, '')

  return (
    <>
      <TopoPagina
        chapeu="Quem somos"
        titulo="Conheça a Igreja Presbiteriana do Brasil em Vila Bonilha"
        texto="Herdeiros da Reforma do século 16, com amor à liberdade e fidelidade à Palavra de Deus."
      />

      <section id="compromisso" className="container secao duas-colunas ancora">
        <div className="pilha">
          <span className="chapeu">Nosso compromisso</span>
          {inst.compromisso && <p className="destaque-citacao">{inst.compromisso}</p>}
        </div>
        <Foto media={comoMedia(inst.imagem)} placeholder="Foto: fachada ou culto da igreja" tom="verde" className="foto--arredondada foto--4x3" />
      </section>

      {inst.historia && (
        <section id="historia" className="faixa faixa--creme ancora">
          <div className="container secao pilha">
            <span className="chapeu">Nossa história</span>
            <RichText data={inst.historia} className="texto-rico" />
          </div>
        </section>
      )}

      {inst.cremos && (
        <section id="cremos" className="faixa faixa--verde-claro ancora">
          <div className="container secao pilha">
            <span className="chapeu chapeu--azul">No que cremos</span>
            <h2 className="titulo-secao">Nossas convicções</h2>
            <RichText data={inst.cremos} className="texto-rico" />
          </div>
        </section>
      )}

      {lideranca.docs.length > 0 && (
        <section id="lideranca" className="container secao ancora">
          <div className="cabeca-secao">
            <span className="chapeu">Liderança</span>
            <h2 className="titulo-secao">Pastores e conselho</h2>
          </div>
          <div className="grade grade--4">
            {lideranca.docs.map((l) => (
              <article key={l.id} className="lider">
                <Foto media={comoMedia(l.foto)} placeholder={`Foto: ${l.nome}`} tom="azul" className="lider__foto" sizes="(max-width: 768px) 100vw, 25vw" />
                <div>
                  <h3>{l.nome}</h3>
                  <span className="lider__cargo">{l.cargo}</span>
                </div>
                {l.bio && <p className="lider__bio">{l.bio}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {(telefone || whatsapp) && (
        <section id="aconselhamento" className="container secao ancora">
          <div className="pix">
            <div className="pix__texto">
              <h2>Visita pastoral e aconselhamento espiritual</h2>
              <p>Ligue para nós e teremos prazer em atendê-lo.</p>
            </div>
            <div className="botoes">
              {telefone && (
                <a href={`tel:+55${telefone.replace(/^55/, '')}`} className="botao botao--destaque botao--grande">
                  Ligar: {config.telefone}
                </a>
              )}
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="botao botao--contorno-claro botao--grande">
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
