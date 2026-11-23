import type { IconName } from "../components/ui/Icon";

export type AvatarTone = "lavender" | "mint" | "peach" | "blue";

export type LeadStatus = "Novo" | "Contatado" | "Qualificado";

export interface StatFootItem {
  text: string;
  className?: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  icon: IconName;
  iconTone: "lavender" | "mint" | "peach" | "blue";
  sparkTone: "purple" | "green" | "orange" | "blue";
  foot: StatFootItem[];
}

export interface DashboardTask {
  title: string;
  person: string;
  time: string;
  tone: AvatarTone;
  initials: string;
}

export interface DashboardLead {
  name: string;
  origin: string;
  benefit: string;
  status: LeadStatus;
  initials: string;
  tone: AvatarTone;
}

export interface DashboardData {
  stats: DashboardStat[];
  tasks: DashboardTask[];
  leads: DashboardLead[];
}
