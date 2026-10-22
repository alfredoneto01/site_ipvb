'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { Icone } from './Icone'
import { LINKS } from './links'

export function Cabecalho() {
  const [aberto, setAberto] = useState(false)
  const pathname = usePathname()
  const [pathnameAnterior, setPathnameAnterior] = useState(pathname)

  // Fecha o menu do celular ao navegar para outra página.
  if (pathname !== pathnameAnterior) {
    setPathnameAnterior(pathname)
    setAberto(false)
  }

  return (
    <header className="cabecalho">
      <div className="container cabecalho__linha">
        <Link href="/" className="marca">
          <Image src="/logo-ipvb.png" alt="" width={56} height={56} priority />
          <span className="marca__nome">
            <strong>Igreja Presbiteriana</strong>
            <span>de Vila Bonilha</span>
          </span>
        </Link>

        <button
          type="button"
          className="cabecalho__menu-btn"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setAberto((v) => !v)}
        >
          <Icone nome={aberto ? 'fechar' : 'menu'} tamanho={26} />
        </button>

        <nav id="menu-principal" aria-label="Principal" className={`cabecalho__nav ${aberto ? 'is-aberto' : ''}`}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname.startsWith(l.href) ? 'page' : undefined}>
              {l.rotulo}
            </Link>
          ))}
          <Link href="/primeira-visita" className="botao botao--destaque cabecalho__cta">
            Planeje sua visita
          </Link>
        </nav>
      </div>
    </header>
  )
}
