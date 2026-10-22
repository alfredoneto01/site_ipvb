'use server'

import { OPCOES_VISITA, type OpcaoVisita } from '@/lib/visita'
import { getPayloadClient } from '@/lib/payload'

export type EstadoFormulario = { ok: boolean; mensagem: string } | null

const texto = (form: FormData, campo: string, max = 500) => String(form.get(campo) ?? '').trim().slice(0, max)

// Campo invisível: pessoas não preenchem, robôs costumam preencher.
const ehRobo = (form: FormData) => texto(form, 'site') !== ''

const erro = (mensagem: string): EstadoFormulario => ({ ok: false, mensagem })

export async function enviarVisita(_: EstadoFormulario, form: FormData): Promise<EstadoFormulario> {
  if (ehRobo(form)) return { ok: true, mensagem: 'Recebemos seu aviso!' }

  const nome = texto(form, 'nome', 120)
  const whatsapp = texto(form, 'whatsapp', 30)
  const escolha = texto(form, 'quando')
  const quando: OpcaoVisita = OPCOES_VISITA.find((o) => o.value === escolha)?.value ?? 'culto'
  const pessoas = Math.min(Math.max(Number(form.get('pessoas')) || 1, 1), 30)

  if (!nome || whatsapp.replace(/\D/g, '').length < 10) {
    return erro('Preencha seu nome e um WhatsApp com DDD.')
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'visitantes',
      data: {
        nome,
        whatsapp,
        quando,
        pessoas,
        criancas: form.get('criancas') === 'on',
        mensagem: texto(form, 'mensagem', 1000),
      },
    })
    return { ok: true, mensagem: `Obrigado, ${nome.split(' ')[0]}! Vamos te esperar na porta.` }
  } catch {
    return erro('Não conseguimos enviar agora. Tente de novo ou chame no WhatsApp.')
  }
}

export async function enviarPedidoOracao(_: EstadoFormulario, form: FormData): Promise<EstadoFormulario> {
  if (ehRobo(form)) return { ok: true, mensagem: 'Pedido recebido.' }

  const pedido = texto(form, 'pedido', 2000)
  if (pedido.length < 3) return erro('Escreva seu pedido de oração.')

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'pedidos-oracao',
      data: { nome: texto(form, 'nome', 120), contato: texto(form, 'contato', 120), pedido },
    })
    return { ok: true, mensagem: 'Pedido recebido. Os pastores vão orar por você.' }
  } catch {
    return erro('Não conseguimos enviar agora. Tente de novo em instantes.')
  }
}

export async function enviarContato(_: EstadoFormulario, form: FormData): Promise<EstadoFormulario> {
  if (ehRobo(form)) return { ok: true, mensagem: 'Mensagem enviada.' }

  const nome = texto(form, 'nome', 120)
  const email = texto(form, 'email', 120)
  const mensagem = texto(form, 'mensagem', 2000)
  if (!nome || !email || !mensagem) return erro('Preencha todos os campos.')

  try {
    const payload = await getPayloadClient()
    await payload.create({ collection: 'contatos', data: { nome, email, mensagem } })
    return { ok: true, mensagem: 'Mensagem enviada! Responderemos em breve.' }
  } catch {
    return erro('Não conseguimos enviar agora. Tente de novo em instantes.')
  }
}
