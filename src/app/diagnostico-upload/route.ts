// TEMPORÁRIO: diagnóstico do envio de imagens no Netlify. Remover depois de resolver.
import { UTApi } from 'uploadthing/server'

export const dynamic = 'force-dynamic'

const mensagem = (e: unknown) => (e instanceof Error ? `${e.name}: ${e.message}` : String(e))

export async function GET() {
  const resultado: Record<string, unknown> = {
    node: process.version,
    plataforma: `${process.platform}-${process.arch}`,
    tokenDefinido: Boolean(process.env.UPLOADTHING_TOKEN),
  }

  try {
    const sharp = (await import('sharp')).default
    const png = await sharp({ create: { width: 20, height: 10, channels: 3, background: '#3b6150' } })
      .png()
      .toBuffer()
    const recorte = await sharp(png).extract({ left: 0, top: 0, width: 10, height: 10 }).jpeg().toBuffer()
    resultado.sharp = { ok: true, versao: sharp.versions, bytesRecorte: recorte.length }
  } catch (e) {
    resultado.sharp = { ok: false, erro: mensagem(e) }
  }

  try {
    const ut = new UTApi({ token: process.env.UPLOADTHING_TOKEN })
    const { files } = await ut.listFiles({ limit: 3 })
    resultado.uploadthing = { ok: true, arquivos: files.map((f) => ({ nome: f.name, status: f.status })) }
  } catch (e) {
    resultado.uploadthing = { ok: false, erro: mensagem(e) }
  }

  // Fluxo completo do Payload: envio ao Uploadthing, versões com sharp e gravação no banco.
  try {
    const { getPayload } = await import('payload')
    const config = (await import('@payload-config')).default
    const payload = await getPayload({ config })
    const sharp = (await import('sharp')).default
    const imagem = await sharp({ create: { width: 1000, height: 700, channels: 3, background: '#f08a30' } })
      .jpeg()
      .toBuffer()
    const doc = await payload.create({
      collection: 'media',
      data: { alt: 'diagnóstico (apagar)' },
      file: { data: imagem, mimetype: 'image/jpeg', name: `diagnostico-${Date.now()}.jpg`, size: imagem.length },
    })
    resultado.criacao = { ok: true, id: doc.id, url: doc.url, card: doc.sizes?.card?.url }
    await payload.delete({ collection: 'media', id: doc.id })
    resultado.limpeza = 'imagem de teste apagada'
  } catch (e) {
    const err = e as Error & { cause?: unknown; data?: unknown }
    resultado.criacao = {
      ok: false,
      erro: mensagem(e),
      causa: err.cause ? mensagem(err.cause) : undefined,
      dados: err.data,
      pilha: err.stack?.split('\n').slice(0, 8),
    }
  }

  return Response.json(resultado)
}
