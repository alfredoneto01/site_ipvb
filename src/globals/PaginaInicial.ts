import type { GlobalConfig } from 'payload'

import { permitir } from '../access/roles'

export const PaginaInicial: GlobalConfig = {
  slug: 'pagina-inicial',
  label: 'Página inicial',
  admin: { group: 'Páginas' },
  access: {
    read: () => true,
    update: permitir('pastor', 'midia'),
  },
  fields: [
    {
      name: 'hero',
      label: 'Topo (foto grande)',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título', type: 'text', required: true },
        { name: 'subtitulo', label: 'Subtítulo', type: 'textarea' },
        {
          name: 'imagem',
          label: 'Foto de fundo',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Use uma foto horizontal, de preferência com pessoas. Ela fica escurecida para o texto aparecer.' },
        },
      ],
    },
    {
      name: 'quemSomos',
      label: 'Bloco "Quem somos"',
      type: 'group',
      fields: [
        { name: 'titulo', label: 'Título', type: 'text' },
        { name: 'texto', type: 'textarea' },
        { name: 'imagem', label: 'Foto', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
