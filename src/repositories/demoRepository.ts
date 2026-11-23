import type { DashboardData } from "../types/dashboard";

/**
 * Camada de dados do MODO DEMONSTRAÇÃO.
 *
 * Todos os registros abaixo são fictícios. Na Sprint 2 este módulo será
 * substituído por um repositório que consulta o Supabase (com RLS); as telas
 * dependem apenas da assinatura de `getDashboardData`.
 */
const demoDashboard: DashboardData = {
  stats: [
    {
      label: "Leads ativos",
      value: "24",
      icon: "leads",
      iconTone: "lavender",
      sparkTone: "purple",
      foot: [
        { className: "trend-up", text: "↗ 12%" },
        { text: "vs. mês passado" },
      ],
    },
    {
      label: "Clientes",
      value: "68",
      icon: "clients",
      iconTone: "mint",
      sparkTone: "green",
      foot: [
        { className: "trend-up", text: "↗ 8%" },
        { text: "vs. mês passado" },
      ],
    },
    {
      label: "Casos em andamento",
      value: "42",
      icon: "cases",
      iconTone: "peach",
      sparkTone: "orange",
      foot: [
        { className: "neutral-change", text: "—" },
        { text: "sem alteração" },
      ],
    },
    {
      label: "Tarefas abertas",
      value: "09",
      icon: "tasks",
      iconTone: "blue",
      sparkTone: "blue",
      foot: [
        { className: "urgent-note", text: "03 para hoje" },
        { text: "·" },
        { text: "2 atrasadas" },
      ],
    },
  ],
  tasks: [
    {
      title: "Retornar contato para Mariana",
      person: "Mariana Oliveira · Lead",
      time: "Hoje, 10:30",
      tone: "lavender",
      initials: "MO",
    },
    {
      title: "Revisar documentação inicial",
      person: "Carlos Mendes · BPC/LOAS",
      time: "Hoje, 14:00",
      tone: "mint",
      initials: "CM",
    },
    {
      title: "Agendar conversa de triagem",
      person: "Fernanda Costa · Lead",
      time: "Amanhã, 09:00",
      tone: "peach",
      initials: "FC",
    },
  ],
  leads: [
    {
      name: "Mariana Oliveira",
      origin: "Indicação",
      benefit: "Aposentadoria por idade",
      status: "Novo",
      initials: "MO",
      tone: "lavender",
    },
    {
      name: "João Pedro Santos",
      origin: "Site",
      benefit: "Benefício por incapacidade",
      status: "Contatado",
      initials: "JS",
      tone: "blue",
    },
    {
      name: "Fernanda Costa",
      origin: "Instagram",
      benefit: "BPC/LOAS",
      status: "Qualificado",
      initials: "FC",
      tone: "peach",
    },
  ],
};

export async function getDashboardData(): Promise<DashboardData> {
  return structuredClone(demoDashboard);
}
