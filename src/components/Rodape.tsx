import Image from 'next/image'
import Link from 'next/link'

import type { Configuracoes } from '@/payload-types'
import { linkWhatsapp } from '@/lib/formatar'
import { LINKS } from './links'

export function Rodape({ config }: { config: Configuracoes }) {
  const whatsapp = linkWhatsapp(config.whatsapp)
  const redes = [
    { rotulo: 'Instagram', href: config.instagram },
    { rotulo: 'YouTube', href: config.youtube },
    { rotulo: 'Spotify', href: config.spotify },
    { rotulo: 'Facebook', href: config.facebook },
  ].filter((r) => r.href)

  return (
    <footer className="rodape">
      <div className="container rodape__grade">
        <div className="rodape__marca">
          <span className="rodape__logo">
            <Image src="/logo-ipvb.png" alt="" width={60} height={60} />
          </span>
          <strong>Igreja Presbiteriana de Vila Bonilha</strong>
        </div>

        <div className="rodape__col">
          <h2>Endereço</h2>
          <p>
            {config.endereco}
            <br />
            {config.bairro}
          </p>
          {config.mapsUrl && (
            <a href={config.mapsUrl} target="_blank" rel="noopener noreferrer">
              Abrir no Google Maps
            </a>
          )}
        </div>

        <div className="rodape__col">
          <h2>Fale conosco</h2>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          )}
          {config.telefone && <span>{config.telefone}</span>}
          {config.email && <a href={`mailto:${config.email}`}>{config.email}</a>}
          {redes.length > 0 && (
            <p className="rodape__redes">
              {redes.map((r) => (
                <a key={r.rotulo} href={r.href!} target="_blank" rel="noopener noreferrer">
                  {r.rotulo}
                </a>
              ))}
            </p>
          )}
        </div>

        <nav className="rodape__col" aria-label="Rodapé">
          <h2>Navegue</h2>
          <Link href="/primeira-visita">Primeira visita</Link>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.rotulo}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container rodape__base">
        <span>© {new Date().getFullYear()} IPVB · Igreja Presbiteriana do Brasil</span>
        <Link href="/admin">Área administrativa</Link>
      </div>
    </footer>
  )
}
