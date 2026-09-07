import Image from "next/image";
import { MessageCircle, Sparkles } from "lucide-react";
import { DEMO_CLIENT } from "@/lib/constants";
import { contentProps, text } from "@/lib/content";

export function ExampleSection() {
  return (
    <section className="example section-shell" id="example">
      <div className="section-heading">
        <span className="section-number" {...contentProps("example.section")}>{text("example.section")}</span>
        <h2 {...contentProps("example.title")}>{text("example.title")}</h2>
        <p {...contentProps("example.description")}>{text("example.description")}</p>
      </div>
      <div className="example-layout">
        <div className="example-question">
          <span className="example-label" {...contentProps("example.label")}>{text("example.label")}</span>
          <h3><MessageCircle size={20} aria-hidden="true" /><span {...contentProps("example.query_label")}>{text("example.query_label")}</span></h3>
          <blockquote {...contentProps("example.query")}>{text("example.query")}</blockquote>
          <p {...contentProps("example.result")}>{text("example.result")}</p>
        </div>
        <article className="example-answer">
          <header><span className="window-avatar"><Sparkles size={20} aria-hidden="true" /></span><h3 {...contentProps("example.response_label")}>{text("example.response_label")}</h3></header>
          <p className="example-client">{DEMO_CLIENT.shortName} <span>•••• {DEMO_CLIENT.phoneLastDigits}</span></p>
          <p className="example-history-label" {...contentProps("example.history_label")}>{text("example.history_label")}</p>
          <dl>
            <div><dt {...contentProps("demo.table.issues")}>{text("demo.table.issues")}</dt><dd>{DEMO_CLIENT.issue}</dd></div>
            <div><dt {...contentProps("demo.ui.procedures")}>{text("demo.ui.procedures")}</dt><dd>{DEMO_CLIENT.procedure}</dd></div>
            <div><dt {...contentProps("demo.ui.recommendations")}>{text("demo.ui.recommendations")}</dt><dd>{DEMO_CLIENT.recommendation}</dd></div>
          </dl>
          <h4 {...contentProps("example.photos_label")}>{text("example.photos_label")}</h4>
          <div className="example-photos">
            {(["before", "after"] as const).map((kind) => (
              <figure key={kind}>
                <Image src={`/images/demo/${kind}.webp`} alt={text(`demo.ui.${kind}_photo`)} width={480} height={360} sizes="(max-width: 720px) 40vw, 260px" />
                <figcaption {...contentProps(`demo.ui.${kind}_photo`)}>{text(`demo.ui.${kind}_photo`)}</figcaption>
              </figure>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
