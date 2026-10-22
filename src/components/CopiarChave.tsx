'use client'

import { useState } from 'react'

import { Icone } from './Icone'

export function CopiarChave({ chave }: { chave: string }) {
  const [copiado, setCopiado] = useState(false)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(chave)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      // Navegadores sem permissão de área de transferência: a chave segue visível para cópia manual.
    }
  }

  return (
    <button type="button" className="botao botao--destaque botao--pequeno" onClick={copiar}>
      <Icone nome={copiado ? 'check' : 'copiar'} tamanho={18} />
      <span aria-live="polite">{copiado ? 'Chave copiada!' : 'Copiar chave'}</span>
    </button>
  )
}
