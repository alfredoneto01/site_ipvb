/**
 * Popula o banco com o conteúdo inicial do site.
 * Uso: pnpm seed
 *
 * Roda no build do Netlify (pnpm run ci) e só preenche um banco novo: se o banco já tem
 * os dados da igreja, sai sem alterar nada.
 * O primeiro administrador usa SEED_ADMIN_EMAIL / SEED_ADMIN_SENHA (variáveis de ambiente).
 */
import config from '@payload-config'
import { getPayload } from 'payload'

const paragrafos = (...textos: string[]) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: textos.map((text) => ({
      type: 'paragraph',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      textFormat: 0,
      children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
    })),
  },
})

const emDias = (dias: number, hora: number) => {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  d.setHours(hora, 0, 0, 0)
  return d.toISOString()
}

const payload = await getPayload({ config })
const log = (msg: string) => payload.logger.info(`[seed] ${msg}`)

// --- Administrador ---
const email = process.env.SEED_ADMIN_EMAIL
const senha = process.env.SEED_ADMIN_SENHA
const { totalDocs: totalUsuarios } = await payload.count({ collection: 'users' })
if (totalUsuarios === 0 && email && senha) {
  await payload.create({ collection: 'users', data: { email, password: senha, nome: 'Administrador', papel: 'admin' } })
  log(`administrador criado: ${email}`)
} else if (totalUsuarios === 0) {
  log('nenhum usuário: crie o primeiro acessando /admin (ou defina SEED_ADMIN_EMAIL e SEED_ADMIN_SENHA)')
}

// O seed roda em todo deploy do Netlify. Se o banco já foi preparado uma vez, não mexe em nada:
// assim, apagar os eventos ou ministérios de exemplo no painel não faz eles voltarem.
const atual = await payload.findGlobal({ slug: 'configuracoes' })
if (atual.endereco) {
  log('banco já preparado anteriormente: nada a fazer')
  process.exit(0)
}

// --- Dados da igreja ---
{
  await payload.updateGlobal({
    slug: 'configuracoes',
    data: {
      horarios: [
        {
          titulo: 'Celebrando a Deus com a Família',
          descricao: 'Domingo · 18h30 · louvor, adoração e exposição da Palavra',
          icone: 'relogio',
        },
        {
          titulo: 'Escola Bíblica Dominical',
          descricao: 'Domingo · 9h30 · classes para todas as idades',
          icone: 'livro',
        },
        {
          titulo: 'Oração e estudo bíblico',
          descricao: 'Quinta-feira · 20h · oração, louvor e estudo bíblico',
          icone: 'pessoas',
        },
      ],
      endereco: 'Rua Almirante Isaías de Noronha, 93',
      bairro: 'Vila Pereira Barreto · São Paulo, SP',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rua+Almirante+Isa%C3%ADas+de+Noronha%2C+93%2C+Vila+Pereira+Barreto%2C+S%C3%A3o+Paulo',
      telefone: '(11) 3991-6771',
      email: 'ipvb10@hotmail.com',
      pix: { tipo: 'CNPJ', chave: '', favorecido: 'Igreja Presbiteriana de Vila Bonilha' },
    },
  })
  log('dados da igreja preenchidos')
}

// --- Página inicial ---
const inicio = await payload.findGlobal({ slug: 'pagina-inicial' })
if (!inicio.hero?.titulo) {
  await payload.updateGlobal({
    slug: 'pagina-inicial',
    data: {
      hero: {
        titulo: 'Uma Igreja acolhedora e comprometida com a Palavra.',
        subtitulo:
          'Somos uma comunidade em Vila Pereira Barreto que se reúne em torno da fiel exposição da Palavra de Deus, para adorar a Cristo, formar nossos filhos na fé e caminhar juntos. Aqui há lugar para você.',
      },
      quemSomos: {
        titulo: 'Uma comunidade acolhedora, firmada na Palavra',
        texto:
          'Queremos ser uma comunidade acolhedora, comprometida com a fiel exposição da Palavra de Deus, contribuindo com as famílias na formação espiritual de seus filhos.\n\nSomos parte da Igreja Presbiteriana do Brasil, herdeira da Reforma do século 16, e uma opção para quem busca um compromisso sério com Jesus Cristo.',
      },
    },
  })
  log('página inicial preenchida')
}

