import type { GlobalConfig } from 'payload'

import { permitir } from '../access/roles'

export const PrimeiraVisita: GlobalConfig = {
  slug: 'primeira-visita',
  label: 'Primeira visita',
  admin: { group: 'Páginas' },
  access: {
    read: () => true,
    update: permitir('pastor', 'secretaria'),
  },
  fields: [
    {
      name: 'passos',
      label: 'O que esperar',
      type: 'array',
      maxRows: 6,
      labels: { singular: 'Passo', plural: 'Passos' },
      fields: [
        { name: 'titulo', label: 'Título', type: 'text', required: true },
        { name: 'texto', type: 'textarea', required: true },
      ],
    },
    {
      name: 'perguntas',
      label: 'Perguntas frequentes',
      type: 'array',
      labels: { singular: 'Pergunta', plural: 'Perguntas' },
      fields: [
        { name: 'pergunta', type: 'text', required: true },
        { name: 'resposta', type: 'textarea', required: true },
      ],
    },
  ],
}
