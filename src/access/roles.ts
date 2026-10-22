import type { Access, FieldAccess, PayloadRequest } from 'payload'

export const PAPEIS = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Pastor', value: 'pastor' },
  { label: 'Secretaria', value: 'secretaria' },
  { label: 'Mídia', value: 'midia' },
] as const

export type Papel = (typeof PAPEIS)[number]['value']

export const temPapel = (req: PayloadRequest, ...papeis: Papel[]): boolean => {
  const user = req.user as { papel?: Papel } | null
  if (!user?.papel) return false
  return user.papel === 'admin' || papeis.includes(user.papel)
}

export const publico: Access = () => true

export const logado: Access = ({ req }) => Boolean(req.user)

export const apenasAdmin: Access = ({ req }) => temPapel(req)

export const permitir =
  (...papeis: Papel[]): Access =>
  ({ req }) =>
    temPapel(req, ...papeis)

export const campoApenasAdmin: FieldAccess = ({ req }) => temPapel(req)
