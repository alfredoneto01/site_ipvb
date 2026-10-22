import type { CollectionConfig } from 'payload'

import { permitir } from '../access/roles'

export const PedidosOracao: CollectionConfig = {
  slug: 'pedidos-oracao',
  labels: { singular: 'Pedido de oração', plural: 'Pedidos de oração' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'pedido', 'atendido', 'createdAt'],
    group: 'Formulários',
    description: 'Visível apenas para pastores e administradores.',
  },
  defaultSort: '-createdAt',
  access: {
    read: permitir('pastor'),
    create: permitir('pastor'),
    update: permitir('pastor'),
    delete: permitir('pastor'),
  },
  fields: [
    { name: 'nome', type: 'text', admin: { description: 'Pode ficar vazio se a pessoa preferir anonimato.' } },
    { name: 'contato', type: 'text' },
    { name: 'pedido', type: 'textarea', required: true },
    { name: 'atendido', label: 'Orado / acompanhado', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
