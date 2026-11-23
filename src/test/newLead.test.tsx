import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderApp } from "./renderApp";

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nome completo"), "Maria Fictícia");
  await user.type(screen.getByLabelText("Telefone"), "(11) 99999-0000");
  await user.selectOptions(
    screen.getByLabelText("Benefício de interesse"),
    "BPC/LOAS",
  );
  await user.selectOptions(screen.getByLabelText("Origem"), "Site");
}

describe("Formulário de novo lead", () => {
  it("mostra os erros dos campos obrigatórios ao enviar vazio", async () => {
    const user = userEvent.setup();
    renderApp("/leads/novo");

    await user.click(screen.getByRole("button", { name: "Validar cadastro" }));

    expect(await screen.findByText("Informe o nome completo.")).toBeVisible();
    expect(screen.getByText(/Informe um telefone com DDD/)).toBeVisible();
    expect(screen.getByText("Selecione o tipo de benefício.")).toBeVisible();
    expect(screen.getByText("Selecione a origem do contato.")).toBeVisible();
    expect(screen.getByLabelText("Nome completo")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("rejeita e-mail em formato inválido", async () => {
    const user = userEvent.setup();
    renderApp("/leads/novo");

    await fillValidForm(user);
    await user.type(screen.getByLabelText("E-mail (opcional)"), "sem-arroba");
    await user.click(screen.getByRole("button", { name: "Validar cadastro" }));

    expect(await screen.findByText("Informe um e-mail válido.")).toBeVisible();
  });

  it("aceita dados válidos e deixa claro que nada foi salvo", async () => {
    const user = userEvent.setup();
    renderApp("/leads/novo");

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Validar cadastro" }));

    expect(
      await screen.findByRole("heading", {
        name: "Cadastro validado (simulação)",
      }),
    ).toBeInTheDocument();
    const aviso = screen.getByText(/nada foi salvo/);
    expect(aviso).toHaveAttribute("role", "status");
    expect(aviso).toHaveTextContent("Maria Fictícia");
  });

  it("permite cadastrar outro lead com o formulário limpo", async () => {
    const user = userEvent.setup();
    renderApp("/leads/novo");

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Validar cadastro" }));
    await user.click(
      await screen.findByRole("button", { name: "Cadastrar outro" }),
    );

    expect(screen.getByLabelText("Nome completo")).toHaveValue("");
  });
});
