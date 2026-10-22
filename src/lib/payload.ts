import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Media } from '@/payload-types'

export const getPayloadClient = cache(() => getPayload({ config }))

export const getConfiguracoes = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'configuracoes', depth: 1 })
})

export const getAvisosAtivos = cache(async () => {
  const payload = await getPayloadClient()
  const agora = new Date().toISOString()
  const { docs } = await payload.find({
    collection: 'avisos',
    where: {
      and: [
        { ativo: { equals: true } },
        { or: [{ mostrarAte: { exists: false } }, { mostrarAte: { greater_than_equal: agora } }] },
      ],
    },
    sort: '-createdAt',
    limit: 3,
  })
  return docs
})

export const getProximosEventos = cache(async (limit = 50) => {
  const payload = await getPayloadClient()
  // Considera o dia inteiro: um evento de hoje continua aparecendo até a meia-noite.
  const inicioDoDia = new Date()
  inicioDoDia.setHours(0, 0, 0, 0)
  const { docs } = await payload.find({
    collection: 'eventos',
    where: { and: [{ _status: { equals: 'published' } }, { data: { greater_than_equal: inicioDoDia.toISOString() } }] },
    sort: 'data',
    limit,
    depth: 1,
  })
  return docs
})

export const getMinisterios = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'ministerios', sort: 'ordem', limit: 50, depth: 1 })
  return docs
})

/** Upload pode vir como objeto (depth >= 1) ou apenas o id. */
export const comoMedia = (valor: number | Media | null | undefined): Media | null =>
  valor && typeof valor === 'object' ? valor : null
