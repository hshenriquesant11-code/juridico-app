import { describe, expect, it } from "vitest";
import { leadSchema } from "../features/leads/leadSchema";

const valid = {
  name: "Maria Fictícia",
  phone: "(11) 99999-0000",
  email: "",
  benefit: "BPC/LOAS",
  origin: "Site",
  notes: "",
};

describe("leadSchema", () => {
  it("aceita um cadastro válido", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ["(11) 99999-0000", true],
    ["1133334444", true],
    ["11999990000", true],
    ["99999-0000", false],
    ["123", false],
    ["", false],
  ])("telefone %j → válido: %s", (phone, ok) => {
    expect(leadSchema.safeParse({ ...valid, phone }).success).toBe(ok);
  });

  it("e-mail é opcional, mas se informado precisa ser válido", () => {
    expect(leadSchema.safeParse({ ...valid, email: "" }).success).toBe(true);
    expect(
      leadSchema.safeParse({ ...valid, email: "a@exemplo.com" }).success,
    ).toBe(true);
    expect(leadSchema.safeParse({ ...valid, email: "a@" }).success).toBe(false);
  });

  it("rejeita nome curto e benefício fora da lista da especificação", () => {
    expect(leadSchema.safeParse({ ...valid, name: "Jo" }).success).toBe(false);
    expect(
      leadSchema.safeParse({ ...valid, benefit: "Benefício inventado" })
        .success,
    ).toBe(false);
  });

  it("limita observações a 500 caracteres", () => {
    expect(
      leadSchema.safeParse({ ...valid, notes: "x".repeat(501) }).success,
    ).toBe(false);
  });

  it("descarta campos desconhecidos, como CPF enviado por engano", () => {
    const result = leadSchema.safeParse({ ...valid, cpf: "123.456.789-09" });

    expect(result.success).toBe(true);
    if (result.success) expect("cpf" in result.data).toBe(false);
  });
});
