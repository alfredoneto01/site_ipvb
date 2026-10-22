import type { CollectionConfig } from 'payload'

import { permitir } from '../access/roles'

export const Ministerios: CollectionConfig = {
  slug: 'ministerios',
  labels: { singular: 'Ministério', plural: 'Ministérios' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'ordem'],
    group: 'Conteúdo',
  },
  defaultSort: 'ordem',
  access: {
    read: () => true,
    create: permitir('pastor', 'midia'),
    update: permitir('pastor', 'midia'),
    delete: permitir('pastor'),
  },
  fields: [
    { name: 'nome', type: 'text', required: true },
    {
      name: 'resumo',
      type: 'text',
      required: true,
      admin: { description: 'Uma frase curta para o cartão da página inicial.' },
    },
    { name: 'descricao', label: 'Descrição completa', type: 'richText' },
    { name: 'quando', type: 'text', admin: { description: 'Ex.: Sábados às 19h' } },
    { name: 'responsavel', label: 'Responsável', type: 'text' },
    { name: 'imagem', type: 'upload', relationTo: 'media' },
    {
      name: 'cor',
      type: 'select',
      defaultValue: 'laranja',
      options: [
        { label: 'Laranja', value: 'laranja' },
        { label: 'Azul', value: 'azul' },
        { label: 'Verde', value: 'verde' },
      ],
      admin: { position: 'sidebar', description: 'Cor de fundo quando não há foto.' },
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Menor aparece primeiro.' },
    },
  ],
}
