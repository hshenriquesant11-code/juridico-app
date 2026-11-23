/** Tipos de benefício iniciais (especificação, seção 6.4). */
export const benefitTypes = [
  "Aposentadoria por idade",
  "Aposentadoria por tempo de contribuição",
  "Aposentadoria especial",
  "Benefício por incapacidade temporária",
  "Aposentadoria por incapacidade permanente",
  "BPC/LOAS",
  "Pensão por morte",
  "Salário-maternidade",
  "Auxílio-acidente",
] as const;

export type BenefitType = (typeof benefitTypes)[number];
