import { Check } from "lucide-react";
import { contentProps, text } from "@/lib/content";

export function ChangesSection() {
  return (
    <section className="changes section-shell" id="changes">
      <div className="section-heading centered">
        <span className="section-number" {...contentProps("changes.section")}>{text("changes.section")}</span>
        <h2 {...contentProps("changes.title")}>{text("changes.title")}</h2>
      </div>
      <div className="comparison-wrap">
        <table className="comparison-table">
          <thead><tr>
            <th scope="col" {...contentProps("changes.before")}>{text("changes.before")}</th>
            <th scope="col" {...contentProps("changes.after")}>{text("changes.after")}</th>
          </tr></thead>
          <tbody>
            {([1, 2, 3, 4] as const).map((index) => (
              <tr key={index}>
                <td {...contentProps(`changes.row_${index}.before`)}>{text(`changes.row_${index}.before`)}</td>
                <td><Check size={18} aria-hidden="true" /><span {...contentProps(`changes.row_${index}.after`)}>{text(`changes.row_${index}.after`)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
