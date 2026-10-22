import type { GlobalConfig } from 'payload'

import { permitir } from '../access/roles'

export const Institucional: GlobalConfig = {
  slug: 'institucional',
  label: 'Quem somos',
  admin: { group: 'Páginas' },
  access: {
    read: () => true,
    update: permitir('pastor'),
  },
  fields: [
    {
      name: 'compromisso',
      label: 'Nosso compromisso',
      type: 'textarea',
      admin: { description: 'Frase de missão exibida em destaque no topo da página.' },
    },
    {
      name: 'historia',
      label: 'Nossa história',
      type: 'richText',
      admin: { description: 'Opcional. A seção só aparece no site quando houver texto.' },
    },
    { name: 'cremos', label: 'No que cremos', type: 'richText' },
    { name: 'imagem', label: 'Foto da página', type: 'upload', relationTo: 'media' },
  ],
}
