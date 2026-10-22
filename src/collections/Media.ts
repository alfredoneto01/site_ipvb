import type { CollectionConfig } from 'payload'

import { logado, publico } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagem', plural: 'Imagens' },
  admin: { group: 'Conteúdo' },
  access: {
    read: publico,
    create: logado,
    update: logado,
    delete: logado,
  },
  fields: [
    {
      name: 'alt',
      label: 'Descrição da imagem',
      type: 'text',
      required: true,
      admin: { description: 'Descreva a foto para quem usa leitor de tela. Ex.: "Crianças na Escola Dominical".' },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, height: undefined, position: 'centre' },
    ],
  },
}
