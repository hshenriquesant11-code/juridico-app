import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderApp } from "./renderApp";

function getSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) throw new Error("Menu lateral (#sidebar) não encontrado");
  return sidebar;
}

function getNav() {
  return screen.getByRole("navigation", { name: "Navegação principal" });
}

describe("Visão geral — conteúdo de demonstração", () => {
  it("exibe o aviso de que todos os dados são fictícios", () => {
    renderApp("/clientes");

    expect(screen.getByRole("status")).toHaveTextContent(
      /registros são fictícios/i,
    );
  });

  it("mostra o estado de carregamento antes dos dados chegarem", async () => {
    renderApp("/");

    expect(screen.getByText("Carregando painel…")).toBeInTheDocument();
    expect(
      await screen.findByRole("region", { name: "Resumo do escritório" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Carregando painel…")).not.toBeInTheDocument();
  });

  it("mostra os quatro indicadores do escritório", async () => {
    renderApp("/");

    const resumo = await screen.findByRole("region", {
      name: "Resumo do escritório",
    });

    for (const label of [
      "Leads ativos",
      "Clientes",
      "Casos em andamento",
      "Tarefas abertas",
    ]) {
      expect(within(resumo).getByText(label)).toBeInTheDocument();
    }
  });

  it("lista os leads recentes em uma tabela com cabeçalho e três linhas", async () => {
    renderApp("/");

    const tabela = await screen.findByRole("table");

    expect(within(tabela).getAllByRole("row")).toHaveLength(4);
    for (const nome of [
      "Mariana Oliveira",
      "João Pedro Santos",
      "Fernanda Costa",
    ]) {
      expect(within(tabela).getByText(nome)).toBeInTheDocument();
    }
    for (const status of ["Novo", "Contatado", "Qualificado"]) {
      expect(within(tabela).getByText(status)).toBeInTheDocument();
    }
  });

  it("lista as tarefas com um botão de concluir acessível por tarefa", async () => {
    renderApp("/");

    expect(
      await screen.findAllByRole("button", { name: /^Concluir:/ }),
    ).toHaveLength(3);
    expect(
      screen.getByRole("button", {
        name: "Concluir: Revisar documentação inicial",
      }),
    ).toBeInTheDocument();
  });
});

describe("Navegação lateral", () => {
  it("marca 'Visão geral' como página atual ao iniciar", () => {
    renderApp("/");

    expect(
      within(getNav()).getByRole("link", { name: "Visão geral" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(getNav()).getByRole("link", { name: "Leads" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("muda a página, o item atual e o breadcrumb ao clicar em um item", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await user.click(within(getNav()).getByRole("link", { name: "Clientes" }));

    expect(
      screen.getByRole("heading", { level: 1, name: "Clientes" }),
    ).toBeInTheDocument();
    expect(
      within(getNav()).getByRole("link", { name: "Clientes" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(getNav()).getByRole("link", { name: "Visão geral" }),
    ).not.toHaveAttribute("aria-current");
    expect(
      screen.getByText("Clientes", { selector: ".breadcrumb strong" }),
    ).toBeInTheDocument();
  });
});

describe("Menu responsivo", () => {
  it("abre e fecha o menu, refletindo o estado em aria-expanded", async () => {
    const user = userEvent.setup();
    renderApp("/clientes");

    const abrir = screen.getByRole("button", { name: "Abrir menu" });
    expect(abrir).toHaveAttribute("aria-expanded", "false");
    expect(abrir).toHaveAttribute("aria-controls", "sidebar");
    expect(getSidebar()).not.toHaveClass("sidebar-open");

    await user.click(abrir);

    expect(abrir).toHaveAttribute("aria-expanded", "true");
    expect(getSidebar()).toHaveClass("sidebar-open");

    // Existem dois controles "Fechar menu": o véu escuro e o botão do menu.
    const fechar = screen.getAllByRole("button", { name: "Fechar menu" });
    expect(fechar).toHaveLength(2);

    await user.click(fechar[0]);

    expect(abrir).toHaveAttribute("aria-expanded", "false");
    expect(getSidebar()).not.toHaveClass("sidebar-open");
  });

  it("fecha o menu aberto ao pressionar Escape", async () => {
    const user = userEvent.setup();
    renderApp("/clientes");

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    expect(getSidebar()).toHaveClass("sidebar-open");

    await user.keyboard("{Escape}");

    expect(getSidebar()).not.toHaveClass("sidebar-open");
    expect(screen.getByRole("button", { name: "Abrir menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("fecha o menu ao escolher um item de navegação", async () => {
    const user = userEvent.setup();
    renderApp("/clientes");

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));
    await user.click(within(getNav()).getByRole("link", { name: "Casos" }));

    expect(getSidebar()).not.toHaveClass("sidebar-open");
  });
});

describe("Busca rápida", () => {
  it("abre o campo de busca com foco e fecha com Escape", async () => {
    const user = userEvent.setup();
    renderApp("/clientes");

    expect(
      screen.queryByRole("textbox", { name: "Buscar" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Buscar" }));

    expect(screen.getByRole("textbox", { name: "Buscar" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("textbox", { name: "Buscar" }),
    ).not.toBeInTheDocument();
  });
});
