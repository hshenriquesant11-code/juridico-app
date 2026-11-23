import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { benefitTypes } from "../../types/benefits";
import { leadOrigins, leadSchema, type LeadFormValues } from "./leadSchema";

const fieldClass =
  "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 aria-[invalid=true]:border-red-500";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function NewLeadPage() {
  const [savedName, setSavedName] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", phone: "", email: "", notes: "" },
  });

  const describe = (field: keyof LeadFormValues) =>
    errors[field] ? `${field}-error` : undefined;

  // MODO DEMONSTRAÇÃO: os dados validados não são enviados nem armazenados.
  const onSubmit = (values: LeadFormValues) => {
    setSavedName(values.name);
    reset();
  };

  if (savedName) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-8">
        <h1 className="text-xl font-bold text-slate-800">
          Cadastro validado (simulação)
        </h1>
        <p role="status" className="mt-2 max-w-xl text-sm text-slate-500">
          Os dados de <strong>{savedName}</strong> passaram na validação, mas
          nada foi salvo: o armazenamento real entra com o backend (Sprint 2).
        </p>
        <div className="mt-6 flex gap-4 text-sm font-semibold text-indigo-700">
          <button onClick={() => setSavedName(null)}>Cadastrar outro</button>
          <Link to="/">Voltar para a visão geral</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-2xl rounded-xl border border-slate-200 bg-white p-8">
      <h1 className="text-xl font-bold text-slate-800">Novo lead</h1>
      <p className="mt-1 text-sm text-slate-500">
        Use apenas dados fictícios. Nesta versão nada é gravado.
      </p>

      <form
        className="mt-6 grid gap-4"
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        noValidate
      >
        <Field id="name" label="Nome completo" error={errors.name?.message}>
          <input
            id="name"
            className={fieldClass}
            autoComplete="off"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describe("name")}
            {...register("name")}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="phone" label="Telefone" error={errors.phone?.message}>
            <input
              id="phone"
              type="tel"
              className={fieldClass}
              placeholder="(11) 99999-9999"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={describe("phone")}
              {...register("phone")}
            />
          </Field>
          <Field
            id="email"
            label="E-mail (opcional)"
            error={errors.email?.message}
          >
            <input
              id="email"
              type="email"
              className={fieldClass}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={describe("email")}
              {...register("email")}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="benefit"
            label="Benefício de interesse"
            error={errors.benefit?.message}
          >
            <select
              id="benefit"
              className={fieldClass}
              aria-invalid={Boolean(errors.benefit)}
              aria-describedby={describe("benefit")}
              {...register("benefit")}
            >
              <option value="">Selecione…</option>
              {benefitTypes.map((benefit) => (
                <option key={benefit} value={benefit}>
                  {benefit}
                </option>
              ))}
            </select>
          </Field>
          <Field id="origin" label="Origem" error={errors.origin?.message}>
            <select
              id="origin"
              className={fieldClass}
              aria-invalid={Boolean(errors.origin)}
              aria-describedby={describe("origin")}
              {...register("origin")}
            >
              <option value="">Selecione…</option>
              {leadOrigins.map((origin) => (
                <option key={origin} value={origin}>
                  {origin}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field id="notes" label="Observações" error={errors.notes?.message}>
          <textarea
            id="notes"
            rows={3}
            className={fieldClass}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={describe("notes")}
            {...register("notes")}
          />
        </Field>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            Validar cadastro
          </button>
          <Link to="/" className="text-sm font-semibold text-slate-500">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
