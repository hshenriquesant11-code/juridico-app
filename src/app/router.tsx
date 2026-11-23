import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { ComingSoonPage } from "../components/layout/ComingSoonPage";
import { NotFoundPage } from "../components/layout/NotFoundPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { NewLeadPage } from "../features/leads/NewLeadPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: "leads",
        element: (
          <ComingSoonPage
            title="Leads"
            description="Funil de contatos e triagem inicial de potenciais clientes."
          />
        ),
      },
      { path: "leads/novo", element: <NewLeadPage /> },
      {
        path: "clientes",
        element: (
          <ComingSoonPage
            title="Clientes"
            description="Cadastro, busca, histórico de atendimento e documentos vinculados."
            sprint="Sprint 3"
          />
        ),
      },
      {
        path: "casos",
        element: (
          <ComingSoonPage
            title="Casos"
            description="Processos, tipos de benefício, status e histórico de movimentações."
            sprint="Sprint 4"
          />
        ),
      },
      {
        path: "tarefas",
        element: (
          <ComingSoonPage
            title="Tarefas"
            description="Tarefas, prazos e calendário com confirmação humana."
            sprint="Sprint 6"
          />
        ),
      },
      {
        path: "configuracoes",
        element: (
          <ComingSoonPage
            title="Configurações"
            description="Dados do escritório, equipe, permissões e segurança da conta."
            sprint="Sprint 2"
          />
        ),
      },
      {
        path: "ajuda",
        element: (
          <ComingSoonPage
            title="Ajuda"
            description="Central de suporte e documentação de uso."
          />
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];

export const createAppRouter = () => createBrowserRouter(routes);
