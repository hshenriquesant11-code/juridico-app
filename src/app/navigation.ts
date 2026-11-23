import type { IconName } from "../components/ui/Icon";

export interface NavItem {
  label: string;
  path: string;
  icon: IconName;
}

export const navItems: NavItem[] = [
  { label: "Visão geral", path: "/", icon: "overview" },
  { label: "Leads", path: "/leads", icon: "leads" },
  { label: "Clientes", path: "/clientes", icon: "clients" },
  { label: "Casos", path: "/casos", icon: "cases" },
  { label: "Tarefas", path: "/tarefas", icon: "tasks" },
];

const extraTitles: Record<string, string> = {
  "/leads/novo": "Novo lead",
  "/configuracoes": "Configurações",
  "/ajuda": "Ajuda",
};

export function getPageTitle(pathname: string): string {
  const normalized =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const fromNav = navItems.find((item) => item.path === normalized);
  return fromNav?.label ?? extraTitles[normalized] ?? "Página não encontrada";
}
