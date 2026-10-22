import type { CollectionConfig } from 'payload'

import { permitir } from '../access/roles'

export const Eventos: CollectionConfig = {
  slug: 'eventos',
  labels: { singular: 'Evento', plural: 'Agenda' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'data', '_status'],
    group: 'Conteúdo',
  },
  versions: { drafts: true },
  defaultSort: 'data',
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: permitir('pastor', 'secretaria'),
    update: permitir('pastor', 'secretaria'),
    delete: permitir('pastor', 'secretaria'),
  },
  fields: [
    { name: 'titulo', label: 'Título', type: 'text', required: true },
    {
      name: 'data',
      label: 'Data e hora',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' } },
    },
    { name: 'local', type: 'text', admin: { description: 'Deixe vazio se for no templo.' } },
    { name: 'descricao', label: 'Descrição', type: 'textarea' },
    { name: 'imagem', type: 'upload', relationTo: 'media' },
  ],
}
