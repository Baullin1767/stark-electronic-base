import {
  FileImage,
  FileSpreadsheet,
  MessageSquareText,
  NotebookPen,
} from "lucide-react";

const chaosItems = [
  {
    icon: NotebookPen,
    title: "Блокнот",
    text: "Анна, повторный визит через 2 недели…",
    className: "chaos-a",
  },
  {
    icon: FileSpreadsheet,
    title: "clients_final_3.xlsx",
    text: "47 столбцов и разные форматы",
    className: "chaos-b",
  },
  {
    icon: FileImage,
    title: "Фото без подписи",
    text: "IMG_4028, IMG_4029",
    className: "chaos-c",
  },
  {
    icon: MessageSquareText,
    title: "Переписка",
    text: "Где были рекомендации?",
    className: "chaos-d",
  },
];

export function ProblemSection() {
  return (
    <section className="problem section-shell">
      <div className="section-heading">
        <span className="section-number">01 / Проблема</span>
        <h2>Знакомая ситуация?</h2>
        <p>
          Клиенты записаны в блокнотах, заметках, переписках и разных таблицах.
          Перед следующим приёмом приходится искать информацию сразу в
          нескольких местах.
        </p>
      </div>
      <div className="chaos-board" aria-label="Разрозненные записи о клиенте">
        <div className="chaos-orbit" />
        {chaosItems.map(({ icon: Icon, title, text, className }) => (
          <article className={`chaos-card ${className}`} key={title}>
            <span>
              <Icon size={19} />
            </span>
            <strong>{title}</strong>
            <p>{text}</p>
          </article>
        ))}
        <div className="chaos-center">
          <span>?</span>
          <strong>Один клиент</strong>
          <small>четыре разных места</small>
        </div>
      </div>
    </section>
  );
}
