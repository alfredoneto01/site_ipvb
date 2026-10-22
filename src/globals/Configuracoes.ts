import type { GlobalConfig } from 'payload'

import { permitir } from '../access/roles'

export const Configuracoes: GlobalConfig = {
  slug: 'configuracoes',
  label: 'Dados da igreja',
  typescript: { interface: 'Configuracoes' },
  admin: {
    group: 'Configurações',
    description: 'Horários, endereço, contatos e PIX usados em todo o site.',
  },
  access: {
    read: () => true,
    update: permitir('pastor', 'secretaria'),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Cultos',
          fields: [
            {
              name: 'horarios',
              label: 'Horários fixos',
              type: 'array',
              labels: { singular: 'Horário', plural: 'Horários' },
              admin: { description: 'Os três primeiros aparecem nos cartões da página inicial.' },
              fields: [
                { name: 'titulo', label: 'Título', type: 'text', required: true },
                { name: 'descricao', label: 'Dia e horário', type: 'text', required: true },
                {
                  name: 'icone',
                  label: 'Ícone',
                  type: 'select',
                  defaultValue: 'relogio',
                  options: [
                    { label: 'Relógio', value: 'relogio' },
                    { label: 'Livro', value: 'livro' },
                    { label: 'Pessoas', value: 'pessoas' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Endereço e contato',
          fields: [
            { name: 'endereco', label: 'Endereço', type: 'text', required: true },
            { name: 'bairro', label: 'Bairro e cidade', type: 'text', required: true },
            { name: 'mapsUrl', label: 'Link do Google Maps', type: 'text' },
            { name: 'whatsapp', label: 'WhatsApp (só números, com DDD)', type: 'text', admin: { description: 'Ex.: 5511999999999' } },
            { name: 'telefone', type: 'text' },
            { name: 'email', label: 'E-mail', type: 'email' },
          ],
        },
        {
          label: 'Redes sociais',
          fields: [
            { name: 'instagram', label: 'Instagram (link)', type: 'text' },
            { name: 'youtube', label: 'YouTube (link do canal)', type: 'text' },
            { name: 'spotify', label: 'Spotify (link do podcast)', type: 'text' },
            { name: 'facebook', label: 'Facebook (link)', type: 'text' },
          ],
        },
        {
          label: 'Contribuição',
          fields: [
            {
              name: 'pix',
              type: 'group',
              label: 'PIX',
              fields: [
                { name: 'tipo', label: 'Tipo da chave', type: 'text', admin: { description: 'Ex.: CNPJ, e-mail' } },
                { name: 'chave', type: 'text' },
                { name: 'favorecido', type: 'text' },
                { name: 'qrcode', label: 'QR Code', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'dadosBancarios',
              label: 'Dados bancários (opcional)',
              type: 'textarea',
            },
          ],
        },
      ],
    },
  ],
}
