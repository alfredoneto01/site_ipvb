const fuso = 'America/Sao_Paulo'

export const dia = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', timeZone: fuso }).format(new Date(iso))

export const mesCurto = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: fuso }).format(new Date(iso)).replace('.', '')

export const diaDaSemanaEHora = (iso: string) => {
  const d = new Date(iso)
  const semana = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: fuso }).format(d)
  const hora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: fuso }).format(d)
  return `${semana.charAt(0).toUpperCase()}${semana.slice(1)} · ${hora.replace(':', 'h')}`
}

export const dataLonga = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: fuso }).format(new Date(iso))

export const mesEAno = (iso: string) => {
  const t = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: fuso }).format(new Date(iso))
  return t.charAt(0).toUpperCase() + t.slice(1)
}

export const linkWhatsapp = (numero?: string | null, texto?: string) => {
  if (!numero) return null
  const n = numero.replace(/\D/g, '')
  return `https://wa.me/${n}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`
}
