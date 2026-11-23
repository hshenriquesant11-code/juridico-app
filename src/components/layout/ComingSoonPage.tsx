import { Link } from "react-router-dom";

interface ComingSoonPageProps {
  title: string;
  description: string;
  sprint?: string;
}

/** Página de módulo ainda não implementado. Nenhum dado é exibido aqui. */
export function ComingSoonPage({
  title,
  description,
  sprint,
}: ComingSoonPageProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8">
      <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      <p className="mt-2 max-w-xl text-sm text-slate-500">{description}</p>
      <p className="mt-4 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
        Ainda não implementado{sprint ? ` · previsto para a ${sprint}` : ""}
      </p>
      <div className="mt-6">
        <Link className="text-sm font-semibold text-indigo-700" to="/">
          ← Voltar para a visão geral
        </Link>
      </div>
    </section>
  );
}
