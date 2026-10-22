import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import { pt } from '@payloadcms/translations/languages/pt'
import path from 'path'
import { buildConfig, type CollectionConfig, type GlobalConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Avisos } from './collections/Avisos'
import { Contatos } from './collections/Contatos'
import { Eventos } from './collections/Eventos'
import { Lideranca } from './collections/Lideranca'
import { Media } from './collections/Media'
import { Ministerios } from './collections/Ministerios'
import { PedidosOracao } from './collections/PedidosOracao'
import { Users } from './collections/Users'
import { Visitantes } from './collections/Visitantes'
import { Configuracoes } from './globals/Configuracoes'
import { Institucional } from './globals/Institucional'
import { PaginaInicial } from './globals/PaginaInicial'
import { PrimeiraVisita } from './globals/PrimeiraVisita'
import { revalidarAposExcluir, revalidarAposSalvar, revalidarGlobal } from './hooks/revalidarSite'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Conteúdo exibido no site público: ao salvar no painel, a página é regenerada.
const comRevalidacao = (c: CollectionConfig): CollectionConfig => ({
  ...c,
  hooks: {
    ...c.hooks,
    afterChange: [...(c.hooks?.afterChange ?? []), revalidarAposSalvar],
    afterDelete: [...(c.hooks?.afterDelete ?? []), revalidarAposExcluir],
  },
})

const globalComRevalidacao = (g: GlobalConfig): GlobalConfig => ({
  ...g,
  hooks: { ...g.hooks, afterChange: [...(g.hooks?.afterChange ?? []), revalidarGlobal] },
})

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' · Painel IPVB',
      icons: [{ rel: 'icon', type: 'image/png', url: '/logo-ipvb.png' }],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    supportedLanguages: { pt },
    fallbackLanguage: 'pt',
  },
  collections: [
    ...[Eventos, Avisos, Ministerios, Lideranca, Media].map(comRevalidacao),
    Visitantes,
    PedidosOracao,
    Contatos,
    Users,
  ],
  globals: [PaginaInicial, Institucional, PrimeiraVisita, Configuracoes].map(globalComRevalidacao),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      // VPS: Postgres do próprio servidor. Netlify (teste): o Netlify Database injeta
      // NETLIFY_DB_URL (nome atual) ou NETLIFY_DATABASE_URL (nome antigo) sozinho.
      connectionString:
        process.env.DATABASE_URL || process.env.NETLIFY_DB_URL || process.env.NETLIFY_DATABASE_URL || '',
      // Funções serverless abrem muitas instâncias; poucas conexões por instância evitam esgotar o banco.
      max: process.env.NETLIFY ? 2 : 10,
    },
    // O esquema muda só por migração (pnpm payload migrate), nunca automaticamente.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    // Em produção (Netlify) o disco não é persistente: as fotos vão para o Uploadthing.
    // Sem o token (desenvolvimento local), continuam na pasta /media.
    uploadthingStorage({
      enabled: Boolean(process.env.UPLOADTHING_TOKEN),
      alwaysInsertFields: true,
      // Envio direto do navegador, sem passar pelo limite de 6 MB das funções do Netlify.
      clientUploads: true,
      collections: { media: true },
      options: { token: process.env.UPLOADTHING_TOKEN, acl: 'public-read' },
    }),
  ],
})
