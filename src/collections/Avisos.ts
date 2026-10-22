import type { CollectionConfig } from 'payload'

import { permitir } from '../access/roles'

export const Avisos: CollectionConfig = {
  slug: 'avisos',
  labels: { singular: 'Aviso', plural: 'Avisos' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'ativo', 'mostrarAte'],
    group: 'Conteúdo',
    description: 'Avisos ativos aparecem em destaque no topo da página inicial.',
  },
  access: {
    read: () => true,
    create: permitir('pastor', 'secretaria', 'midia'),
    update: permitir('pastor', 'secretaria', 'midia'),
    delete: permitir('pastor', 'secretaria', 'midia'),
  },
  fields: [
    { name: 'titulo', label: 'Título', type: 'text', required: true },
    { name: 'texto', type: 'textarea' },
    {
      name: 'link',
      type: 'text',
      admin: { description: 'Opcional. Ex.: /programacao ou https://...' },
    },
    { name: 'ativo', type: 'checkbox', defaultValue: true },
    {
      name: 'mostrarAte',
      label: 'Mostrar até',
      type: 'date',
      admin: { description: 'Depois desta data o aviso some sozinho.', date: { displayFormat: 'dd/MM/yyyy' } },
    },
  ],
}
