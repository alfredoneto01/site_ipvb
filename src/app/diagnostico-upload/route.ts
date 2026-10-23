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

  return Response.json(resultado)
}
