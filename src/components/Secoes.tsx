import Image from 'next/image'
import Link from 'next/link'

import type { Configuracoes, Evento, Ministerio } from '@/payload-types'
import { dia, diaDaSemanaEHora, mesCurto } from '@/lib/formatar'
import { comoMedia } from '@/lib/payload'
import type { Video } from '@/lib/youtube'
import { CopiarChave } from './CopiarChave'
import { Foto } from './Foto'
import { Icone } from './Icone'

export function TopoPagina({ chapeu, titulo, texto }: { chapeu: string; titulo: string; texto?: string }) {
  return (
    <section className="topo-pagina">
      <div className="container">
        <span className="chapeu chapeu--claro">{chapeu}</span>
        <h1>{titulo}</h1>
        {texto && <p>{texto}</p>}
      </div>
    </section>
  )
}

export function ListaEventos({ eventos }: { eventos: Evento[] }) {
  if (eventos.length === 0) {
    return <p className="vazio">Nenhum evento agendado no momento. Confira os cultos fixos acima.</p>
  }
  return (
    <ul className="eventos">
      {eventos.map((ev) => (
        <li key={ev.id} className="evento">
          <div className="evento__data" aria-hidden="true">
            <span className="evento__dia">{dia(ev.data)}</span>
            <span className="evento__mes">{mesCurto(ev.data)}</span>
          </div>
          <div className="evento__info">
            <h3>{ev.titulo}</h3>
            <p>
              <time dateTime={ev.data}>{diaDaSemanaEHora(ev.data)}</time>
              {ev.local && ` · ${ev.local}`}
            </p>
            {ev.descricao && <p className="evento__descricao">{ev.descricao}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}

export function CartoesMinisterios({ ministerios }: { ministerios: Ministerio[] }) {
  return (
    <div className="grade grade--4">
      {ministerios.map((m) => (
        <Link key={m.id} href={`/ministerios#${m.id}`} className="cartao-ministerio">
          <Foto
            media={comoMedia(m.imagem)}
            placeholder={`Foto: ${m.nome.toLowerCase()}`}
            tom={m.cor ?? 'laranja'}
            className="cartao-ministerio__foto"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div className="cartao-ministerio__corpo">
            <h3>{m.nome}</h3>
            <p>{m.resumo}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function VideoDestaque({ video }: { video: Video | undefined }) {
  if (!video) {
    return (
      <div className="video video--vazio">
        <span className="video__play">
          <Icone nome="play" tamanho={28} />
        </span>
        <span>Configure o canal do YouTube para exibir o último culto aqui.</span>
      </div>
    )
  }
  return (
    <div className="video">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.id}`}
        title={video.titulo}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export function BlocoPix({ config }: { config: Configuracoes }) {
  const pix = config.pix
  const qrcode = comoMedia(pix?.qrcode)
  return (
    <div className="pix">
      <div className="pix__texto">
        <h2>Contribua com a obra</h2>
        <p>Dízimos e ofertas sustentam o trabalho da igreja e a ação social no bairro.</p>
        <Link href="/contribua" className="link-claro">
          Outras formas de contribuir <Icone nome="seta" tamanho={18} />
        </Link>
      </div>
      <div className="pix__cartao">
        {qrcode?.url ? (
          <Image src={qrcode.url} alt="QR Code PIX" width={112} height={112} className="pix__qr" />
        ) : (
          <div className="pix__qr pix__qr--vazio">QR Code PIX</div>
        )}
        <div className="pix__chave">
          <span>Chave PIX{pix?.tipo ? ` (${pix.tipo})` : ''}</span>
          <strong>{pix?.chave || 'Cadastre a chave no painel'}</strong>
          {pix?.favorecido && <span>{pix.favorecido}</span>}
          {pix?.chave && <CopiarChave chave={pix.chave} />}
        </div>
      </div>
    </div>
  )
}
