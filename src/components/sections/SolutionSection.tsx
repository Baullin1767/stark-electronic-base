import { ArrowRight, Files, FolderHeart } from "lucide-react";
import { contentProps, text } from "@/lib/content";

export function SolutionSection() {
  return (
    <section className="solution section-shell" id="solution">
      <div className="section-heading centered">
        <span className="section-number" {...contentProps("solution.section")}>{text("solution.section")}</span>
        <h2 {...contentProps("solution.title")}>{text("solution.title")}</h2>
      </div>
      <div className="solution-flow">
        <div><Files aria-hidden="true" /><p {...contentProps("solution.before")}>{text("solution.before")}</p></div>
        <ArrowRight className="solution-arrow" aria-hidden="true" />
        <div className="solution-destination"><FolderHeart aria-hidden="true" /><p {...contentProps("solution.after")}>{text("solution.after")}</p></div>
      </div>
      <p className="solution-statement" {...contentProps("solution.statement")}>{text("solution.statement")}</p>
      <p className="solution-conclusion" {...contentProps("solution.conclusion")}>{text("solution.conclusion")}</p>
    </section>
  );
}
