import { CONTACTS } from "@/lib/constants";
import { contentProps, text } from "@/lib/content";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="brand footer-brand">
          <span className="brand-mark" aria-hidden="true">
            <span {...contentProps("brand.mark")}>{text("brand.mark")}</span>
          </span>
          <span>
            <span {...contentProps("brand.name")}>{text("brand.name")}</span>
            <small {...contentProps("brand.subname")}>{text("brand.subname")}</small>
          </span>
        </div>
        <p {...contentProps("footer.description")}>{text("footer.description")}</p>
      </div>
      <div className="footer-links">
        <a href={CONTACTS.telegramUrl} {...contentProps("footer.telegram")}>{text("footer.telegram")}</a>
        <a href={CONTACTS.phoneUrl} {...contentProps("footer.phone")}>{text("footer.phone")}</a>
        <a href={CONTACTS.emailUrl} {...contentProps("footer.email")}>{text("footer.email")}</a>
        <Link href="/privacy" {...contentProps("footer.privacy")}>{text("footer.privacy")}</Link>
      </div>
      <p className="footer-copy" {...contentProps("footer.copyright")}>{text("footer.copyright")}</p>
    </footer>
  );
}
