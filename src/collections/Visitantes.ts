import type { CollectionConfig } from 'payload'

import { permitir } from '../access/roles'
import { OPCOES_VISITA } from '../lib/visita'

export const Visitantes: CollectionConfig = {
  slug: 'visitantes',
  labels: { singular: 'Visitante', plural: 'Visitantes' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'whatsapp', 'quando', 'pessoas', 'contatado', 'createdAt'],
    group: 'Formulários',
    description: 'Pessoas que avisaram pelo site que vão visitar a igreja.',
  },
  defaultSort: '-createdAt',
  access: {
    // Criação acontece pela server action do site (com overrideAccess), nunca pela API pública.
    read: permitir('pastor', 'secretaria'),
    create: permitir('pastor', 'secretaria'),
    update: permitir('pastor', 'secretaria'),
    delete: permitir('pastor', 'secretaria'),
  },
  fields: [
    { name: 'nome', type: 'text', required: true },
    { name: 'whatsapp', label: 'WhatsApp', type: 'text', required: true },
    {
      name: 'quando',
      type: 'select',
      required: true,
      options: [...OPCOES_VISITA],
    },
    { name: 'pessoas', type: 'number', defaultValue: 1, min: 1 },
    { name: 'criancas', label: 'Vai levar crianças', type: 'checkbox' },
    { name: 'mensagem', type: 'textarea' },
    {
      name: 'contatado',
      label: 'Já entramos em contato',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
