import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8">
      <h1 className="text-xl font-bold text-slate-800">
        Página não encontrada
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        O endereço acessado não existe nesta aplicação.
      </p>
      <div className="mt-6">
        <Link className="text-sm font-semibold text-indigo-700" to="/">
          ← Voltar para a visão geral
        </Link>
      </div>
    </section>
  );
}
