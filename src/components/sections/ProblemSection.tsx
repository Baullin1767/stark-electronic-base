import {
  FileImage,
  FileSpreadsheet,
  MessageSquareText,
  NotebookPen,
} from "lucide-react";
import { contentProps, text } from "@/lib/content";

const chaosItems = [
  {
    icon: NotebookPen,
    title: text("problem.notebook_title"),
    titleKey: "problem.notebook_title" as const,
    value: text("problem.notebook_text"),
    valueKey: "problem.notebook_text" as const,
    className: "chaos-a",
  },
  {
    icon: FileSpreadsheet,
    title: text("problem.sheet_title"),
    titleKey: "problem.sheet_title" as const,
    value: text("problem.sheet_text"),
    valueKey: "problem.sheet_text" as const,
    className: "chaos-b",
  },
  {
    icon: FileImage,
    title: text("problem.photo_title"),
    titleKey: "problem.photo_title" as const,
    value: text("problem.photo_text"),
    valueKey: "problem.photo_text" as const,
    className: "chaos-c",
  },
  {
    icon: MessageSquareText,
    title: text("problem.chat_title"),
    titleKey: "problem.chat_title" as const,
    value: text("problem.chat_text"),
    valueKey: "problem.chat_text" as const,
    className: "chaos-d",
  },
];

export function ProblemSection() {
  return (
    <section className="problem section-shell">
      <div className="section-heading">
        <span className="section-number" {...contentProps("problem.section")}>{text("problem.section")}</span>
        <h2 {...contentProps("problem.title")}>{text("problem.title")}</h2>
        <p {...contentProps("problem.description")}>{text("problem.description")}</p>
      </div>
      <div className="chaos-board" aria-label={text("problem.board_aria")}>
        <div className="chaos-orbit" />
        {chaosItems.map(({ icon: Icon, title, titleKey, value, valueKey, className }) => (
          <article className={`chaos-card ${className}`} key={title}>
            <span>
              <Icon size={19} />
            </span>
            <strong {...contentProps(titleKey)}>{title}</strong>
            <p {...contentProps(valueKey)}>{value}</p>
          </article>
        ))}
        <div className="chaos-center">
          <span {...contentProps("problem.center_symbol")}>{text("problem.center_symbol")}</span>
          <strong {...contentProps("problem.center_title")}>{text("problem.center_title")}</strong>
          <small {...contentProps("problem.center_text")}>{text("problem.center_text")}</small>
        </div>
      </div>
    </section>
  );
}
