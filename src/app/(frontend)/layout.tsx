import type { Metadata } from 'next'
import { Fraunces, Nunito_Sans } from 'next/font/google'
import React from 'react'

import { Cabecalho } from '@/components/Cabecalho'
import { Icone } from '@/components/Icone'
import { Rodape } from '@/components/Rodape'
import { linkWhatsapp } from '@/lib/formatar'
import { getConfiguracoes } from '@/lib/payload'
import './styles.css'

const fraunces = Fraunces({ subsets: ['latin'], weight: ['500', '600'], variable: '--fonte-titulo' })
const nunito = Nunito_Sans({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--fonte-texto' })

// Páginas são geradas estaticamente e atualizadas ao salvar no painel;
// a cada hora também se renovam para tirar eventos que já passaram.
export const revalidate = 3600

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Igreja Presbiteriana de Vila Bonilha',
    template: '%s · IPVB',
  },
  description:
    'Igreja Presbiteriana de Vila Bonilha, em Vila Pereira Barreto, São Paulo. Venha nos visitar: cultos aos domingos, Escola Dominical e ministérios para toda a família.',
  icons: { icon: '/logo-ipvb.png' },
  openGraph: { locale: 'pt_BR', type: 'website', siteName: 'IPVB' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getConfiguracoes()
  const whatsapp = linkWhatsapp(config.whatsapp, 'Olá! Vim pelo site da IPVB.')

  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${nunito.variable}`}>
      <body>
        <a href="#conteudo" className="pular">
          Pular para o conteúdo
        </a>
        <Cabecalho />
        <main id="conteudo">{children}</main>
        <Rodape config={config} />
        {whatsapp && (
          <a href={whatsapp} className="whatsapp-flutuante" target="_blank" rel="noopener noreferrer" aria-label="Fale conosco no WhatsApp">
            <Icone nome="whatsapp" tamanho={28} />
          </a>
        )}
      </body>
    </html>
  )
}
