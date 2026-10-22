import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

// Qualquer alteração no painel atualiza as páginas públicas na hora.
const revalidar = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Fora do Next (ex.: script de seed) não há cache para invalidar.
  }
}

export const revalidarAposSalvar: CollectionAfterChangeHook = ({ doc }) => {
  revalidar()
  return doc
}

export const revalidarAposExcluir: CollectionAfterDeleteHook = ({ doc }) => {
  revalidar()
  return doc
}

export const revalidarGlobal: GlobalAfterChangeHook = ({ doc }) => {
  revalidar()
  return doc
}
