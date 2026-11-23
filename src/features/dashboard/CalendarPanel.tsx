import { Icon } from "../../components/ui/Icon";

// Calendário ESTÁTICO de demonstração (Novembro/2026). O calendário real
// (mensal, semanal e diário) pertence à Sprint 6.
const days = [
  26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
];
const eventIndexes = [4, 12, 18, 24, 31];

export function CalendarPanel() {
  return (
    <article className="panel calendar-panel">
      <div className="panel-heading">
        <div>
          <h2>Agenda</h2>
          <p>Seus próximos compromissos</p>
        </div>
        <button
          className="icon-button calendar-more"
          aria-label="Mais opções de agenda"
        >
          <Icon name="dots" />
        </button>
      </div>
      <div className="calendar-date">
        <button
          className="icon-button calendar-arrow"
          aria-label="Mês anterior"
        >
          ‹
        </button>
        <strong>Novembro 2026</strong>
        <button className="icon-button calendar-arrow" aria-label="Próximo mês">
          ›
        </button>
      </div>
      <div className="calendar-grid calendar-week">
        {["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"].map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>
      <div className="calendar-grid calendar-days">
        {days.map((day, index) => (
          <span
            key={`${day}-${index}`}
            className={`${index < 6 ? "muted-day" : ""} ${day === 22 && index === 27 ? "selected-day" : ""} ${eventIndexes.includes(index) ? "has-event" : ""}`}
          >
            {day}
          </span>
        ))}
      </div>
      <div className="calendar-bottom">
        <span className="event-dot" />{" "}
        <span>
          Você tem <strong>3 compromissos</strong> esta semana
        </span>
        <Icon name="chevron" size={14} />
      </div>
    </article>
  );
}
