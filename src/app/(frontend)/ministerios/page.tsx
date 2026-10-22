import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'

import { Foto } from '@/components/Foto'
import { TopoPagina } from '@/components/Secoes'
import { comoMedia, getMinisterios } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Ministérios',
  description: 'Crianças, jovens, casais, ação social e mais: encontre seu lugar na IPVB.',
}

export default async function Ministerios() {
  const ministerios = await getMinisterios()

  return (
    <>
      <TopoPagina chapeu="Ministérios" titulo="Tem lugar para você e sua família" texto="Cada ministério é uma forma de servir, aprender e criar laços na comunidade." />

      {ministerios.map((m, i) => (
        <section key={m.id} id={String(m.id)} className={`ministerio ${i % 2 ? 'faixa faixa--verde-claro' : ''}`}>
          <div className="container secao duas-colunas">
            <Foto
              media={comoMedia(m.imagem)}
              placeholder={`Foto: ${m.nome.toLowerCase()}`}
              tom={m.cor ?? 'laranja'}
              className="foto--arredondada foto--4x3"
            />
            <div className="pilha">
              <h2 className="titulo-secao">{m.nome}</h2>
              <p className="texto-suave">{m.resumo}</p>
              {m.descricao && <RichText data={m.descricao} className="texto-rico" />}
              {(m.quando || m.responsavel) && (
                <p className="ministerio__meta">
                  {m.quando && (
                    <span>
                      <strong>Quando:</strong> {m.quando}
                    </span>
                  )}
                  {m.responsavel && (
                    <span>
                      <strong>Responsável:</strong> {m.responsavel}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
