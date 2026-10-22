import type { CollectionConfig } from 'payload'

import { permitir } from '../access/roles'

export const Contatos: CollectionConfig = {
  slug: 'contatos',
  labels: { singular: 'Mensagem de contato', plural: 'Mensagens de contato' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'email', 'respondido', 'createdAt'],
    group: 'Formulários',
  },
  defaultSort: '-createdAt',
  access: {
    read: permitir('pastor', 'secretaria'),
    create: permitir('pastor', 'secretaria'),
    update: permitir('pastor', 'secretaria'),
    delete: permitir('pastor', 'secretaria'),
  },
  fields: [
    { name: 'nome', type: 'text', required: true },
    { name: 'email', label: 'E-mail ou WhatsApp', type: 'text', required: true },
    { name: 'mensagem', type: 'textarea', required: true },
    { name: 'respondido', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
