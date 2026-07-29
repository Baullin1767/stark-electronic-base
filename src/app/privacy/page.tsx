import type { Metadata } from "next";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CONTACTS } from "@/lib/constants";
import { contentProps, text, type ContentKey } from "@/lib/content";

function ContactTemplate({ contentKey }: { contentKey: ContentKey }) {
  const links = {
    "{email}": <a href={CONTACTS.emailUrl}>{CONTACTS.email}</a>,
    "{telegram}": <a href={CONTACTS.telegramUrl}>{CONTACTS.telegram}</a>,
    "{phone}": <a href={CONTACTS.phoneUrl}>{CONTACTS.phone}</a>,
  } as const;

  return text(contentKey)
    .split(/(\{email\}|\{telegram\}|\{phone\})/g)
    .map((part, index) => (
      <span key={`${part}-${index}`}>
        {part in links ? links[part as keyof typeof links] : part}
      </span>
    ));
}

export const metadata: Metadata = {
  title: text("privacy.meta_title"),
  description: text("privacy.meta_description"),
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="privacy-page section-shell">
        <Link className="back-link" href="/">
          <ArrowLeft size={17} /> <span {...contentProps("privacy.back")}>{text("privacy.back")}</span>
        </Link>
        <header>
          <span className="section-number" {...contentProps("privacy.section")}>{text("privacy.section")}</span>
          <h1 {...contentProps("privacy.title")}>{text("privacy.title")}</h1>
          <p {...contentProps("privacy.updated")}>{text("privacy.updated")}</p>
        </header>

        <div className="privacy-layout">
          <aside>
            <strong {...contentProps("privacy.short_title")}>{text("privacy.short_title")}</strong>
            <p {...contentProps("privacy.short_text")}>{text("privacy.short_text")}</p>
            <a href={CONTACTS.emailUrl}>
              <Mail size={17} /> <span {...contentProps("privacy.delete_request")}>{text("privacy.delete_request")}</span>
            </a>
          </aside>
          <article className="legal-copy">
            <section>
              <h2 {...contentProps("privacy.data.title")}>{text("privacy.data.title")}</h2>
              <p {...contentProps("privacy.data.text")}>{text("privacy.data.text")}</p>
            </section>
            <section>
              <h2 {...contentProps("privacy.purpose.title")}>{text("privacy.purpose.title")}</h2>
              <p {...contentProps("privacy.purpose.text")}>{text("privacy.purpose.text")}</p>
            </section>
            <section>
              <h2 {...contentProps("privacy.destination.title")}>{text("privacy.destination.title")}</h2>
              <p {...contentProps("privacy.destination.text")}>{text("privacy.destination.text")}</p>
            </section>
            <section>
              <h2 {...contentProps("privacy.retention.title")}>{text("privacy.retention.title")}</h2>
              <p {...contentProps("privacy.retention.text")}>{text("privacy.retention.text")}</p>
            </section>
            <section>
              <h2 {...contentProps("privacy.delete.title")}>{text("privacy.delete.title")}</h2>
              <p {...contentProps("privacy.delete.text")}>
                <ContactTemplate contentKey="privacy.delete.text" />
              </p>
            </section>
            <section>
              <h2 {...contentProps("privacy.warning.title")}>{text("privacy.warning.title")}</h2>
              <p {...contentProps("privacy.warning.text")}>{text("privacy.warning.text")}</p>
            </section>
            <section>
              <h2 {...contentProps("privacy.owner.title")}>{text("privacy.owner.title")}</h2>
              <p {...contentProps("privacy.owner.text")}>
                <ContactTemplate contentKey="privacy.owner.text" />
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
