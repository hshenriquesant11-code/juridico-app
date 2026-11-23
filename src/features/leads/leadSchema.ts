import { z } from "zod";
import { benefitTypes } from "../../types/benefits";

export const leadOrigins = ["Indicação", "Site", "Instagram", "Outro"] as const;

/**
 * Validação do cadastro de lead.
 *
 * Propositalmente NÃO coleta CPF: a especificação proíbe gravar CPF real sem
 * criptografia autenticada e chave HMAC configuradas (Sprint 2/3).
 */
export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Informe o nome completo.")
    .max(120, "O nome pode ter no máximo 120 caracteres."),
  phone: z
    .string()
    .refine(
      (value) => /^\d{10,11}$/.test(value.replace(/\D/g, "")),
      "Informe um telefone com DDD (10 ou 11 dígitos).",
    ),
  email: z.union([z.literal(""), z.email("Informe um e-mail válido.")]),
  benefit: z.enum(benefitTypes, { error: "Selecione o tipo de benefício." }),
  origin: z.enum(leadOrigins, { error: "Selecione a origem do contato." }),
  notes: z
    .string()
    .max(500, "As observações podem ter no máximo 500 caracteres."),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
