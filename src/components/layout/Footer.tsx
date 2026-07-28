import { CONTACTS } from "@/lib/constants";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="brand footer-brand">
          <span className="brand-mark" aria-hidden="true">
            SE
          </span>
          <span>
            Stark
            <small>Electronic Base</small>
          </span>
        </div>
        <p>Клиентская база, которую можно вести обычным голосом.</p>
      </div>
      <div className="footer-links">
        <a href={CONTACTS.telegramUrl}>Telegram</a>
        <a href={CONTACTS.phoneUrl}>Телефон</a>
        <a href={CONTACTS.emailUrl}>Email</a>
        <Link href="/privacy">Конфиденциальность</Link>
      </div>
      <p className="footer-copy">© 2026 Stark Electronic Base</p>
    </footer>
  );
}
