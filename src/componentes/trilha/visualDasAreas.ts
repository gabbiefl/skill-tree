import type { NomeIcone } from '../Icones'

// Identidade visual das áreas: qual ícone cada uma usa. As cores ficam no CSS (estilos/areas.css),
// ligadas pelo atributo data-area, porque são decisão de aparência e não regra do domínio.
const ICONE_DA_AREA: Record<string, NomeIcone> = {
  fundamentos: 'camadas',
  html: 'codigo',
  css: 'gota',
  javascript: 'chaves',
  ferramentas: 'terminal',
  qualidade: 'escudo',
  react: 'atomo',
}

export function iconeDaArea(idDaArea: string): NomeIcone {
  return ICONE_DA_AREA[idDaArea] ?? 'camadas'
}

// Nível 1 (Semente) a 5 (Árvore).
const ICONE_DO_NIVEL: readonly NomeIcone[] = ['semente', 'broto', 'muda', 'galho', 'arvore']

export function iconeDoNivel(numero: number): NomeIcone {
  return ICONE_DO_NIVEL[Math.min(Math.max(numero, 1), ICONE_DO_NIVEL.length) - 1]
}
