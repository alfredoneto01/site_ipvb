import Image from 'next/image'
import Link from 'next/link'

import { Icone, type NomeIcone } from '@/components/Icone'
import { BlocoPix, CartoesMinisterios, ListaEventos, VideoDestaque } from '@/components/Secoes'
import { Foto } from '@/components/Foto'
import { dataLonga } from '@/lib/formatar'
import {
  comoMedia,
  getAvisosAtivos,
  getConfiguracoes,
  getMinisterios,
  getPayloadClient,
  getProximosEventos,
} from '@/lib/payload'
import { getVideosDoCanal } from '@/lib/youtube'

const TONS = ['azul', 'laranja', 'verde'] as const

export default async function Inicio() {
  const payload = await getPayloadClient()
  const [config, pagina, avisos, eventos, ministerios, videos] = await Promise.all([
    getConfiguracoes(),
    payload.findGlobal({ slug: 'pagina-inicial', depth: 1 }),
    getAvisosAtivos(),
    getProximosEventos(3),
    getMinisterios(),
    getVideosDoCanal(),
  ])

  const hero = pagina.hero
  const fotoHero = comoMedia(hero?.imagem)
  const horarios = (config.horarios ?? []).slice(0, 2)
  const ultimo = videos[0]

  return (
    <>
      {avisos.length > 0 && (
        <section className="avisos" aria-label="Avisos">
          <div className="container avisos__lista">
            {avisos.map((a) => (
              <p key={a.id} className="aviso">
                <Icone nome="megafone" tamanho={20} />
                <strong>{a.titulo}</strong>
                {a.texto && <span>{a.texto}</span>}
                {a.link && (
                  <Link href={a.link} className="aviso__link">
                    Saiba mais
                  </Link>
                )}
              </p>
            ))}
          </div>
        </section>
      )}

      <section className={`hero ${fotoHero?.url ? 'hero--com-foto' : ''}`}>
        {fotoHero?.url && (
          <Image
            src={fotoHero.sizes?.hero?.url || fotoHero.url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero__foto"
            style={{ objectPosition: `${fotoHero.focalX ?? 50}% ${fotoHero.focalY ?? 50}%` }}
          />
        )}
        <div className="container hero__conteudo">
          <h1>{hero?.titulo || 'Uma igreja para chamar de casa'}</h1>
          {hero?.subtitulo && <p>{hero.subtitulo}</p>}
          <div className="botoes">
            <Link href="/primeira-visita" className="botao botao--destaque botao--grande">
              Quero visitar
            </Link>
            <Link href="/mensagens" className="botao botao--contorno-claro botao--grande">
              <Icone nome="play" tamanho={18} />
              Assistir ao último culto
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Horários e endereço" className="container info-rapida">
        <div className="grade grade--3">
          {horarios.map((h, i) => (
            <div key={h.id ?? i} className="info-cartao">
              <span className={`icone-circulo icone-circulo--${TONS[i]}`}>
                <Icone nome={(h.icone as NomeIcone) ?? 'relogio'} />
              </span>
              <div>
                <h2>{h.titulo}</h2>
                <p>{h.descricao}</p>
              </div>
            </div>
          ))}
          <div className="info-cartao">
            <span className="icone-circulo icone-circulo--verde">
              <Icone nome="local" />
            </span>
            <div>
              <h2>Onde estamos</h2>
              <p>
                {config.endereco}
                <br />
                {config.bairro}
              </p>
              {config.mapsUrl && (
                <a href={config.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-forte">
                  Como chegar →
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container secao duas-colunas">
        <div className="pilha">
          <span className="chapeu">Quem somos</span>
          <h2 className="titulo-secao">{pagina.quemSomos?.titulo || 'Gente comum, alcançada pela graça de Deus'}</h2>
          {pagina.quemSomos?.texto?.split('\n\n').map((p, i) => <p key={i} className="texto-suave">{p}</p>)}
          <div className="links-linha">
            <Link href="/quem-somos#cremos">No que cremos</Link>
            <Link href="/quem-somos#aconselhamento">Visita pastoral</Link>
            <Link href="/quem-somos#lideranca">Pastores e liderança</Link>
          </div>
        </div>
        <Foto
          media={comoMedia(pagina.quemSomos?.imagem)}
          placeholder="Foto: pastor conversando com membros na porta da igreja"
          className="foto--arredondada foto--4x3"
        />
      </section>

      <section className="faixa faixa--verde-claro">
        <div className="container secao duas-colunas">
          <VideoDestaque video={ultimo} />
          <div className="pilha">
            <span className="chapeu chapeu--azul">Última mensagem</span>
            <h2 className="titulo-secao">{ultimo?.titulo ?? 'Mensagens da Palavra'}</h2>
            {ultimo && <p className="texto-suave">Publicado em {dataLonga(ultimo.publicadoEm)}</p>}
            <div className="botoes">
              <Link href="/mensagens" className="botao botao--escuro">
                Ver todas as mensagens
              </Link>
              {config.spotify && (
                <a href={config.spotify} target="_blank" rel="noopener noreferrer" className="botao botao--contorno">
                  Ouvir no Spotify
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {ministerios.length > 0 && (
        <section className="container secao">
          <div className="cabeca-secao">
            <span className="chapeu">Ministérios</span>
            <h2 className="titulo-secao">Tem lugar para você e sua família</h2>
          </div>
          <CartoesMinisterios ministerios={ministerios.slice(0, 4)} />
        </section>
      )}

      <section className="faixa faixa--creme">
        <div className="container secao duas-colunas duas-colunas--topo">
          <div className="pilha">
            <span className="chapeu">Agenda</span>
            <h2 className="titulo-secao">O que vem por aí</h2>
            <p className="texto-suave">Cultos especiais, encontros e eventos da nossa comunidade.</p>
            <Link href="/programacao" className="link-forte">
              Ver programação completa →
            </Link>
          </div>
          <ListaEventos eventos={eventos} />
        </div>
      </section>

      <section className="container secao">
        <BlocoPix config={config} />
      </section>
    </>
  )
}
