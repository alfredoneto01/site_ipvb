'use client'

import { useActionState } from 'react'

import { enviarContato, enviarPedidoOracao, enviarVisita, type EstadoFormulario } from '@/app/(frontend)/actions'
import { OPCOES_VISITA } from '@/lib/visita'

function Honeypot() {
  return (
    <div className="honeypot" aria-hidden="true">
      <label>
        Não preencha
        <input type="text" name="site" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  )
}

function Retorno({ estado }: { estado: EstadoFormulario }) {
  if (!estado) return null
  return (
    <p role="status" className={`form__retorno ${estado.ok ? 'is-ok' : 'is-erro'}`}>
      {estado.mensagem}
    </p>
  )
}

export function FormVisita() {
  const [estado, acao, enviando] = useActionState(enviarVisita, null)

  if (estado?.ok) return <Retorno estado={estado} />

  return (
    <form action={acao} className="form">
      <Honeypot />
      <label>
        Seu nome
        <input name="nome" type="text" required autoComplete="name" placeholder="Como podemos te chamar?" />
      </label>
      <label>
        WhatsApp
        <input name="whatsapp" type="tel" required autoComplete="tel" placeholder="(11) 00000-0000" />
      </label>
      <label>
        Quando?
        <select name="quando" defaultValue="culto">
          {OPCOES_VISITA.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Quantas pessoas?
        <input name="pessoas" type="number" min={1} max={30} defaultValue={1} />
      </label>
      <label className="form__check">
        <input name="criancas" type="checkbox" />
        Vou levar crianças
      </label>
      <Retorno estado={estado} />
      <button type="submit" className="botao botao--destaque" disabled={enviando}>
        {enviando ? 'Enviando…' : 'Avisar que vou'}
      </button>
    </form>
  )
}

export function FormOracao() {
  const [estado, acao, enviando] = useActionState(enviarPedidoOracao, null)

  if (estado?.ok) return <Retorno estado={estado} />

  return (
    <form action={acao} className="form">
      <Honeypot />
      <label>
        Nome <span className="form__opcional">(opcional)</span>
        <input name="nome" type="text" autoComplete="name" />
      </label>
      <label>
        Contato <span className="form__opcional">(opcional, se quiser retorno)</span>
        <input name="contato" type="text" placeholder="WhatsApp ou e-mail" />
      </label>
      <label>
        Seu pedido
        <textarea name="pedido" rows={4} required />
      </label>
      <p className="form__nota">Somente os pastores têm acesso aos pedidos.</p>
      <Retorno estado={estado} />
      <button type="submit" className="botao botao--escuro" disabled={enviando}>
        {enviando ? 'Enviando…' : 'Enviar pedido'}
      </button>
    </form>
  )
}

export function FormContato() {
  const [estado, acao, enviando] = useActionState(enviarContato, null)

  if (estado?.ok) return <Retorno estado={estado} />

  return (
    <form action={acao} className="form">
      <Honeypot />
      <label>
        Nome
        <input name="nome" type="text" required autoComplete="name" />
      </label>
      <label>
        E-mail ou WhatsApp
        <input name="email" type="text" required />
      </label>
      <label>
        Mensagem
        <textarea name="mensagem" rows={5} required />
      </label>
      <Retorno estado={estado} />
      <button type="submit" className="botao botao--escuro" disabled={enviando}>
        {enviando ? 'Enviando…' : 'Enviar mensagem'}
      </button>
    </form>
  )
}