// --- Quem somos ---
const inst = await payload.findGlobal({ slug: 'institucional' })
// Texto do folheto institucional da IPVB.
if (!inst.cremos) {
  await payload.updateGlobal({
    slug: 'institucional',
    data: {
      compromisso:
        'Ser uma comunidade acolhedora, comprometida com a fiel exposição da Palavra de Deus, contribuindo com as famílias na formação espiritual de seus filhos, ser uma opção para aqueles que buscam um compromisso sério com Jesus Cristo.',
      cremos: paragrafos(
        'A Igreja Presbiteriana é herdeira da grande Reforma do século 16, ocorrida na Europa, e é dessa Reforma que herdou seu grande amor à liberdade e sua fidelidade à Palavra de Deus.',
        'A Igreja Presbiteriana aceita a Bíblia como única regra de fé e de prática dada por Deus.',
        'A Igreja Presbiteriana ensina que Jesus Cristo é o único Salvador e que, pela fé, qualquer pessoa pode conhecer a Jesus e crer nele como o seu salvador pessoal.',
        'A Igreja Presbiteriana anuncia que Jesus Cristo é o cabeça da Igreja e também a pedra sobre a qual a igreja é edificada.',
        'A Igreja Presbiteriana aceita e celebra os dois sacramentos instituídos por nosso Senhor Jesus Cristo: o Batismo e a Santa Ceia (Comunhão).',
        'A Igreja Presbiteriana coopera, também, com os que, em obediência à Palavra de Deus, amam o próximo e procuram dar-lhe assistência, praticando toda boa obra para um mundo melhor.',
        'A Igreja Presbiteriana crê e ensina que todos pecaram e carecem da glória de Deus, como afirmou o apóstolo Paulo. Proclama que a salvação é alcançada tão somente pela graça de Deus, que por amor tomou a iniciativa de buscar e salvar o homem pecador.',
      ),
    },
  })
  log('página "Quem somos" preenchida')
}

// --- Primeira visita ---
const pv = await payload.findGlobal({ slug: 'primeira-visita' })
if (!pv.passos?.length) {
  await payload.updateGlobal({
    slug: 'primeira-visita',
    data: {
      passos: [
        { titulo: 'Chegada', texto: 'A recepção te recebe na porta e ajuda a encontrar um lugar.' },
        {
          titulo: 'Escola Bíblica',
          texto: 'Domingo às 9h30, com classes, material e professores preparados para todas as idades.',
        },
        {
          titulo: 'O culto',
          texto: 'Domingo às 18h30: "Celebrando a Deus com a Família", com louvor, adoração e exposição da Palavra.',
        },
        { titulo: 'Depois', texto: 'Fique um pouco mais e conheça o pastor e a comunidade.' },
      ],
      perguntas: [
        { pergunta: 'Preciso ir de roupa social?', resposta: 'Não. Venha como se sentir confortável.' },
        {
          pergunta: 'Tem atividade para as crianças?',
          resposta: 'Sim. A Escola Bíblica Dominical, aos domingos às 9h30, tem classes com material e professores preparados para cada idade.',
        },
        {
          pergunta: 'Posso conversar com o pastor?',
          resposta: 'Claro. Para visita pastoral ou aconselhamento espiritual, ligue (11) 3991-6771. Teremos prazer em atendê-lo.',
        },
        { pergunta: 'Onde estacionar?', resposta: '[Informe se há estacionamento na rua ou convênio próximo.]' },
        { pergunta: 'Vou ser chamado à frente?', resposta: 'Não. Você pode simplesmente participar e conhecer a igreja no seu ritmo.' },
      ],
    },
  })
  log('página "Primeira visita" preenchida')
}

// --- Ministérios ---
const { totalDocs: totalMinisterios } = await payload.count({ collection: 'ministerios' })
if (totalMinisterios === 0) {
  const ministerios = [
    { nome: 'Crianças', resumo: 'Classes por idade e berçário durante o culto.', cor: 'laranja' as const },
    { nome: 'Jovens e adolescentes', resumo: 'Encontros semanais, estudo e amizade.', cor: 'azul' as const },
    { nome: 'Casais e famílias', resumo: 'Apoio e comunhão para o lar.', cor: 'verde' as const },
    { nome: 'Ação social', resumo: 'Servindo o bairro com amor prático.', cor: 'laranja' as const },
  ]
  for (const [ordem, m] of ministerios.entries()) {
    await payload.create({ collection: 'ministerios', data: { ...m, ordem } })
  }
  log(`${ministerios.length} ministérios criados`)
}

// --- Agenda de exemplo ---
const { totalDocs: totalEventos } = await payload.count({ collection: 'eventos' })
if (totalEventos === 0) {
  const eventos = [
    { titulo: '[Exemplo] Culto de Santa Ceia', data: emDias(5, 10) },
    { titulo: '[Exemplo] Encontro de jovens', data: emDias(11, 19) },
    { titulo: '[Exemplo] Estudo bíblico', data: emDias(15, 20) },
  ]
  for (const ev of eventos) {
    await payload.create({ collection: 'eventos', data: { ...ev, _status: 'published' } })
  }
  log('eventos de exemplo criados (apague-os no painel quando cadastrar os reais)')
}

log('pronto!')
process.exit(0)
