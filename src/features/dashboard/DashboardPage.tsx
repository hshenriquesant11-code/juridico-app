import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Sparkline } from "../../components/data-display/Sparkline";
import { Icon } from "../../components/ui/Icon";
import { getDashboardData } from "../../repositories/demoRepository";
import { CalendarPanel } from "./CalendarPanel";

const todayLabel = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
})
  .format(new Date())
  .toLocaleUpperCase("pt-BR");

export function DashboardPage() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["dashboard", "demo"],
    queryFn: getDashboardData,
  });

  return (
    <>
      <section className="welcome-row">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" /> {todayLabel}
          </div>
          <h1>
            Bom dia, Ana <span className="wave">✳</span>
          </h1>
          <p className="welcome-subtitle">
            Aqui está o resumo do seu escritório hoje.
          </p>
        </div>
        <Link className="primary-button" to="/leads/novo">
          <Icon name="plus" size={17} /> Novo cadastro
        </Link>
      </section>

      {isPending && <p role="status">Carregando painel…</p>}

      {isError && (
        <div role="alert">
          <p>Não foi possível carregar o painel.</p>
          <button className="text-button" onClick={() => void refetch()}>
            Tentar novamente
          </button>
        </div>
      )}

      {data && (
        <>
          <section className="stats-grid" aria-label="Resumo do escritório">
            {data.stats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <div className="stat-top">
                  <span className="stat-label">{stat.label}</span>
                  <span className={`stat-icon stat-icon-${stat.iconTone}`}>
                    <Icon name={stat.icon} />
                  </span>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-foot">
                  {stat.foot.map((item) => (
                    <span key={item.text} className={item.className}>
                      {item.text}
                    </span>
                  ))}
                </div>
                <Sparkline tone={stat.sparkTone} />
              </article>
            ))}
          </section>

          <section className="dashboard-grid">
            <article className="panel tasks-panel">
              <div className="panel-heading">
                <div>
                  <div className="panel-title-row">
                    <h2>Suas tarefas</h2>
                    <span className="soft-badge">4 pendentes</span>
                  </div>
                  <p>O que precisa da sua atenção</p>
                </div>
                <Link className="text-button" to="/tarefas">
                  Ver todas <Icon name="arrow" size={15} />
                </Link>
              </div>
              <div className="task-list">
                {data.tasks.map((task) => (
                  <div className="task-row" key={task.title}>
                    <button
                      className="task-check"
                      aria-label={`Concluir: ${task.title}`}
                    />
                    <div className={`person-avatar avatar-${task.tone}`}>
                      {task.initials}
                    </div>
                    <div className="task-copy">
                      <strong>{task.title}</strong>
                      <span>{task.person}</span>
                    </div>
                    <div className="task-time">
                      <Icon name="clock" size={14} />
                      {task.time}
                    </div>
                    <button
                      className="icon-button task-more"
                      aria-label="Mais opções"
                    >
                      <Icon name="dots" />
                    </button>
                  </div>
                ))}
              </div>
              <Link className="add-task-button" to="/tarefas">
                <Icon name="plus" size={16} /> Adicionar tarefa
              </Link>
            </article>

            <CalendarPanel />
          </section>

          <section className="panel leads-panel">
            <div className="panel-heading">
              <div>
                <div className="panel-title-row">
                  <h2>Leads recentes</h2>
                  <span className="new-count">+5 novos</span>
                </div>
                <p>Acompanhe seus contatos mais recentes</p>
              </div>
              <Link className="text-button" to="/leads">
                Ver todos <Icon name="arrow" size={15} />
              </Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>NOME</th>
                    <th>ORIGEM</th>
                    <th>INTERESSE</th>
                    <th>STATUS</th>
                    <th aria-label="Ações" />
                  </tr>
                </thead>
                <tbody>
                  {data.leads.map((lead) => (
                    <tr key={lead.name}>
                      <td>
                        <div className="lead-person">
                          <span className={`person-avatar avatar-${lead.tone}`}>
                            {lead.initials}
                          </span>
                          <strong>{lead.name}</strong>
                        </div>
                      </td>
                      <td>{lead.origin}</td>
                      <td>{lead.benefit}</td>
                      <td>
                        <span
                          className={`status-pill status-${lead.status.toLowerCase()}`}
                        >
                          <i />
                          {lead.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="icon-button row-more"
                          aria-label={`Opções para ${lead.name}`}
                        >
                          <Icon name="dots" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}
