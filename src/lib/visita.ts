// Compartilhado entre a coleção Visitantes (painel) e o formulário do site.
export const OPCOES_VISITA = [
  { label: 'Escola Bíblica Dominical (domingo, 9h30)', value: 'ebd' },
  { label: 'Celebrando a Deus com a Família (domingo, 18h30)', value: 'culto' },
  { label: 'Oração e estudo bíblico (quinta, 20h)', value: 'quinta' },
] as const

export type OpcaoVisita = (typeof OPCOES_VISITA)[number]['value']
