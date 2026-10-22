import type { Metadata } from 'next'
import Image from 'next/image'

import { TopoPagina, VideoDestaque } from '@/components/Secoes'
import { dataLonga } from '@/lib/formatar'
import { getConfiguracoes } from '@/lib/payload'
import { getVideosDoCanal } from '@/lib/youtube'

export const metadata: Metadata = {
  title: 'Mensagens',
  description: 'Assista aos cultos e sermões da Igreja Presbiteriana de Vila Bonilha.',
}

export default async function Mensagens() {
  const [videos, config] = await Promise.all([getVideosDoCanal(), getConfiguracoes()])
  const [ultimo, ...anteriores] = videos

  return (
    <>
      <TopoPagina chapeu="Mensagens" titulo="Ouça a Palavra" texto="Cultos e sermões publicados no nosso canal do YouTube." />

      <section className="container secao duas-colunas">
        <VideoDestaque video={ultimo} />
        <div className="pilha">
          <span className="chapeu chapeu--azul">Mais recente</span>
          <h2 className="titulo-secao">{ultimo?.titulo ?? 'Em breve'}</h2>
          {ultimo && <p className="texto-suave">Publicado em {dataLonga(ultimo.publicadoEm)}</p>}
          <div className="botoes">
            {config.youtube && (
              <a href={config.youtube} target="_blank" rel="noopener noreferrer" className="botao botao--escuro">
                Inscreva-se no canal
              </a>
            )}
            {config.spotify && (
              <a href={config.spotify} target="_blank" rel="noopener noreferrer" className="botao botao--contorno">
                Ouvir no Spotify
              </a>
            )}
          </div>
        </div>
      </section>

      {anteriores.length > 0 && (
        <section className="faixa faixa--verde-claro">
          <div className="container secao">
            <h2 className="titulo-secao" style={{ marginBottom: 28 }}>
              Mensagens anteriores
            </h2>
            <div className="videos">
              {anteriores.map((v) => (
                <a key={v.id} href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="video-cartao">
                  <div className="video-cartao__thumb">
                    <Image src={v.thumbnail} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <h3>{v.titulo}</h3>
                  <span>{dataLonga(v.publicadoEm)}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
