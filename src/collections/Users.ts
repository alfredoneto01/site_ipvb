import type { CollectionConfig } from 'payload'

import { apenasAdmin, campoApenasAdmin, PAPEIS, temPapel } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuário', plural: 'Usuários' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'email', 'papel'],
    group: 'Configurações',
  },
  auth: true,
  access: {
    // Cada um vê e edita o próprio cadastro; só o administrador gerencia os demais.
    read: ({ req }) => (temPapel(req) ? true : { id: { equals: req.user?.id } }),
    update: ({ req }) => (temPapel(req) ? true : { id: { equals: req.user?.id } }),
    create: apenasAdmin,
    delete: apenasAdmin,
  },
  hooks: {
    beforeChange: [
      // O primeiro cadastro (tela "criar primeiro usuário" do painel) vira administrador.
      async ({ operation, data, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        return totalDocs === 0 ? { ...data, papel: 'admin' } : data
      },
    ],
  },
  fields: [
    { name: 'nome', type: 'text', required: true },
    {
      name: 'papel',
      type: 'select',
      required: true,
      defaultValue: 'secretaria',
      options: [...PAPEIS],
      access: { update: campoApenasAdmin, create: campoApenasAdmin },
      admin: {
        description:
          'Administrador: tudo. Pastor: conteúdo, visitantes e pedidos de oração. Secretaria: agenda, avisos e visitantes. Mídia: fotos, avisos e ministérios.',
      },
    },
  ],
}
