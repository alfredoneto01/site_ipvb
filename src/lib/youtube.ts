export type Video = {
  id: string
  titulo: string
  publicadoEm: string
  thumbnail: string
}

const decodificar = (texto: string) =>
  texto
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

/**
 * Lê o feed RSS público do canal (não precisa de chave de API).
 * Retorna os 15 vídeos mais recentes; atualiza a cada hora.
 */
export async function getVideosDoCanal(): Promise<Video[]> {
  const canal = process.env.YOUTUBE_CHANNEL_ID
  if (!canal) return []

  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(canal)}`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const xml = await res.text()

    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, entrada]) => {
      const id = entrada.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
      const titulo = entrada.match(/<title>([^<]*)<\/title>/)?.[1]
      const publicadoEm = entrada.match(/<published>([^<]+)<\/published>/)?.[1]
      if (!id || !titulo || !publicadoEm) return []
      return [{ id, titulo: decodificar(titulo), publicadoEm, thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` }]
    })
  } catch {
    return []
  }
}
