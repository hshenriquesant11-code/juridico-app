import { describe, expect, it } from "vitest";
import { getPageTitle } from "../app/navigation";

describe("getPageTitle", () => {
  it.each([
    ["/", "Visão geral"],
    ["/clientes", "Clientes"],
    ["/clientes/", "Clientes"],
    ["/leads/novo", "Novo lead"],
    ["/configuracoes", "Configurações"],
    ["/nada", "Página não encontrada"],
  ])("%s → %s", (path, title) => {
    expect(getPageTitle(path)).toBe(title);
  });
});
