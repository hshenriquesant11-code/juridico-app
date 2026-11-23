import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderApp } from "./renderApp";

describe("Rotas", () => {
  it.each([
    ["/leads", "Leads"],
    ["/clientes", "Clientes"],
    ["/casos", "Casos"],
    ["/tarefas", "Tarefas"],
    ["/configuracoes", "Configurações"],
    ["/ajuda", "Ajuda"],
  ])("%s abre a página '%s' marcada como não implementada", (path, title) => {
    renderApp(path);

    expect(
      screen.getByRole("heading", { level: 1, name: title }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Ainda não implementado/)).toBeInTheDocument();
    expect(
      screen.getByText(title, { selector: ".breadcrumb strong" }),
    ).toBeInTheDocument();
  });

  it("mantém o menu lateral em qualquer rota (link direto)", () => {
    renderApp("/casos");

    const nav = screen.getByRole("navigation", { name: "Navegação principal" });
    expect(within(nav).getByRole("link", { name: "Casos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("mostra 'Página não encontrada' para endereços inexistentes", () => {
    renderApp("/isso-nao-existe");

    expect(
      screen.getByRole("heading", { level: 1, name: "Página não encontrada" }),
    ).toBeInTheDocument();
  });

  it("o botão 'Novo cadastro' leva ao formulário de novo lead", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await user.click(screen.getByRole("link", { name: /Novo cadastro/ }));

    expect(
      screen.getByRole("heading", { level: 1, name: "Novo lead" }),
    ).toBeInTheDocument();
  });

  it("'Ver todas' das tarefas leva à rota de tarefas", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await user.click(await screen.findByRole("link", { name: /Ver todas/ }));

    expect(
      screen.getByRole("heading", { level: 1, name: "Tarefas" }),
    ).toBeInTheDocument();
  });
});
