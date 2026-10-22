import type { CollectionConfig } from 'payload'

import { permitir } from '../access/roles'

export const Lideranca: CollectionConfig = {
  slug: 'lideranca',
  labels: { singular: 'Líder', plural: 'Liderança' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'cargo', 'ordem'],
    group: 'Conteúdo',
  },
  defaultSort: 'ordem',
  access: {
    read: () => true,
    create: permitir('pastor'),
    update: permitir('pastor'),
    delete: permitir('pastor'),
  },
  fields: [
    { name: 'nome', type: 'text', required: true },
    { name: 'cargo', type: 'text', required: true, admin: { description: 'Ex.: Pastor titular, Presbítero, Diácono' } },
    { name: 'foto', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea' },
    { name: 'ordem', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
